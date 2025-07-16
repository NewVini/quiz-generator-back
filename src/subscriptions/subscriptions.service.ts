import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { BillingsService } from '../billings/billings.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly usersService: UsersService,
    private readonly billingsService: BillingsService,
  ) {}

  // Configurações dos planos
  private readonly PLAN_CONFIGS = {
    free: {
      quizzes_limit: 50,
      leads_limit: 10000,
      price: 0,
    },
    monthly: {
      quizzes_limit: 1000,
      leads_limit: 100000,
      price: 29.90,
    },
    yearly: {
      quizzes_limit: 1000,
      leads_limit: 100000,
      price: 299.90, // 10 meses pagos, 2 grátis
    },
  };

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const { plan_type, user_id } = createSubscriptionDto;
    console.log('USER_ID:', user_id);
    
    // Verificar se o usuário pode criar uma subscription (tem billing pago ou está em teste)
    const canCreate = await this.billingsService.canCreateSubscription(user_id);
    if (!canCreate) {
      throw new BadRequestException('Usuário precisa ter um billing pago ou estar em período de teste para criar uma subscription');
    }

    // Verificar se o usuário já tem uma subscription ativa
    const existingSubscription = await this.findActiveByUserId(user_id);
    if (existingSubscription) {
      throw new BadRequestException('Usuário já possui uma subscription ativa');
    }

    // Aplicar configurações do plano
    const planConfig = this.PLAN_CONFIGS[plan_type];
    if (!planConfig) {
      throw new BadRequestException('Tipo de plano inválido');
    }

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      quizzes_limit: createSubscriptionDto.quizzes_limit || planConfig.quizzes_limit,
      leads_limit: createSubscriptionDto.leads_limit || planConfig.leads_limit,
      price: createSubscriptionDto.price || planConfig.price,
      quizzes_used: 0,
      leads_used: 0,
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Criar billing de teste gratuito se o usuário não tem billing pago
    const hasPaidBilling = await this.billingsService.hasPaidBilling(user_id);
    if (!hasPaidBilling) {
      await this.billingsService.createTrialBilling(user_id, savedSubscription.id);
    }

    return savedSubscription;
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } });
    return subscription || null;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string, userRole?: string): Promise<Subscription | null> {
    if (userRole === 'admin') {
    console.log('ADMIN ENCONTRADO');    
      return null; // Admin não precisa de subscription
    }
    return this.subscriptionRepository.findOne({
      where: { 
        user_id: userId,
        status: 'active',
      },
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);
    if (!subscription) {
      throw new NotFoundException('Subscription não encontrada');
    }
    
    // Se estiver mudando o plano, aplicar as configurações do novo plano
    if (updateSubscriptionDto.plan_type && updateSubscriptionDto.plan_type !== subscription.plan_type) {
      const planConfig = this.PLAN_CONFIGS[updateSubscriptionDto.plan_type];
      if (planConfig) {
        updateSubscriptionDto.quizzes_limit = planConfig.quizzes_limit;
        updateSubscriptionDto.leads_limit = planConfig.leads_limit;
        updateSubscriptionDto.price = planConfig.price;
      }
    }

    await this.subscriptionRepository.update(id, updateSubscriptionDto);
    // Buscar novamente e garantir que não é null
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException('Subscription não encontrada após update');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    if (!subscription) {
      throw new NotFoundException('Subscription não encontrada');
    }
    await this.subscriptionRepository.delete(id);
  }

  // Métodos para verificação de limites
  async checkQuizLimit(userId: string): Promise<{ canCreate: boolean; current: number; limit: number }> {
    const subscription = await this.findActiveByUserId(userId);
    
    if (!subscription) {
      // Usuário sem subscription ativa - usar limites do plano free
      const freeConfig = this.PLAN_CONFIGS.free;
      return {
        canCreate: false,
        current: 0,
        limit: freeConfig.quizzes_limit,
      };
    }

    return {
      canCreate: subscription.quizzes_used < subscription.quizzes_limit,
      current: subscription.quizzes_used,
      limit: subscription.quizzes_limit,
    };
  }

  async checkLeadLimit(userId: string): Promise<{ canCreate: boolean; current: number; limit: number }> {
    const subscription = await this.findActiveByUserId(userId);
    
    if (!subscription) {
      // Usuário sem subscription ativa - usar limites do plano free
      const freeConfig = this.PLAN_CONFIGS.free;
      return {
        canCreate: false,
        current: 0,
        limit: freeConfig.leads_limit,
      };
    }

    return {
      canCreate: subscription.leads_used < subscription.leads_limit,
      current: subscription.leads_used,
      limit: subscription.leads_limit,
    };
  }

  // Métodos para incrementar uso
  async incrementQuizUsage(userId: string): Promise<void> {
    const subscription = await this.findActiveByUserId(userId);
    if (subscription) {
      await this.subscriptionRepository.update(
        { id: subscription.id },
        { quizzes_used: subscription.quizzes_used + 1 }
      );
    }
  }

  async incrementLeadUsage(userId: string): Promise<void> {
    const subscription = await this.findActiveByUserId(userId);
    if (subscription) {
      await this.subscriptionRepository.update(
        { id: subscription.id },
        { leads_used: subscription.leads_used + 1 }
      );
    }
  }

  // Método para obter informações dos planos disponíveis
  getAvailablePlans() {
    return this.PLAN_CONFIGS;
  }

  // Método para renovar subscription
  async renewSubscription(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    if (!subscription) {
      throw new NotFoundException('Subscription não encontrada');
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    const nextBilling = new Date(endDate);
    
    await this.subscriptionRepository.update(id, {
      status: 'active',
      start_date: startDate,
      end_date: endDate,
      next_billing: nextBilling,
      quizzes_used: 0,
      leads_used: 0,
    });

    // Buscar novamente e garantir que não é null
    const renewed = await this.findOne(id);
    if (!renewed) {
      throw new NotFoundException('Subscription não encontrada após renovação');
    }
    return renewed;
  }

//   async listUsersWithPlanStatus(): Promise<any[]> {
//     // Busca todos os usuários
//     const users = await this.usersService.findAll();
//     console.log('USERS ENCONTRADOS:', users);
//     // Busca todas as subscriptions ativas
//     const subscriptions = await this.subscriptionRepository.find({ where: { status: 'active' } });
//     console.log('SUBSCRIPTIONS ATIVAS:', subscriptions);
//     const activeMap = new Map(subscriptions.map(s => [s.user_id, s]));
//     const result = users.map(user => {
//       const activeSub = activeMap.get(user.id);
//       return {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         planStatus: user.role === UserRole.SYSTEM_ADMIN ? 'admin' : (activeSub ? 'active' : 'inactive'),
//         subscriptionId: activeSub ? activeSub.id : null,
//       };
//     });
//     console.log('RESULTADO FINAL:', result);
//     return result;
//   }
} 