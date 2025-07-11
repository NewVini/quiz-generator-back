import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, QuizStatus } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(createQuizDto: CreateQuizDto, projectId: string, userId: string): Promise<Quiz> {
    // Verify project belongs to user
    await this.projectsService.findOne(projectId, userId);

    const quiz = this.quizRepository.create({
      ...createQuizDto,
      project_id: projectId,
    });
    return this.quizRepository.save(quiz);
  }

  async findAllByProject(projectId: string, userId: string): Promise<Quiz[]> {
    // Verify project belongs to user
    await this.projectsService.findOne(projectId, userId);

    return this.quizRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Verify project belongs to user
    await this.projectsService.findOne(quiz.project_id, userId);

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    
    Object.assign(quiz, updateQuizDto);
    return this.quizRepository.save(quiz);
  }

  async remove(id: string, userId: string): Promise<void> {
    const quiz = await this.findOne(id, userId);
    await this.quizRepository.remove(quiz);
  }

  async publish(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    
    quiz.status = QuizStatus.PUBLISHED;
    quiz.published_at = new Date();
    
    return this.quizRepository.save(quiz);
  }

  async unpublish(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    
    quiz.status = QuizStatus.DRAFT;
    quiz.published_at = null;
    
    return this.quizRepository.save(quiz);
  }

  async archive(id: string, userId: string): Promise<Quiz> {
    const quiz = await this.findOne(id, userId);
    
    quiz.status = QuizStatus.ARCHIVED;
    
    return this.quizRepository.save(quiz);
  }

  async findOnePublic(id: string): Promise<Quiz | null> {
    const quiz = await this.quizRepository.findOne({
      where: { 
        id,
        status: QuizStatus.PUBLISHED // Apenas quizzes publicados
      },
      relations: ['project'],
    });

    if (!quiz) {
      return null;
    }

    return quiz;
  }

  async findPublicByProject(projectId: string): Promise<Quiz[]> {
    return this.quizRepository.find({
      where: { 
        project_id: projectId,
        status: QuizStatus.PUBLISHED // Apenas quizzes publicados
      },
      relations: ['project'],
      order: { published_at: 'DESC' },
    });
  }

  async findOneAny(id: string): Promise<Quiz | null> {
    // Buscar quiz sem relations para evitar problemas de permissão
    const quiz = await this.quizRepository.findOne({
      where: { id },
      select: ['id', 'name', 'project_id', 'status', 'quiz_json', 'settings', 'lead_count', 'created_at', 'updated_at', 'published_at']
    });

    if (!quiz) {
      return null;
    }

    return quiz;
  }
} 