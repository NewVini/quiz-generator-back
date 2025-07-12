import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Tipo do plano (free, monthly, yearly)',
    example: 'monthly',
    enum: ['free', 'monthly', 'yearly']
  })
  @IsString()
  @IsIn(['free', 'monthly', 'yearly'])
  plan_type: string;

  @ApiProperty({
    description: 'Status da subscription',
    example: 'active',
    enum: ['active', 'pending', 'expired', 'canceled']
  })
  @IsString()
  @IsIn(['active', 'pending', 'expired', 'canceled'])
  status: string;

  @ApiProperty({
    description: 'Data de início da subscription',
    example: '2024-01-01'
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'Data de fim da subscription',
    example: '2024-02-01'
  })
  @IsDateString()
  end_date: string;

  @ApiProperty({
    description: 'Próxima data de cobrança',
    example: '2024-02-01'
  })
  @IsDateString()
  next_billing: string;

  @ApiProperty({
    description: 'Limite de quizzes (padrão: 50 para free, 1000 para monthly)',
    example: 1000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  quizzes_limit?: number;

  @ApiProperty({
    description: 'Limite de leads (padrão: 10000 para free, 100000 para monthly)',
    example: 100000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  leads_limit?: number;

  @ApiProperty({
    description: 'Preço do plano em reais',
    example: 29.90,
    required: false
  })
  @IsOptional()
  @IsNumber()
  price?: number;
} 