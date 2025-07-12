import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BillingsService } from './billings.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Billings')
@ApiBearerAuth()
@Controller('billings')
@UseGuards(JwtAuthGuard)
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo billing' })
  @ApiBody({ type: CreateBillingDto })
  @ApiResponse({ status: 201, description: 'Billing criado com sucesso.' })
  create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingsService.create(createBillingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os billings' })
  @ApiResponse({ status: 200, description: 'Lista de billings.' })
  findAll() {
    return this.billingsService.findAll();
  }

  @Get('my-billings')
  @ApiOperation({ summary: 'Listar billings do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de billings do usuário.' })
  findMyBillings(@Request() req) {
    return this.billingsService.findByUserId(req.user.id);
  }

  @Get('subscription/:subscriptionId')
  @ApiOperation({ summary: 'Listar billings de uma subscription' })
  @ApiParam({ name: 'subscriptionId', description: 'ID da subscription' })
  @ApiResponse({ status: 200, description: 'Lista de billings da subscription.' })
  findBySubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.billingsService.findBySubscriptionId(subscriptionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar billing por ID' })
  @ApiParam({ name: 'id', description: 'ID do billing' })
  @ApiResponse({ status: 200, description: 'Billing encontrado.' })
  findOne(@Param('id') id: string) {
    return this.billingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar billing por ID' })
  @ApiParam({ name: 'id', description: 'ID do billing' })
  @ApiBody({ type: UpdateBillingDto })
  @ApiResponse({ status: 200, description: 'Billing atualizado.' })
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingsService.update(id, updateBillingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover billing por ID' })
  @ApiParam({ name: 'id', description: 'ID do billing' })
  @ApiResponse({ status: 200, description: 'Billing removido.' })
  remove(@Param('id') id: string) {
    return this.billingsService.remove(id);
  }

  // Endpoints específicos do sistema de billing

  @Post('trial/:userId')
  @ApiOperation({ summary: 'Criar billing de teste gratuito para um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiBody({ schema: { properties: { subscriptionId: { type: 'string', example: 'uuid-sub-456' } }, required: [] } })
  @ApiResponse({ status: 201, description: 'Billing de teste criado.' })
  createTrialBilling(
    @Param('userId') userId: string,
    @Body() body: { subscriptionId?: string },
  ) {
    return this.billingsService.createTrialBilling(userId, body.subscriptionId);
  }

  @Post('subscription')
  @ApiOperation({ summary: 'Criar billing de subscription' })
  @ApiBody({ schema: { properties: {
    userId: { type: 'string', example: 'uuid-user-123' },
    subscriptionId: { type: 'string', example: 'uuid-sub-456' },
    amount: { type: 'number', example: 29.9 },
    planType: { type: 'string', example: 'monthly' },
  }}})
  @ApiResponse({ status: 201, description: 'Billing de subscription criado.' })
  createSubscriptionBilling(
    @Body() body: {
      userId: string;
      subscriptionId: string;
      amount: number;
      planType: string;
    },
  ) {
    return this.billingsService.createSubscriptionBilling(
      body.userId,
      body.subscriptionId,
      body.amount,
      body.planType,
    );
  }

  @Get('check/paid/:userId')
  @ApiOperation({ summary: 'Verificar se usuário tem billing pago' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'true se tiver billing pago.' })
  checkPaidBilling(@Param('userId') userId: string) {
    return this.billingsService.hasPaidBilling(userId);
  }

  @Get('check/trial/:userId')
  @ApiOperation({ summary: 'Verificar se usuário está em período de teste' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'true se estiver em período de teste.' })
  checkTrialPeriod(@Param('userId') userId: string) {
    return this.billingsService.isInTrialPeriod(userId);
  }

  @Get('check/can-subscribe/:userId')
  @ApiOperation({ summary: 'Verificar se usuário pode criar subscription' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'true se puder criar subscription.' })
  checkCanCreateSubscription(@Param('userId') userId: string) {
    return this.billingsService.canCreateSubscription(userId);
  }

  @Post(':id/mark-paid')
  @ApiOperation({ summary: 'Marcar billing como pago' })
  @ApiParam({ name: 'id', description: 'ID do billing' })
  @ApiBody({ schema: { properties: { paymentGatewayId: { type: 'string', example: 'pg_123456' } }, required: [] } })
  @ApiResponse({ status: 200, description: 'Billing marcado como pago.' })
  markAsPaid(
    @Param('id') id: string,
    @Body() body: { paymentGatewayId?: string },
  ) {
    return this.billingsService.markAsPaid(id, body.paymentGatewayId);
  }

  @Post(':id/mark-failed')
  @ApiOperation({ summary: 'Marcar billing como falhado' })
  @ApiParam({ name: 'id', description: 'ID do billing' })
  @ApiBody({ schema: { properties: { failureReason: { type: 'string', example: 'Pagamento recusado' } } } })
  @ApiResponse({ status: 200, description: 'Billing marcado como falhado.' })
  markAsFailed(
    @Param('id') id: string,
    @Body() body: { failureReason: string },
  ) {
    return this.billingsService.markAsFailed(id, body.failureReason);
  }

  @Get('pending/due-today')
  @ApiOperation({ summary: 'Listar billings pendentes que vencem hoje' })
  @ApiResponse({ status: 200, description: 'Lista de billings pendentes.' })
  findPendingDueToday() {
    return this.billingsService.findPendingBillingsDueToday();
  }

  @Get('trial/expiring-today')
  @ApiOperation({ summary: 'Listar billings de teste que expiram hoje' })
  @ApiResponse({ status: 200, description: 'Lista de billings de teste expiram hoje.' })
  findTrialExpiringToday() {
    return this.billingsService.findTrialBillingsExpiringToday();
  }

  @Get('check/activate-subscription/:subscriptionId')
  @ApiOperation({ summary: 'Verificar se pode ativar subscription (tem billing pago)' })
  @ApiParam({ name: 'subscriptionId', description: 'ID da subscription' })
  @ApiResponse({ status: 200, description: 'true se puder ativar.' })
  checkCanActivateSubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.billingsService.canActivateSubscription(subscriptionId);
  }
} 