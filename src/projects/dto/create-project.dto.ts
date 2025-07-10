import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nome do projeto', example: 'Projeto Marketing' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Domínio do projeto (opcional)', example: 'marketing.exemplo.com', required: false })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ description: 'URL do logo do projeto (opcional)', example: 'https://exemplo.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'Configurações do projeto (opcional)', example: { theme: 'dark', language: 'pt-BR' }, required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
} 