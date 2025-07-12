import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Billing, BillingStatus, BillingType } from './entities/billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Subscription } from '../subscriptions/entities/subscription.entity';

@Injectable()
export class BillingsService {
  constructor(
    @InjectRepository(Billing)
    private billingRepository: Repository<Billing>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createBillingDto: CreateBillingDto): Promise<Billing> {
    const billing = this.billingRepository.create(createBillingDto);
    return await this.billingRepository.save(billing);
  }

  async findAll(): Promise<Billing[]> {
    return await this.billingRepository.find({
      relations: ['user', 'subscription'],
    });
  }

  async findOne(id: string): Promise<Billing> {
    const billing = await this.billingRepository.findOne({
      where: { id },
      relations: ['user', 'subscription'],
    });

    if (!billing) {
      throw new NotFoundException(`Billing with ID ${id} not found`);
    }

    return billing;
  }

  async findByUserId(userId: string): Promise<Billing[]> {
    return await this.billingRepository.find({
      where: { user_id: userId },
      relations: ['subscription'],
      order: { created_at: 'DESC' },
    });
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Billing[]> {
    return await this.billingRepository.find({
      where: { subscription_id: subscriptionId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateBillingDto: UpdateBillingDto): Promise<Billing> {
    const billing = await this.findOne(id);
    
    // Se o status está sendo alterado para PAID, atualizar paid_date
    if (updateBillingDto.status === BillingStatus.PAID && billing.status !== BillingStatus.PAID) {
      updateBillingDto.paid_date = new Date().toISOString().split('T')[0];
    }

    Object.assign(billing, updateBillingDto);
    return await this.billingRepository.save(billing);
  }

  async remove(id: string): Promise<void> {
    const billing = await this.findOne(id);
    await this.billingRepository.remove(billing);
  }

  // Métodos específicos do sistema de billing

  /**
   * Cria um billing de teste gratuito para um usuário
   */
  async createTrialBilling(userId: string, subscriptionId?: string): Promise<Billing> {
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 dias de teste

    const billing = this.billingRepository.create({
      user_id: userId,
      subscription_id: subscriptionId,
      billing_type: BillingType.TRIAL,
      status: BillingStatus.PAID, // Teste é considerado "pago" automaticamente
      amount: 0,
      currency: 'BRL',
      due_date: trialEndDate,
      paid_date: trialStartDate,
      trial_start_date: trialStartDate,
      trial_end_date: trialEndDate,
      is_trial: true,
      description: 'Período de teste gratuito de 7 dias',
    });

    return await this.billingRepository.save(billing);
  }

  /**
   * Cria um billing para uma subscription (após o período de teste)
   */
  async createSubscriptionBilling(
    userId: string,
    subscriptionId: string,
    amount: number,
    planType: string,
  ): Promise<Billing> {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Cobrança no 7º dia

    const billing = this.billingRepository.create({
      user_id: userId,
      subscription_id: subscriptionId,
      billing_type: BillingType.SUBSCRIPTION,
      status: BillingStatus.PENDING,
      amount,
      currency: 'BRL',
      due_date: dueDate,
      description: `Cobrança da subscription ${planType}`,
    });

    return await this.billingRepository.save(billing);
  }

  /**
   * Verifica se um usuário tem um billing pago
   */
  async hasPaidBilling(userId: string): Promise<boolean> {
    const paidBilling = await this.billingRepository.findOne({
      where: {
        user_id: userId,
        status: BillingStatus.PAID,
      },
    });

    return !!paidBilling;
  }

  /**
   * Verifica se um usuário está em período de teste
   */
  async isInTrialPeriod(userId: string): Promise<boolean> {
    const today = new Date();
    const trialBilling = await this.billingRepository.findOne({
      where: {
        user_id: userId,
        is_trial: true,
        trial_start_date: LessThan(today),
        trial_end_date: MoreThan(today),
      },
    });

    return !!trialBilling;
  }

  /**
   * Verifica se um usuário pode criar uma subscription
   */
  async canCreateSubscription(userId: string): Promise<boolean> {
    // Verifica se tem billing pago OU está em período de teste
    const hasPaid = await this.hasPaidBilling(userId);
    const isInTrial = await this.isInTrialPeriod(userId);

    return hasPaid || isInTrial;
  }

  /**
   * Marca um billing como pago
   */
  async markAsPaid(id: string, paymentGatewayId?: string): Promise<Billing> {
    const billing = await this.findOne(id);
    
    if (billing.status === BillingStatus.PAID) {
      throw new BadRequestException('Billing is already paid');
    }

    billing.status = BillingStatus.PAID;
    billing.paid_date = new Date();
    if (paymentGatewayId) {
      billing.payment_gateway_id = paymentGatewayId;
    }

    return await this.billingRepository.save(billing);
  }

  /**
   * Marca um billing como falhado
   */
  async markAsFailed(id: string, failureReason: string): Promise<Billing> {
    const billing = await this.findOne(id);
    
    billing.status = BillingStatus.FAILED;
    billing.failure_reason = failureReason;

    return await this.billingRepository.save(billing);
  }

  /**
   * Busca billings pendentes que vencem hoje
   */
  async findPendingBillingsDueToday(): Promise<Billing[]> {
    const today = new Date();
    
    return await this.billingRepository.find({
      where: {
        status: BillingStatus.PENDING,
        due_date: today,
      },
      relations: ['user', 'subscription'],
    });
  }

  /**
   * Busca billings de teste que expiram hoje
   */
  async findTrialBillingsExpiringToday(): Promise<Billing[]> {
    const today = new Date();
    
    return await this.billingRepository.find({
      where: {
        is_trial: true,
        trial_end_date: today,
      },
      relations: ['user', 'subscription'],
    });
  }

  /**
   * Verifica se uma subscription pode ser ativada (tem billing pago)
   */
  async canActivateSubscription(subscriptionId: string): Promise<boolean> {
    const paidBilling = await this.billingRepository.findOne({
      where: {
        subscription_id: subscriptionId,
        status: BillingStatus.PAID,
      },
    });

    return !!paidBilling;
  }
} 