import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateProjectSettingDto {
  @ApiProperty({ example: 'uuid-do-projeto' })
  @IsString()
  project_id: string;

  @ApiProperty({ example: '#3b82f6', required: false })
  @IsOptional()
  @IsString()
  primary_color?: string;

  @ApiProperty({ example: '#ffffff', required: false })
  @IsOptional()
  @IsString()
  secondary_color?: string;

  @ApiProperty({ example: '#f9f9f9', required: false })
  @IsOptional()
  @IsString()
  background_color?: string;

  @ApiProperty({ example: 'Inter', required: false })
  @IsOptional()
  @IsString()
  font_family?: string;

  @ApiProperty({ description: 'Logo em base64', required: false })
  @IsOptional()
  @IsString()
  logo_base64?: string;

  @ApiProperty({ description: 'Ícone em base64', required: false })
  @IsOptional()
  @IsString()
  icon_base64?: string;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  extra?: any;
}
