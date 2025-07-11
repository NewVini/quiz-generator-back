import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery
} from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { PublicQuizDto } from './dto/public-quiz.dto';

@ApiTags('Quizzes')
@Controller('quizzes')
export class PublicQuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all published quizzes by project',
    description: 'Retrieves all published quizzes for a specific project. This endpoint is publicly accessible and does not require authentication.',
    operationId: 'getPublicQuizzesByProject'
  })
  @ApiQuery({ 
    name: 'projectId', 
    description: 'ID do projeto para filtrar os quizzes',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
    required: true
  })
  @ApiOkResponse({ 
    description: 'List of published quizzes retrieved successfully',
    type: [PublicQuizDto],
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Quiz de Matemática Básica',
          status: 'published',
          quiz_json: {
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Qual é o resultado de 2 + 2?',
                options: ['3', '4', '5', '6'],
                correct_answer: 1
              }
            ]
          },
          settings: {
            theme: 'default',
            show_results: true
          },
          published_at: '2024-01-15T10:30:00.000Z',
          created_at: '2024-01-10T14:20:00.000Z',
          project: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Escola Online',
            domain: 'escolaonline.com',
            logo: 'https://example.com/logo.png'
          }
        }
      ]
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid project ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid project ID format',
        error: 'Bad Request'
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error'
      }
    }
  })
  async findAllByProject(@Query('projectId') projectId: string): Promise<PublicQuizDto[]> {
    const quizzes = await this.quizzesService.findPublicByProject(projectId);
    
    return quizzes.map(quiz => ({
      id: quiz.id,
      name: quiz.name,
      status: quiz.status,
      quiz_json: quiz.quiz_json,
      settings: quiz.settings,
      published_at: quiz.published_at || undefined,
      created_at: quiz.created_at,
      project: {
        id: quiz.project.id,
        name: quiz.project.name,
        domain: quiz.project.domain,
        logo: quiz.project.logo,
      },
    }));
  }

  @Get(':id/public')
  @ApiOperation({ 
    summary: 'Get any quiz by ID (public access for leads)',
    description: `Retrieves any quiz by its ID, regardless of status (draft, published, archived). 
    
    This endpoint is specifically designed for leads to access any quiz they want to take without authentication. 
    
    **Use Cases:**
    - Direct links shared via email/SMS
    - Embedding in external websites
    - Mobile app access
    - Marketing campaigns
    - Demo purposes
    
    **Key Features:**
    - No authentication required
    - Works with any quiz status
    - Returns only public data
    - CORS enabled for frontend access`,
    operationId: 'getAnyQuizPublic',
    tags: ['Quizzes']
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier of the quiz',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid'
  })
  @ApiOkResponse({ 
    description: 'Quiz retrieved successfully',
    type: PublicQuizDto,
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Quiz de Matemática Básica',
        status: 'published',
        quiz_json: {
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'Qual é o resultado de 2 + 2?',
              options: ['3', '4', '5', '6'],
              correct_answer: 1
            }
          ],
          settings: {
            time_limit: 30,
            shuffle_questions: true
          }
        },
        settings: {
          theme: 'default',
          show_results: true,
          allow_retry: false
        },
        published_at: '2024-01-15T10:30:00.000Z',
        created_at: '2024-01-10T14:20:00.000Z',
        project: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Escola Online',
          domain: 'escolaonline.com',
          logo: 'https://example.com/logo.png'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Quiz not found or not published',
    schema: {
      example: {
        statusCode: 404,
        message: 'Quiz not found or not published',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid quiz ID format',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid quiz ID format',
        error: 'Bad Request'
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error'
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<PublicQuizDto> {
    const quiz = await this.quizzesService.findOnePublic(id);
    
    if (!quiz) {
      throw new NotFoundException('Quiz not found or not published');
    }
    
    // Retornar apenas dados públicos
    return {
      id: quiz.id,
      name: quiz.name,
      status: quiz.status,
      quiz_json: quiz.quiz_json,
      settings: quiz.settings,
      published_at: quiz.published_at || undefined,
      created_at: quiz.created_at,
      project: {
        id: quiz.project.id,
        name: quiz.project.name,
        domain: quiz.project.domain,
        logo: quiz.project.logo,
      },
    };
  }

  @Get(':id/public')
  @ApiOperation({ 
    summary: 'Get any quiz by ID (public access for leads)',
    description: `Retrieves any quiz by its ID, regardless of status (draft, published, archived). 
    
    This endpoint is specifically designed for leads to access any quiz they want to take without authentication. 
    
    **Use Cases:**
    - Direct links shared via email/SMS
    - Embedding in external websites
    - Mobile app access
    - Marketing campaigns
    - Demo purposes
    
    **Key Features:**
    - No authentication required
    - Works with any quiz status
    - Returns only public data
    - CORS enabled for frontend access`,
    operationId: 'getAnyQuizPublic',
    tags: ['Quizzes']
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Unique identifier (UUID) of the quiz to retrieve. This can be any quiz regardless of its status.',
    example: '5f3e5a33-f22a-4a25-a9ec-2da98355d87f',
    type: 'string',
    format: 'uuid',
    required: true
  })
  @ApiOkResponse({ 
    description: 'Quiz retrieved successfully. Returns quiz data regardless of status (draft, published, archived).',
    type: PublicQuizDto,
    schema: {
      example: {
        id: '5f3e5a33-f22a-4a25-a9ec-2da98355d87f',
        name: 'Quiz de Conhecimentos Gerais',
        status: 'draft',
        quiz_json: {
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'Qual é a capital do Brasil?',
              options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
              correct_answer: 2,
              points: 10
            },
            {
              id: 2,
              type: 'true_false',
              question: 'O Brasil é o maior país da América do Sul?',
              correct_answer: true,
              points: 5
            },
            {
              id: 3,
              type: 'multiple_choice',
              question: 'Qual é o maior planeta do sistema solar?',
              options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
              correct_answer: 2,
              points: 15
            }
          ],
          settings: {
            time_limit: 45,
            shuffle_questions: true,
            show_progress: true,
            passing_score: 70
          }
        },
        settings: {
          theme: 'modern',
          show_results: true,
          allow_retry: true,
          background_color: '#f8f9fa',
          text_color: '#212529',
          font_family: 'Arial, sans-serif'
        },
        published_at: null,
        created_at: '2024-01-10T14:20:00.000Z',
        project: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Empresa XYZ',
          domain: 'empresaxyz.com',
          logo: 'https://empresaxyz.com/logo.png'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Quiz not found. The specified quiz ID does not exist in the database.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Quiz not found',
        error: 'Not Found',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid quiz ID format. The provided ID is not a valid UUID format.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid quiz ID format',
        error: 'Bad Request',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/quizzes/invalid-id/public',
        details: 'Quiz ID must be a valid UUID format'
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Internal server error. Database connection issues or unexpected errors.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public'
      }
    }
  })
  async findOnePublic(@Param('id') id: string): Promise<PublicQuizDto> {
    const quiz = await this.quizzesService.findOneAny(id);
    
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    
    // Retornar apenas dados públicos
    return {
      id: quiz.id,
      name: quiz.name,
      status: quiz.status,
      quiz_json: quiz.quiz_json,
      settings: quiz.settings,
      published_at: quiz.published_at || undefined,
      created_at: quiz.created_at,
      project: {
        id: quiz.project.id,
        name: quiz.project.name,
        domain: quiz.project.domain,
        logo: quiz.project.logo,
      },
    };
  }


} 