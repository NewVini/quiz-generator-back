import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { ProjectPermission } from '../entities/user.entity';

@ApiExtraModels()
export class UpdateUserGlobalPermissionsDto {
  @ApiProperty({ 
    description: 'Lista de permissões globais do usuário',
    enum: ProjectPermission,
    isArray: true,
    example: ['create_projects', 'view_analytics'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions?: ProjectPermission[];
} 