import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingDto } from './create-billing.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  @ApiPropertyOptional({ description: 'ID do billing para atualização', example: 'uuid-billing-789' })
  id?: string;
} 