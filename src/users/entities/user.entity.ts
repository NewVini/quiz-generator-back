import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { ProjectUser } from '../../projects/entities/project-user.entity';
import { UserInvite } from './user-invite.entity';
import { UserPermission } from './user-permission.entity';
import { Billing } from '../../billings/entities/billing.entity';

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  CREATOR = 'creator',
  ASSISTANT = 'assistant',
}

export enum ProjectPermission {
  CREATE_PROJECTS = 'create_projects',
  MANAGE_USERS = 'manage_users',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  auth_provider: AuthProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  provider_id: string; // ID do usuário no provedor (Google/Facebook)

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ASSISTANT,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 36, nullable: true })
  created_by_user_id: string; // ID do usuário que criou este assistant

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.user)
  projectUsers: ProjectUser[];

  @OneToMany(() => UserInvite, (invite) => invite.invitedByUser)
  sentInvites: UserInvite[];

  // Relação com o usuário que criou este assistant
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  // Relação com assistants criados por este usuário
  @OneToMany(() => User, (user) => user.createdByUser)
  createdAssistants: User[];

  // Relação com as permissões do usuário
  @OneToOne(() => UserPermission, (userPermission) => userPermission.user, { cascade: true })
  permissions: UserPermission;

  @OneToMany(() => Billing, (billing) => billing.user)
  billings: Billing[];
} 