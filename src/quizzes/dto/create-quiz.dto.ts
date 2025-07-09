import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuizStatus } from '../entities/quiz.entity';

export class CreateQuizDto {
  @ApiProperty({ description: 'Nome do quiz' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Status do quiz' })
  @IsOptional()
  @IsEnum(QuizStatus)
  status?: QuizStatus;

  @ApiProperty({ description: 'Estrutura JSON do quiz' })
  @IsObject()
  quiz_json: Record<string, any>;

  @ApiProperty({ description: 'Configurações do quiz (opcional)' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
} 