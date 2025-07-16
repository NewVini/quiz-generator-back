import { IsEmail, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectPermission } from '../../users/entities/user.entity';

export class InviteUserDto {
  @ApiProperty({ 
    description: 'Email do usuário a ser convidado', 
    example: 'usuario@exemplo.com' 
  })
  @IsEmail()
  email: string;

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