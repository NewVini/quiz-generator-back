import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { ProjectUser } from './project-user.entity';
import { ProjectInvite } from './project-invite.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  domain: string;

  @Column({ type: 'longtext', nullable: true })
  logo: string;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Quiz, (quiz) => quiz.project)
  quizzes: Quiz[];

  @OneToMany(() => Lead, (lead) => lead.project)
  leads: Lead[];

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers: ProjectUser[];

  @OneToMany(() => ProjectInvite, (invite) => invite.project)
  invites: ProjectInvite[];
} 