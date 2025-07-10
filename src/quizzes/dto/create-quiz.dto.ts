import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuizStatus } from '../entities/quiz.entity';

export class CreateQuizDto {
  @ApiProperty({ description: 'Nome do quiz', example: 'Quiz JavaScript' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Status do quiz', example: 'published', required: false })
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;

  @ApiProperty({ description: 'Estrutura JSON do quiz', example: { questions: [{ id: 'q1', type: 'multiple_choice', question: 'Qual é a linguagem de programação mais popular?', options: ['JavaScript', 'Python', 'Java', 'C++'], correct_answer: 0, required: true }] } })
  @IsObject()
  quiz_json: Record<string, any>;

  @ApiProperty({ description: 'Configurações do quiz (opcional)', example: { theme: 'default', allow_anonymous: true }, required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
} 