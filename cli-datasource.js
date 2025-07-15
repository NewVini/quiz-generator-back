const { DataSource } = require('typeorm');
require('ts-node/register');
require('tsconfig-paths/register');

const { User } = require('./src/users/entities/user.entity');
const { Project } = require('./src/projects/entities/project.entity');
const { Quiz } = require('./src/quizzes/entities/quiz.entity');
const { Lead } = require('./src/leads/entities/lead.entity');
const { ProjectSetting } = require('./src/project-settings/entities/project-setting.entity/project-setting.entity');
const { Subscription } = require('./src/subscriptions/entities/subscription.entity');

module.exports = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'u228402541_opsevor',
  entities: [User, Project, Quiz, Lead, ProjectSetting, Subscription],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4',
  timezone: 'Z',
}); 