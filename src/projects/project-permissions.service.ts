import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';
import { ProjectPermission, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectPermissionsService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async addUserToProject(
    projectId: string,
    userId: string,
    permissions: ProjectPermission[],
    addedByUserId: string,
  ): Promise<ProjectUser> {
    // Verificar se o projeto existe
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verificar se o usuário que está adicionando tem permissão
    await this.checkUserPermission(projectId, addedByUserId, ProjectPermission.MANAGE_USERS);

    // Verificar se o usuário a ser adicionado existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar se o usuário já está no projeto
    const existingProjectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (existingProjectUser) {
      throw new ForbiddenException('User is already added to this project');
    }

    // Criar o relacionamento
    const projectUser = this.projectUserRepository.create({
      project_id: projectId,
      user_id: userId,
      permissions,
    });

    return this.projectUserRepository.save(projectUser);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
    removedByUserId: string,
  ): Promise<void> {
    // Verificar se o usuário que está removendo tem permissão
    await this.checkUserPermission(projectId, removedByUserId, ProjectPermission.MANAGE_USERS);

    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new NotFoundException('User is not part of this project');
    }

    await this.projectUserRepository.remove(projectUser);
  }

  async updateUserPermissions(
    projectId: string,
    userId: string,
    permissions: ProjectPermission[],
    updatedByUserId: string,
  ): Promise<ProjectUser> {
    // Verificar se o usuário que está atualizando tem permissão
    await this.checkUserPermission(projectId, updatedByUserId, ProjectPermission.MANAGE_USERS);

    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new NotFoundException('User is not part of this project');
    }

    projectUser.permissions = permissions;
    return this.projectUserRepository.save(projectUser);
  }

  async getProjectUsers(projectId: string, requestingUserId: string): Promise<ProjectUser[]> {
    // Verificar se o usuário tem acesso ao projeto
    await this.checkUserAccess(projectId, requestingUserId);

    return this.projectUserRepository.find({
      where: { project_id: projectId },
      relations: ['user'],
    });
  }

  async checkUserPermission(
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

    if (user?.role === UserRole.SYSTEM_ADMIN) {
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

  async checkUserAccess(projectId: string, userId: string): Promise<boolean> {
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

    if (user?.role === UserRole.SYSTEM_ADMIN) {
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

  async getUserProjects(userId: string): Promise<Project[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user?.role === UserRole.SYSTEM_ADMIN) {
      // System admin pode ver todos os projetos
      return this.projectRepository.find({
        order: { created_at: 'DESC' },
      });
    }

    // Buscar projetos onde o usuário é criador
    const ownedProjects = await this.projectRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    // Buscar projetos onde o usuário tem acesso como assistant
    const sharedProjects = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.projectUsers', 'projectUser')
      .where('projectUser.user_id = :userId', { userId })
      .orderBy('project.created_at', 'DESC')
      .getMany();

    return [...ownedProjects, ...sharedProjects];
  }
} 