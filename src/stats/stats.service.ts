import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, QuizStatus } from '../quizzes/entities/quiz.entity';
import { Lead } from '../leads/entities/lead.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly projectsService: ProjectsService,
  ) {}

  async getQuizStats(quizId: string, userId: string) {
    // Verify quiz belongs to user
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['project'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    await this.projectsService.findOne(quiz.project_id, userId);

    const leadCount = await this.leadRepository.count({
      where: { quiz_id: quizId },
    });

    const recentLeads = await this.leadRepository.find({
      where: { quiz_id: quizId },
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      quiz_id: quizId,
      total_leads: leadCount,
      recent_leads: recentLeads.length,
      quiz_status: quiz.status,
      created_at: quiz.created_at,
      published_at: quiz.published_at,
    };
  }

  async getProjectStats(projectId: string, userId: string) {
    // Verify project belongs to user
    await this.projectsService.findOne(projectId, userId);

    const quizCount = await this.quizRepository.count({
      where: { project_id: projectId },
    });

    const totalLeads = await this.leadRepository.count({
      where: { project_id: projectId },
    });

    const publishedQuizzes = await this.quizRepository.count({
      where: { project_id: projectId, status: QuizStatus.PUBLISHED },
    });

    const recentLeads = await this.leadRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      project_id: projectId,
      total_quizzes: quizCount,
      published_quizzes: publishedQuizzes,
      total_leads: totalLeads,
      recent_leads: recentLeads.length,
    };
  }

  async getUserStats(userId: string) {
    const projectCount = await this.projectRepository.count({
      where: { user_id: userId },
    });

    const quizCount = await this.quizRepository
      .createQueryBuilder('quiz')
      .innerJoin('quiz.project', 'project')
      .where('project.user_id = :userId', { userId })
      .getCount();

    const totalLeads = await this.leadRepository
      .createQueryBuilder('lead')
      .innerJoin('lead.project', 'project')
      .where('project.user_id = :userId', { userId })
      .getCount();

    return {
      total_projects: projectCount,
      total_quizzes: quizCount,
      total_leads: totalLeads,
    };
  }
} 