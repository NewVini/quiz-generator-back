import { ApiProperty } from '@nestjs/swagger';

export class LeadResponseDto {
  @ApiProperty({ description: 'ID único do lead' })
  id: string;

  @ApiProperty({ description: 'ID do quiz' })
  quiz_id: string;

  @ApiProperty({ description: 'ID do projeto' })
  project_id: string;

  @ApiProperty({ description: 'Email do lead', required: false })
  email?: string;

  @ApiProperty({ description: 'Nome do lead', required: false })
  name?: string;

  @ApiProperty({ description: 'Telefone do lead', required: false })
  phone?: string;

  @ApiProperty({ description: 'Campos customizados', required: false })
  custom_fields?: Record<string, any>;

  @ApiProperty({ description: 'Respostas do quiz' })
  responses: Record<string, any>;

  @ApiProperty({ description: 'Fonte do lead', required: false })
  source?: string;

  @ApiProperty({ description: 'Data de criação' })
  created_at: Date;

  @ApiProperty({ description: 'Informações detalhadas das respostas', required: false })
  detailed_responses?: QuestionResponseDto[];
}

export class QuestionResponseDto {
  @ApiProperty({ description: 'ID da pergunta' })
  question_id: string;

  @ApiProperty({ description: 'Texto da pergunta' })
  question_text: string;

  @ApiProperty({ description: 'Tipo da pergunta' })
  question_type: string;

  @ApiProperty({ description: 'Resposta fornecida' })
  answer: any;

  @ApiProperty({ description: 'Se a pergunta é obrigatória' })
  required: boolean;
} 