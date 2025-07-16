import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectPermission } from '../../users/entities/user.entity';

export class AddUserToProjectDto {
  @ApiProperty({ description: 'ID do usuário a ser adicionado', example: 'uuid-do-usuario' })
  @IsString()
  user_id: string;

  @ApiProperty({ 
    description: 'Permissões do usuário no projeto',
    example: ['create_projects', 'view_analytics'],
    enum: ProjectPermission,
    isArray: true
  })
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  permissions: ProjectPermission[];
} 