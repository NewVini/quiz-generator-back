import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    private readonly quizzesService: QuizzesService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(quizId: string, createLeadDto: CreateLeadDto): Promise<Lead> {
    // Get quiz to verify it exists and get project_id
    const quiz = await this.quizzesService.findOne(quizId, 'public'); // Public access for leads

    const lead = this.leadRepository.create({
      ...createLeadDto,
      quiz_id: quizId,
      project_id: quiz.project_id,
    });

    const savedLead = await this.leadRepository.save(lead);

    // Update quiz lead count
    await this.quizzesService.update(quizId, { lead_count: quiz.lead_count + 1 }, 'public');

    return savedLead;
  }

  async findAllByQuiz(quizId: string, userId: string): Promise<Lead[]> {
    // Verify quiz belongs to user
    await this.quizzesService.findOne(quizId, userId);

    return this.leadRepository.find({
      where: { quiz_id: quizId },
      order: { created_at: 'DESC' },
    });
  }

  async findAllByProject(projectId: string, userId: string): Promise<Lead[]> {
    // Verify project belongs to user
    await this.projectsService.findOne(projectId, userId);

    return this.leadRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['quiz', 'project'],
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Verify project belongs to user
    await this.projectsService.findOne(lead.project_id, userId);

    return lead;
  }
} 