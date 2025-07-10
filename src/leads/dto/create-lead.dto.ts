import { IsString, IsObject, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ description: 'Email do lead (opcional)', example: 'lead@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Nome do lead (opcional)', example: 'Carlos Oliveira', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Telefone do lead (opcional)', example: '+5511999999999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Campos customizados (opcional)', example: { idade: '28', cidade: 'São Paulo' }, required: false })
  @IsOptional()
  @IsObject()
  custom_fields?: Record<string, any>;

  @ApiProperty({ description: 'Respostas do quiz', example: { q1: 0, q2: 'Tenho experiência com JS' } })
  @IsObject()
  responses: Record<string, any>;

  @ApiProperty({ description: 'Fonte do lead (opcional)', example: 'website', required: false })
  @IsOptional()
  @IsString()
  source?: string;
} 