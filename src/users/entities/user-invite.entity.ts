import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ProjectPermission } from './user.entity';
import { randomBytes } from 'crypto';

@Entity('user_invites')
@Index(['invited_by_user_id', 'email'], { unique: true })
export class UserInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invited_by_user_id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'json',
    default: [],
  })
  default_permissions: ProjectPermission[];

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.sentInvites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invited_by_user_id' })
  invitedByUser: User;
} 