import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectPermissionsService } from './project-permissions.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly projectPermissionsService: ProjectPermissionsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user_id: userId,
    });
    return this.projectRepository.save(project);
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectPermissionsService.getUserProjects(userId);
  }

  async findOne(id: string, userId: string): Promise<Project> {
    // Verificar se o usuário tem acesso ao projeto
    await this.projectPermissionsService.checkUserAccess(id, userId);

    const project = await this.projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOne(id, userId);
    
    // Verificar se o usuário é o criador do projeto ou tem permissão de gerenciar usuários
    const isCreator = project.user_id === userId;
    if (!isCreator) {
      await this.projectPermissionsService.checkUserPermission(id, userId, 'manage_users' as any);
    }
    
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    
    // Apenas o criador pode remover o projeto
    if (project.user_id !== userId) {
      throw new ForbiddenException('Only the project creator can delete the project');
    }
    
    await this.projectRepository.remove(project);
  }
} 