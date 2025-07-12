import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'Tipo do plano (free, monthly, yearly)',
    example: 'monthly',
    enum: ['free', 'monthly', 'yearly'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['free', 'monthly', 'yearly'])
  plan_type?: string;

  @ApiProperty({
    description: 'Status da subscription',
    example: 'active',
    enum: ['active', 'pending', 'expired', 'canceled'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'pending', 'expired', 'canceled'])
  status?: string;

  @ApiProperty({
    description: 'Data de início da subscription',
    example: '2024-01-01',
    required: false
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: 'Data de fim da subscription',
    example: '2024-02-01',
    required: false
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    description: 'Próxima data de cobrança',
    example: '2024-02-01',
    required: false
  })
  @IsOptional()
  @IsDateString()
  next_billing?: string;

  @ApiProperty({
    description: 'Limite de quizzes',
    example: 1000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  quizzes_limit?: number;

  @ApiProperty({
    description: 'Limite de leads',
    example: 100000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  leads_limit?: number;

  @ApiProperty({
    description: 'Quizzes utilizados',
    example: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  quizzes_used?: number;

  @ApiProperty({
    description: 'Leads utilizados',
    example: 150,
    required: false
  })
  @IsOptional()
  @IsNumber()
  leads_used?: number;

  @ApiProperty({
    description: 'Preço do plano em reais',
    example: 29.90,
    required: false
  })
  @IsOptional()
  @IsNumber()
  price?: number;
} 