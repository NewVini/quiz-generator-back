import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefone do usuário (opcional)', example: '+5511999999999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;
} 