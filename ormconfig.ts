import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Project } from './src/projects/entities/project.entity';
import { Quiz } from './src/quizzes/entities/quiz.entity';
import { Lead } from './src/leads/entities/lead.entity';
import { ProjectSetting } from './src/project-settings/entities/project-setting.entity/project-setting.entity';
import { Subscription } from './src/subscriptions/entities/subscription.entity';
import { Billing } from './src/billings/entities/billing.entity';


export default new DataSource({
  type: 'mysql',
  host: '193.203.175.69',
  port: 3306,
  username: 'u228402541_opsevor',
  password: 'ywcY4Vg5h|G',
  database: 'u228402541_opsevor',
  entities: [User, Project, Quiz, Lead, ProjectSetting, Subscription, Billing],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false, // Desabilitar todos os logs SQL
  charset: 'utf8mb4',
  timezone: 'Z',
});
