import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Project } from './src/projects/entities/project.entity';
import { Quiz } from './src/quizzes/entities/quiz.entity';
import { Lead } from './src/leads/entities/lead.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'quizzes',
  entities: [User, Project, Quiz, Lead],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4',
  timezone: 'Z',
}); 