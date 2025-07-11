import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadResponseDto, QuestionResponseDto } from './dto/lead-response.dto';
import { QuizzesService } from '../quizzes/quizzes.service';
import { ProjectsService } from '../projects/projects.service';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly quizzesService: QuizzesService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(quizId: string, createLeadDto: CreateLeadDto): Promise<Lead> {
    // Get quiz to verify it exists and get project_id
    const quiz = await this.quizzesService.findOneAny(quizId); // Public access for leads

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Verificar se o projeto existe (sem verificar permissões de usuário)
    const projectExists = await this.projectRepository.findOne({
      where: { id: quiz.project_id },
      select: ['id']
    });

    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    const lead = this.leadRepository.create({
      ...createLeadDto,
      quiz_id: quizId,
      project_id: quiz.project_id,
    });

    const savedLead = await this.leadRepository.save(lead);

    // Update quiz lead count (without user verification for public access)
    quiz.lead_count = (quiz.lead_count || 0) + 1;
    await this.quizRepository.save(quiz);

    return savedLead;
  }

  async findAllByQuiz(quizId: string, userId: string): Promise<LeadResponseDto[]> {
    // Verify quiz belongs to user
    const quiz = await this.quizzesService.findOne(quizId, userId);

    const leads = await this.leadRepository.find({
      where: { quiz_id: quizId },
      order: { created_at: 'DESC' },
    });

    // Process leads to include detailed responses
    const leadsWithDetails = await this.processLeadsWithDetails(leads, quiz);

    return leadsWithDetails;
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

  private async processLeadsWithDetails(leads: Lead[], quiz: Quiz): Promise<LeadResponseDto[]> {
    // Extract questions from quiz JSON
    const quizQuestions = this.extractQuestionsFromQuiz(quiz.quiz_json);
    
    return leads.map(lead => {
      const detailedResponses: QuestionResponseDto[] = [];
      
      // Process each response
      Object.entries(lead.responses || {}).forEach(([questionId, answer]) => {
        const question = quizQuestions.find(q => q.id === questionId);
        
        if (question) {
          detailedResponses.push({
            question_id: questionId,
            question_text: question.text || question.title || 'Pergunta sem título',
            question_type: question.type || 'text',
            answer: answer,
            required: question.required || false
          });
        } else {
          // If question not found in quiz, still include the response
          detailedResponses.push({
            question_id: questionId,
            question_text: `Pergunta ${questionId}`,
            question_type: 'unknown',
            answer: answer,
            required: false
          });
        }
      });

      return {
        id: lead.id,
        quiz_id: lead.quiz_id,
        project_id: lead.project_id,
        email: lead.email,
        name: lead.name,
        phone: lead.phone,
        custom_fields: lead.custom_fields,
        responses: lead.responses,
        source: lead.source,
        created_at: lead.created_at,
        detailed_responses: detailedResponses
      };
    });
  }

  private extractQuestionsFromQuiz(quizJson: any): any[] {
    try {
      // Handle different quiz JSON structures
      if (quizJson.questions && Array.isArray(quizJson.questions)) {
        return quizJson.questions;
      }
      
      if (quizJson.blocks && Array.isArray(quizJson.blocks)) {
        // Extract questions from blocks
        const questions: any[] = [];
        quizJson.blocks.forEach((block: any) => {
          if (block.type === 'question' && block.data) {
            questions.push(block.data);
          }
        });
        return questions;
      }
      
      // If it's a direct array of questions
      if (Array.isArray(quizJson)) {
        return quizJson;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  }
} 