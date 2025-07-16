import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { User, UserRole, ProjectPermission } from './entities/user.entity';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserPermissions(userId: string, requestingUserId?: string): Promise<ProjectPermission[]> {
    // Se não foi passado requestingUserId, retorna as permissões (para uso interno)
    if (!requestingUserId) {
      const userPermission = await this.userPermissionRepository.findOne({
        where: { user_id: userId },
      });

      return userPermission?.permissions || [];
    }

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar permissões do usuário que está fazendo a requisição
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // System admins podem ver permissões de qualquer usuário
    if (requestingUser.role === UserRole.SYSTEM_ADMIN) {
      const userPermission = await this.userPermissionRepository.findOne({
        where: { user_id: userId },
      });

      return userPermission?.permissions || [];
    }

    // Creators podem ver permissões de usuários que eles criaram
    if (requestingUser.role === UserRole.CREATOR) {
      if (user.created_by_user_id === requestingUserId) {
        const userPermission = await this.userPermissionRepository.findOne({
          where: { user_id: userId },
        });

        return userPermission?.permissions || [];
      }
      throw new ForbiddenException('You can only view permissions for users that you created');
    }

    // Assistants só podem ver suas próprias permissões
    if (requestingUserId === userId) {
      const userPermission = await this.userPermissionRepository.findOne({
        where: { user_id: userId },
      });

      return userPermission?.permissions || [];
    }

    throw new ForbiddenException('You can only view your own permissions');
  }

  async updateUserPermissions(
    userId: string, 
    permissions: ProjectPermission[], 
    requestingUserId: string
  ): Promise<UserPermission> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar permissões do usuário que está fazendo a requisição
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Apenas creators e system admins podem atualizar permissões
    if (requestingUser.role !== UserRole.CREATOR && requestingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only creators and system admins can update user permissions');
    }

    // Creators não podem atualizar permissões de system admins
    if (requestingUser.role === UserRole.CREATOR && user.role === UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Creators cannot update system admin permissions');
    }

    // Creators só podem atualizar permissões de usuários que eles criaram
    if (requestingUser.role === UserRole.CREATOR && user.created_by_user_id !== requestingUserId) {
      throw new ForbiddenException('You can only update permissions for users that you created');
    }

    // Buscar ou criar registro de permissões
    let userPermission = await this.userPermissionRepository.findOne({
      where: { user_id: userId },
    });

    if (!userPermission) {
      // Criar novo registro de permissões
      userPermission = this.userPermissionRepository.create({
        user_id: userId,
        permissions: permissions,
      });
    } else {
      // Atualizar permissões existentes
      userPermission.permissions = permissions;
    }

    return this.userPermissionRepository.save(userPermission);
  }

  async createUserPermissions(userId: string, permissions: ProjectPermission[]): Promise<UserPermission> {
    const userPermission = this.userPermissionRepository.create({
      user_id: userId,
      permissions: permissions,
    });

    return this.userPermissionRepository.save(userPermission);
  }

  async deleteUserPermissions(userId: string): Promise<void> {
    const userPermission = await this.userPermissionRepository.findOne({
      where: { user_id: userId },
    });

    if (userPermission) {
      await this.userPermissionRepository.remove(userPermission);
    }
  }
} 