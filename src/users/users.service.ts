import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UserInvite } from './entities/user-invite.entity';
import { UserPermission } from './entities/user-permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepository: Repository<UserInvite>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async findAll(requestingUserId: string, search?: string): Promise<User[]> {
    // Verificar se o usuário que está fazendo a requisição é creator ou system_admin
    const requestingUser = await this.findOne(requestingUserId);
    
    if (requestingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only system admins can view all users');
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (search) {
      queryBuilder.where(
        'user.name LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` }
      );
    }
    
    return queryBuilder
      .select(['user.id', 'user.name', 'user.email', 'user.role', 'user.created_at'])
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }

  async findAssistantsByCreator(creatorId: string, search?: string): Promise<any[]> {
    // Verificar se o usuário que está fazendo a requisição é creator ou system_admin
    const requestingUser = await this.findOne(creatorId);
    
    if (requestingUser.role !== UserRole.CREATOR && requestingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only creators and system admins can view assistants');
    }

    // Buscar assistants com suas permissões usando LEFT JOIN com collation explícita
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .where('user.role = :role', { role: UserRole.ASSISTANT })
      .andWhere('user.created_by_user_id = :creatorId', { creatorId });

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Usar query raw para especificar collation explicitamente
    const assistants = await this.userRepository.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        u.avatar_url,
        u.created_by_user_id,
        up.permissions
      FROM users u
      LEFT JOIN user_permissions up ON up.user_id = u.id COLLATE utf8mb4_0900_ai_ci
      WHERE u.role = ? 
        AND u.created_by_user_id = ?
        ${search ? "AND (u.name LIKE ? OR u.email LIKE ?)" : ""}
      ORDER BY u.created_at DESC
    `, [
      UserRole.ASSISTANT,
      creatorId,
      ...(search ? [`%${search}%`, `%${search}%`] : [])
    ]);

    // Formatar os dados para retornar no formato esperado pelo frontend
    return assistants.map(assistant => ({
      id: assistant.id,
      name: assistant.name,
      email: assistant.email,
      role: assistant.role,
      created_at: assistant.created_at,
      avatar_url: assistant.avatar_url,
      created_by_user_id: assistant.created_by_user_id,
      default_permissions: assistant.permissions || []
    }));
  }

  async findOne(id: string, requestingUserId?: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Se não foi passado requestingUserId, retorna o usuário (para uso interno)
    if (!requestingUserId) {
      return user;
    }

    // Verificar permissões se foi passado requestingUserId
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // System admins podem ver qualquer usuário
    if (requestingUser.role === UserRole.SYSTEM_ADMIN) {
      return user;
    }

    // Creators podem ver usuários que eles criaram e a si mesmos
    if (requestingUser.role === UserRole.CREATOR) {
      if (requestingUserId === id || user.created_by_user_id === requestingUserId) {
        return user;
      }
      throw new ForbiddenException('You can only view users that you created');
    }

    // Assistants só podem ver a si mesmos
    if (requestingUserId === id) {
      return user;
    }

    throw new ForbiddenException('You can only view your own profile');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: Partial<User>, requestingUserId: string): Promise<User> {
    const user = await this.findOne(id);
    const requestingUser = await this.findOne(requestingUserId);
    
    // Verificar permissões
    if (requestingUser.role !== UserRole.CREATOR && requestingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only creators and system admins can update users');
    }

    // Creators não podem atualizar system admins
    if (requestingUser.role === UserRole.CREATOR && user.role === UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Creators cannot update system admins');
    }

    // Creators só podem atualizar usuários que eles criaram
    if (requestingUser.role === UserRole.CREATOR && user.created_by_user_id !== requestingUserId) {
      throw new ForbiddenException('You can only update users that you created');
    }

    // Remover campos que não devem ser atualizados
    const { id: _, created_at, updated_at, permissions, ...updateData } = updateUserDto;
    
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: string, requestingUserId: string): Promise<void> {
    const user = await this.findOne(id);
    const requestingUser = await this.findOne(requestingUserId);
    
    // Verificar permissões
    if (requestingUser.role !== UserRole.CREATOR && requestingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only creators and system admins can delete users');
    }

    // System admins podem deletar qualquer usuário
    if (requestingUser.role === UserRole.SYSTEM_ADMIN) {
      await this.userRepository.remove(user);
      return;
    }

    // Creators só podem deletar usuários que eles criaram
    if (requestingUser.role === UserRole.CREATOR) {
      // Verificar se o usuário foi criado pelo creator
      if (user.created_by_user_id !== requestingUserId) {
        throw new ForbiddenException('You can only delete users that you created');
      }

      await this.userRepository.remove(user);
      return;
    }

    throw new ForbiddenException('Insufficient permissions to delete user');
  }
} 