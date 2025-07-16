import { IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectPermission } from '../../users/entities/user.entity';

export class UpdateUserPermissionsDto {
  @ApiProperty({ 
    description: 'Novas permissões do usuário no projeto',
    example: ['create_projects', 'view_analytics', 'export_data'],
    enum: ProjectPermission,
    isArray: true
  })
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions: ProjectPermission[];
} 