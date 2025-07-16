import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/entities/user.entity';

@ApiTags('Subscriptions - Sistema de Planos e Limites')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    console.log('SubscriptionsController carregado!');
  }

  @Post()
  @ApiOperation({
    summary: 'Criar nova subscription',
    description: 'Cria uma nova subscription para um usuário. Apenas uma subscription ativa por usuário é permitida.'
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription criada com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        user_id: '123e4567-e89b-12d3-a456-426614174001',
        plan_type: 'monthly',
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-02-01',
        next_billing: '2024-02-01',
        quizzes_limit: 1000,
        leads_limit: 100000,
        quizzes_used: 0,
        leads_used: 0,
        price: 29.90,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Usuário já possui subscription ativa ou tipo de plano inválido'
  })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as subscriptions',
    description: 'Retorna todas as subscriptions do sistema (apenas para administradores)'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de subscriptions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          plan_type: { type: 'string' },
          status: { type: 'string' },
          start_date: { type: 'string' },
          end_date: { type: 'string' },
          next_billing: { type: 'string' },
          quizzes_limit: { type: 'number' },
          leads_limit: { type: 'number' },
          quizzes_used: { type: 'number' },
          leads_used: { type: 'number' },
          price: { type: 'number' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('plans')
  @ApiOperation({
    summary: 'Obter planos disponíveis',
    description: 'Retorna as configurações de todos os planos disponíveis (free, monthly, yearly)'
  })
  @ApiResponse({
    status: 200,
    description: 'Configurações dos planos',
    schema: {
      example: {
        free: {
          quizzes_limit: 50,
          leads_limit: 10000,
          price: 0
        },
        monthly: {
          quizzes_limit: 1000,
          leads_limit: 100000,
          price: 29.90
        },
        yearly: {
          quizzes_limit: 1000,
          leads_limit: 100000,
          price: 299.90
        }
      }
    }
  })
  getAvailablePlans() {
    return this.subscriptionsService.getAvailablePlans();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Obter subscriptions de um usuário',
    description: 'Retorna todas as subscriptions de um usuário específico'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de subscriptions do usuário'
  })
  findByUserId(@Param('userId') userId: string) {
    return this.subscriptionsService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/active')
  @ApiOperation({
    summary: 'Obter subscription ativa de um usuário',
    description: 'Retorna a subscription ativa de um usuário específico'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription ativa do usuário ou null se não houver'
  })
  async findActiveByUserId(@Param('userId') userId: string, @Request() req) {
    // Se o usuário autenticado for admin, passa o role para o service
    const userRole = req.user?.role;
    return this.subscriptionsService.findActiveByUserId(userId, userRole);
  }

  @Get('limits/quiz/:userId')
  @ApiOperation({
    summary: 'Verificar limite de quizzes',
    description: 'Verifica se o usuário pode criar mais quizzes baseado em sua subscription'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Informações sobre o limite de quizzes',
    schema: {
      example: {
        canCreate: true,
        current: 5,
        limit: 1000
      }
    }
  })
  checkQuizLimit(@Param('userId') userId: string) {
    return this.subscriptionsService.checkQuizLimit(userId);
  }

  @Get('limits/lead/:userId')
  @ApiOperation({
    summary: 'Verificar limite de leads',
    description: 'Verifica se o usuário pode receber mais leads baseado em sua subscription'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Informações sobre o limite de leads',
    schema: {
      example: {
        canCreate: true,
        current: 150,
        limit: 100000
      }
    }
  })
  checkLeadLimit(@Param('userId') userId: string) {
    return this.subscriptionsService.checkLeadLimit(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter subscription por ID',
    description: 'Retorna uma subscription específica pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da subscription',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription encontrada'
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription não encontrada'
  })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar subscription',
    description: 'Atualiza uma subscription existente. Se o plano for alterado, os limites serão automaticamente ajustados.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da subscription',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription atualizada com sucesso'
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription não encontrada'
  })
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Post(':id/renew')
  @ApiOperation({
    summary: 'Renovar subscription',
    description: 'Renova uma subscription, resetando os contadores de uso e estendendo o período por mais um mês'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da subscription',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription renovada com sucesso'
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription não encontrada'
  })
  renewSubscription(@Param('id') id: string) {
    return this.subscriptionsService.renewSubscription(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover subscription',
    description: 'Remove uma subscription do sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da subscription',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription removida com sucesso'
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription não encontrada'
  })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  @ApiOperation({
    summary: 'Obter minha subscription',
    description: 'Retorna a subscription ativa do usuário autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription do usuário autenticado'
  })
  getMySubscription(@Request() req) {
    return this.subscriptionsService.findActiveByUserId(req.user.sub);
  }

  // Endpoint de teste público para debug
  @Get('admin/test')
  getTest() {
    console.log('Chamou o endpoint de teste!');
    return { ok: true };
  }

  // Endpoint para admin listar todos os usuários e status de assinatura
  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários e status de assinatura', description: 'Apenas admin pode acessar. Retorna todos os usuários do sistema e se possuem assinatura ativa.' })
  @ApiResponse({ status: 200, description: 'Lista de usuários com status de assinatura', schema: { example: [
    { id: '...', name: 'Maria Santos', email: 'maria@exemplo.com', role: 'admin', hasActiveSubscription: false, activeSubscriptionId: null },
    { id: '...', name: 'João Silva', email: 'joao@exemplo.com', role: 'owner', hasActiveSubscription: false, activeSubscriptionId: null },
    { id: '...', name: 'Ana Souza', email: 'ana@exemplo.com', role: 'owner', hasActiveSubscription: true, activeSubscriptionId: '...' }
  ] } })
  @ApiResponse({ status: 403, description: 'Apenas administradores podem acessar este recurso.' })
  async listAllUsersWithSubscriptionStatus(@Request() req) {
    if (req.user?.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Apenas administradores podem acessar este recurso.');
    }
    // Busca todos os usuários reais
    const users = await this.subscriptionsService['usersService'].findAll(req.user.sub);
    console.log('USERS ENCONTRADOS:', users);
    // Busca todas as subscriptions ativas
    const subscriptions = await this.subscriptionsService['subscriptionRepository'].find({ where: { status: 'active' } });
    console.log('SUBSCRIPTIONS ATIVAS:', subscriptions);
    const activeMap = new Map(subscriptions.map(s => [s.user_id, s]));
    const result = users.map(user => {
      const activeSub = activeMap.get(user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasActiveSubscription: !!activeSub,
        activeSubscriptionId: activeSub ? activeSub.id : null,
      };
    });
    console.log('RESULTADO FINAL:', result);
    return result;
  }
} 