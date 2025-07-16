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
import { Project } from './project.entity';
import { ProjectPermission } from '../../users/entities/user.entity';

@Entity('project_invites')
@Index(['project_id', 'email'], { unique: true })
export class ProjectInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  project_id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'json',
    default: [],
  })
  permissions: ProjectPermission[];

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

  @ManyToOne(() => Project, (project) => project.invites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
} 