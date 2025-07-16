import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty({ 
    description: 'Nome do usuário', 
    example: 'João Silva' 
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ 
    description: 'Senha do usuário', 
    example: 'senha123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
} 