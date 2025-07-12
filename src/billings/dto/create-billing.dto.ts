import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { BillingStatus, BillingType } from '../entities/billing.entity';

export class CreateBillingDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid-user-123' })
  @IsUUID()
  user_id: string;

  @ApiPropertyOptional({ description: 'ID da subscription', example: 'uuid-sub-456' })
  @IsOptional()
  @IsUUID()
  subscription_id?: string;

  @ApiProperty({ enum: BillingType, description: 'Tipo de billing', example: BillingType.SUBSCRIPTION })
  @IsEnum(BillingType)
  billing_type: BillingType;

  @ApiProperty({ enum: BillingStatus, description: 'Status do billing', example: BillingStatus.PAID })
  @IsEnum(BillingStatus)
  status: BillingStatus;

  @ApiProperty({ description: 'Valor da cobrança', example: 29.9 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Moeda', example: 'BRL', default: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Método de pagamento', example: 'credit_card' })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiPropertyOptional({ description: 'ID do gateway de pagamento', example: 'pg_123456' })
  @IsOptional()
  @IsString()
  payment_gateway_id?: string;

  @ApiPropertyOptional({ description: 'Resposta do gateway de pagamento', example: '{ "status": "success" }' })
  @IsOptional()
  @IsString()
  payment_gateway_response?: string;

  @ApiProperty({ description: 'Data de vencimento', example: '2024-07-01' })
  @IsDateString()
  due_date: string;

  @ApiPropertyOptional({ description: 'Data de pagamento', example: '2024-07-01' })
  @IsOptional()
  @IsDateString()
  paid_date?: string;

  @ApiPropertyOptional({ description: 'Início do período de teste', example: '2024-06-24' })
  @IsOptional()
  @IsDateString()
  trial_start_date?: string;

  @ApiPropertyOptional({ description: 'Fim do período de teste', example: '2024-07-01' })
  @IsOptional()
  @IsDateString()
  trial_end_date?: string;

  @ApiPropertyOptional({ description: 'Se é período de teste', example: true })
  @IsOptional()
  @IsBoolean()
  is_trial?: boolean;

  @ApiPropertyOptional({ description: 'Descrição da cobrança', example: 'Cobrança do plano mensal' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Motivo da falha', example: 'Pagamento recusado' })
  @IsOptional()
  @IsString()
  failure_reason?: string;
} 