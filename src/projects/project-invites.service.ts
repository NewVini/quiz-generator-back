import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectUser } from './entities/project-user.entity';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectPermission } from '../users/entities/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class ProjectInvitesService {
  constructor(
    @InjectRepository(ProjectInvite)
    private readonly projectInviteRepository: Repository<ProjectInvite>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async inviteUserToProject(
    projectId: string,
    email: string,
    permissions: ProjectPermission[],
    invitedByUserId: string,
  ): Promise<ProjectInvite> {
    // Verificar se o projeto existe
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verificar se o usuário que está convidando tem permissão
    await this.checkUserPermission(projectId, invitedByUserId, 'manage_users' as any);

    // Verificar se já existe um convite pendente para este email neste projeto
    const existingInvite = await this.projectInviteRepository.findOne({
      where: { project_id: projectId, email },
    });

    if (existingInvite && !existingInvite.accepted) {
      throw new BadRequestException('User already has a pending invite for this project');
    }

    // Verificar se o usuário já está no projeto
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      const existingProjectUser = await this.projectUserRepository.findOne({
        where: { project_id: projectId, user_id: existingUser.id },
      });

      if (existingProjectUser) {
        throw new BadRequestException('User is already part of this project');
      }
    }

    // Gerar token único para o convite
    const token = randomBytes(32).toString('hex');
    
    // Definir expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Criar o convite
    const invite = this.projectInviteRepository.create({
      project_id: projectId,
      email,
      permissions,
      token,
      expires_at: expiresAt,
    });

    const savedInvite = await this.projectInviteRepository.save(invite);
    console.log(savedInvite);
    // TODO: Enviar email com o link de convite
    // await this.sendInviteEmail(email, token, project.name);

    return savedInvite;
  }

  async acceptInvite(token: string, userData: { name: string; password: string }): Promise<{ user: User; project: Project }> {
    // Buscar o convite pelo token
    const invite = await this.projectInviteRepository.findOne({
      where: { token },
      relations: ['project'],
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
    let user = await this.userRepository.findOne({
      where: { email: invite.email },
    });

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }

    // Criar novo usuário
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(userData.password, 10);

    user = this.userRepository.create({
      name: userData.name,
      email: invite.email,
      password_hash: passwordHash,
      role: 'assistant' as any, // Usar o novo enum
    });

    await this.userRepository.save(user);

    // Adicionar usuário ao projeto
    const projectUser = this.projectUserRepository.create({
      project_id: invite.project_id,
      user_id: user.id,
      permissions: invite.permissions,
    });

    await this.projectUserRepository.save(projectUser);

    // Marcar convite como aceito
    invite.accepted = true;
    await this.projectInviteRepository.save(invite);

    return { user, project: invite.project };
  }

  async getInviteByToken(token: string): Promise<ProjectInvite> {
    const invite = await this.projectInviteRepository.findOne({
      where: { token },
      relations: ['project'],
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

  async getProjectInvites(projectId: string, requestingUserId: string): Promise<ProjectInvite[]> {
    // Verificar se o usuário tem acesso ao projeto
    await this.checkUserAccess(projectId, requestingUserId);

    return this.projectInviteRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
    });
  }

  async cancelInvite(inviteId: string, requestingUserId: string): Promise<void> {
    const invite = await this.projectInviteRepository.findOne({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Verificar se o usuário tem permissão para cancelar o convite
    await this.checkUserPermission(invite.project_id, requestingUserId, 'manage_users' as any);

    await this.projectInviteRepository.remove(invite);
  }

  private async checkUserPermission(
    projectId: string,
    userId: string,
    permission: ProjectPermission,
  ): Promise<boolean> {
    // Verificar se o usuário é o criador do projeto
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (project) {
      return true; // O criador tem todas as permissões
    }

    // Verificar se o usuário é system_admin
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user?.role === 'system_admin') {
      return true; // System admin tem todas as permissões
    }

    // Verificar permissões específicas do usuário no projeto
    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new ForbiddenException('User does not have access to this project');
    }

    if (!projectUser.permissions.includes(permission)) {
      throw new ForbiddenException(`User does not have permission: ${permission}`);
    }

    return true;
  }

  private async checkUserAccess(projectId: string, userId: string): Promise<boolean> {
    // Verificar se o usuário é o criador do projeto
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user_id: userId },
    });

    if (project) {
      return true;
    }

    // Verificar se o usuário é system_admin
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user?.role === 'system_admin') {
      return true;
    }

    // Verificar se o usuário tem acesso ao projeto
    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new ForbiddenException('User does not have access to this project');
    }

    return true;
  }
} 