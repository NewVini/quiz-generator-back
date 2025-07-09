import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nome do projeto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Domínio do projeto (opcional)' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ description: 'URL do logo do projeto (opcional)' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'Configurações do projeto (opcional)' })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
} 