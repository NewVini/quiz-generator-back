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

@Entity('user_permissions')
@Index(['user_id'], { unique: true })
export class UserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({
    type: 'json',
    default: [],
  })
  permissions: ProjectPermission[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 