import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quiz_id: string;

  @Column({ type: 'uuid' })
  project_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'json', nullable: true })
  custom_fields: Record<string, any>;

  @Column({ type: 'json' })
  responses: Record<string, any>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.leads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => Project, (project) => project.leads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;
} 