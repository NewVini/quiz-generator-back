import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { UserInvite } from './src/users/entities/user-invite.entity';
import { UserPermission } from './src/users/entities/user-permission.entity';
import { Project } from './src/projects/entities/project.entity';
import { ProjectUser } from './src/projects/entities/project-user.entity';
import { ProjectInvite } from './src/projects/entities/project-invite.entity';
import { Quiz } from './src/quizzes/entities/quiz.entity';
import { Lead } from './src/leads/entities/lead.entity';
import { ProjectSetting } from './src/project-settings/entities/project-setting.entity/project-setting.entity';
import { Subscription } from './src/subscriptions/entities/subscription.entity';
import { Billing } from './src/billings/entities/billing.entity';

console.log(process.env.DB_HOST,"oiasdoijasd");

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, UserInvite, UserPermission, Project, ProjectUser, ProjectInvite, Quiz, Lead, ProjectSetting, Subscription, Billing],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: 'Z',
});
