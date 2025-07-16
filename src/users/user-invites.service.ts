import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserInvite } from './entities/user-invite.entity';
import { User } from './entities/user.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserRole, ProjectPermission } from './entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class UserInvitesService {
  constructor(
    @InjectRepository(UserInvite)
    private readonly userInviteRepository: Repository<UserInvite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async inviteUser(email: string, invitedByUserId: string, defaultPermissions?: ProjectPermission[]): Promise<UserInvite> {
    // Verificar se o usuário que está convidando é creator ou system_admin
    const invitingUser = await this.userRepository.findOne({
      where: { id: invitedByUserId },
    });

    if (!invitingUser) {
      throw new NotFoundException('User not found');
    }

    if (invitingUser.role !== UserRole.CREATOR && invitingUser.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only creators and system admins can invite users');
    }

    // Verificar se já existe um convite pendente para este email
    const existingInvite = await this.userInviteRepository.findOne({
      where: { invited_by_user_id: invitedByUserId, email },
    });

    if (existingInvite && !existingInvite.accepted) {
      throw new BadRequestException('User already has a pending invite');
    }

    // Verificar se já existe um usuário com este email
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Gerar token único para o convite
    const token = randomBytes(32).toString('hex');
    
    // Definir expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Criar o convite
    const invite = this.userInviteRepository.create({
      invited_by_user_id: invitedByUserId,
      email,
      default_permissions: defaultPermissions || [],
      token,
      expires_at: expiresAt,
    });

    const savedInvite = await this.userInviteRepository.save(invite);

    // TODO: Enviar email com o link de convite
    // await this.sendInviteEmail(email, token, invitingUser.name);

    return savedInvite;
  }

  async acceptInvite(token: string, userData: { name: string; password: string }): Promise<User> {
    // Buscar o convite pelo token
    const invite = await this.userInviteRepository.findOne({
      where: { token },
    });

    if (!invite) {
      throw new NotFoundException('Invalid invite token');
    }

    if (invite.accepted) {
      throw new BadRequestException('Invite has already been accepted');
    }

    if (invite.expires_at && new Date() > invite.expires_at) {
      throw new BadRequestException('Invite has expired');
    }

    // Verificar se já existe um usuário com este email
    const existingUser = await this.userRepository.findOne({
      where: { email: invite.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Criar novo usuário como assistant
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      name: userData.name,
      email: invite.email,
      password_hash: passwordHash,
      role: UserRole.ASSISTANT,
      created_by_user_id: invite.invited_by_user_id, // vincula ao creator
    });

    const savedUser = await this.userRepository.save(user);

    // Criar permissões do usuário baseadas no convite
    if (invite.default_permissions && invite.default_permissions.length > 0) {
      const userPermission = this.userPermissionRepository.create({
        user_id: savedUser.id,
        permissions: invite.default_permissions,
      });
      await this.userPermissionRepository.save(userPermission);
    }

    // Marcar convite como aceito
    invite.accepted = true;
    await this.userInviteRepository.save(invite);

    return savedUser;
  }

  async getInviteByToken(token: string): Promise<UserInvite> {
    const invite = await this.userInviteRepository.findOne({
      where: { token },
      relations: ['invitedByUser'],
    });

    if (!invite) {
      throw new NotFoundException('Invalid invite token');
    }

    if (invite.accepted) {
      throw new BadRequestException('Invite has already been accepted');
    }

    if (invite.expires_at && new Date() > invite.expires_at) {
      throw new BadRequestException('Invite has expired');
    }

    return invite;
  }

  async getUserInvites(userId: string): Promise<UserInvite[]> {
    return this.userInviteRepository.find({
      where: { invited_by_user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async updateInvite(
    inviteId: string, 
    requestingUserId: string, 
    newEmail?: string, 
    newPermissions?: ProjectPermission[]
  ): Promise<UserInvite> {
    const invite = await this.userInviteRepository.findOne({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Verificar se o usuário que está atualizando é quem criou o convite
    if (invite.invited_by_user_id !== requestingUserId) {
      throw new ForbiddenException('You can only update your own invites');
    }

    // Verificar se o convite já foi aceito
    if (invite.accepted) {
      throw new BadRequestException('Cannot update an already accepted invite');
    }

    // Se está mudando o email, verificar se não existe outro usuário com esse email
    if (newEmail && newEmail !== invite.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: newEmail },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Verificar se já existe um convite pendente para este novo email
      const existingInvite = await this.userInviteRepository.findOne({
        where: { 
          invited_by_user_id: requestingUserId, 
          email: newEmail,
          id: Not(inviteId) // Excluir o convite atual da busca
        },
      });

      if (existingInvite && !existingInvite.accepted) {
        throw new BadRequestException('There is already a pending invite for this email');
      }

      invite.email = newEmail;
    }

    // Atualizar permissões se fornecidas
    if (newPermissions !== undefined) {
      invite.default_permissions = newPermissions;
    }

    return this.userInviteRepository.save(invite);
  }

  async cancelInvite(inviteId: string, requestingUserId: string): Promise<void> {
    const invite = await this.userInviteRepository.findOne({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Verificar se o usuário que está cancelando é quem criou o convite
    if (invite.invited_by_user_id !== requestingUserId) {
      throw new ForbiddenException('You can only cancel your own invites');
    }

    await this.userInviteRepository.remove(invite);
  }
} 