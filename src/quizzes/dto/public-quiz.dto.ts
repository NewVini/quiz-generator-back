import { ApiProperty } from '@nestjs/swagger';

export class ProjectInfoDto {
  @ApiProperty({ 
    description: 'ID único do projeto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({ 
    description: 'Nome do projeto',
    example: 'Escola Online',
    maxLength: 255
  })
  name: string;

  @ApiProperty({ 
    description: 'Domínio do projeto (opcional)',
    example: 'escolaonline.com',
    required: false,
    maxLength: 255
  })
  domain?: string;

  @ApiProperty({ 
    description: 'URL do logo do projeto (opcional)',
    example: 'https://example.com/logo.png',
    required: false,
    maxLength: 500
  })
  logo?: string;
}

export class PublicQuizDto {
  @ApiProperty({ 
    description: 'ID único do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({ 
    description: 'Nome do quiz',
    example: 'Quiz de Matemática Básica',
    maxLength: 255
  })
  name: string;

  @ApiProperty({ 
    description: 'Status do quiz (draft, published, archived)',
    example: 'published',
    enum: ['draft', 'published', 'archived']
  })
  status: string;

  @ApiProperty({ 
    description: 'Dados do quiz em formato JSON contendo perguntas e configurações',
    example: {
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          question: 'Qual é o resultado de 2 + 2?',
          options: ['3', '4', '5', '6'],
          correct_answer: 1,
          points: 10
        },
        {
          id: 2,
          type: 'true_false',
          question: 'A Terra é plana?',
          correct_answer: false,
          points: 5
        }
      ],
      settings: {
        time_limit: 30,
        shuffle_questions: true,
        show_progress: true
      }
    }
  })
  quiz_json: Record<string, any>;

  @ApiProperty({ 
    description: 'Configurações visuais e comportamentais do quiz (opcional)',
    example: {
      theme: 'default',
      show_results: true,
      allow_retry: false,
      background_color: '#ffffff',
      text_color: '#000000'
    },
    required: false
  })
  settings?: Record<string, any>;

  @ApiProperty({ 
    description: 'Data e hora em que o quiz foi publicado (opcional)',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
    type: 'string',
    format: 'date-time'
  })
  published_at?: Date;

  @ApiProperty({ 
    description: 'Data e hora em que o quiz foi criado',
    example: '2024-01-10T14:20:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  created_at: Date;

  @ApiProperty({ 
    description: 'Informações do projeto associado ao quiz',
    type: ProjectInfoDto
  })
  project: ProjectInfoDto;
} 