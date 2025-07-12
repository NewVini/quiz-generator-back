import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Project } from './src/projects/entities/project.entity';
import { Quiz } from './src/quizzes/entities/quiz.entity';
import { Lead } from './src/leads/entities/lead.entity';
import { ProjectSetting } from './src/project-settings/entities/project-setting.entity/project-setting.entity';


export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project, Quiz, Lead, ProjectSetting],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false, // Desabilitar todos os logs SQL
  charset: 'utf8mb4',
  timezone: 'Z',
});
