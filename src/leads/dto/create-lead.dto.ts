import { IsString, IsObject, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ description: 'Email do lead (opcional)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Nome do lead (opcional)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Telefone do lead (opcional)' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Campos customizados (opcional)' })
  @IsOptional()
  @IsObject()
  custom_fields?: Record<string, any>;

  @ApiProperty({ description: 'Respostas do quiz' })
  @IsObject()
  responses: Record<string, any>;

  @ApiProperty({ description: 'Fonte do lead (opcional)' })
  @IsOptional()
  @IsString()
  source?: string;
} 