import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 20 })
  plan_type: string; // ex: 'pro', 'free', 'custom'

  @Column({ type: 'varchar', length: 20 })
  status: string; // 'active', 'pending', 'expired', 'canceled'

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'date' })
  next_billing: Date;

  @Column({ type: 'int', default: 50 })
  quizzes_limit: number;

  @Column({ type: 'int', default: 10000 })
  leads_limit: number;

  @Column({ type: 'int', default: 0 })
  quizzes_used: number;

  @Column({ type: 'int', default: 0 })
  leads_used: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


} 