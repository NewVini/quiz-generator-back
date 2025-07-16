import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ 
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'E-mail do usuário',
    example: 'joao@exemplo.com',
    required: false
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ 
    description: 'Papel do usuário',
    enum: UserRole,
    required: false
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 