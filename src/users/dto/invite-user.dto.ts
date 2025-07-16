import { IsEmail, IsArray, IsEnum, IsOptional } from 'class-validator';
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
    description: 'Permissões padrão que o usuário terá nos projetos',
    example: ['create_projects', 'view_analytics'],
    enum: ProjectPermission,
    isArray: true,
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ProjectPermission, { each: true })
  default_permissions?: ProjectPermission[];
} 