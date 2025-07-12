import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '../../../projects/entities/project.entity';

@Entity('project_settings')
export class ProjectSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  project_id: string;

  @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'varchar', length: 20, nullable: true })
  primary_color: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  secondary_color: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  background_color: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  font_family: string;

  @Column({ type: 'longtext', nullable: true })
  logo_base64: string;

  @Column({ type: 'longtext', nullable: true })
  icon_base64: string;

  @Column({ type: 'json', nullable: true })
  extra: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
