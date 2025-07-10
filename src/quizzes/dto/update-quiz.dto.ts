import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @ApiProperty({ description: 'Número de leads (opcional)', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  lead_count?: number;
} 