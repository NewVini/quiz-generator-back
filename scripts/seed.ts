import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../src/users/entities/user.entity';
import { UserPermission } from '../src/users/entities/user-permission.entity';
import { Project } from '../src/projects/entities/project.entity';
import { ProjectUser } from '../src/projects/entities/project-user.entity';
import { ProjectInvite } from '../src/projects/entities/project-invite.entity';
import { UserInvite } from '../src/users/entities/user-invite.entity';
import { Quiz, QuizStatus } from '../src/quizzes/entities/quiz.entity';
import { Lead } from '../src/leads/entities/lead.entity';
import { ProjectSetting } from '../src/project-settings/entities/project-setting.entity/project-setting.entity';
import { Subscription } from '../src/subscriptions/entities/subscription.entity';
import { Billing } from '../src/billings/entities/billing.entity';
import * as bcrypt from 'bcryptjs';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, UserPermission, Project, ProjectUser, ProjectInvite, UserInvite, Quiz, Lead, ProjectSetting, Subscription, Billing],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: 'Z',
});

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    // Limpar dados existentes (ordem correta: filhos -> pais)
    console.log('🧹 Limpando dados existentes...');
    await dataSource.createQueryBuilder().delete().from(Lead).execute();
    await dataSource.createQueryBuilder().delete().from(Quiz).execute();
    await dataSource.createQueryBuilder().delete().from(Project).execute();
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await dataSource.createQueryBuilder().delete().from(UserPermission).execute();
    await dataSource.createQueryBuilder().delete().from(UserInvite).execute();
    await dataSource.createQueryBuilder().delete().from(ProjectInvite).execute();
    await dataSource.createQueryBuilder().delete().from(ProjectUser).execute();

    // Criar usuários
    console.log('👥 Criando usuários...');
    const user1 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '+5511999999999',
      password_hash: await bcrypt.hash('senha123', 10),
      role: UserRole.CREATOR,
    });

    const user2 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '+5511888888888',
      password_hash: await bcrypt.hash('senha123', 10),
      role: UserRole.SYSTEM_ADMIN,
    });

    const user3 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Owner',
      email: 'a@a.com',
      phone: '+5511888888838',
      password_hash: await bcrypt.hash('123', 10),
      role: UserRole.CREATOR,
    });

    const user4 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Admin',
      email: 'b@b.com',
      phone: '+5511888888848',
      password_hash: await bcrypt.hash('123', 10),
      role: UserRole.SYSTEM_ADMIN,
    });

    await dataSource.getRepository(User).save([user1, user2, user3, user4]);
    console.log('✅ Usuários criados');

    // Criar projetos
    console.log('📁 Criando projetos...');
    const project1 = dataSource.getRepository(Project).create({
      id: '550e8400-e29b-41d4-a716-446655440002',
      user_id: user1.id,
      name: 'Projeto Tech',
      domain: 'tech.exemplo.com',
      logo: 'https://exemplo.com/logo.png',
      settings: { theme: 'dark', language: 'pt-BR' },
    });

    const project2 = dataSource.getRepository(Project).create({
      id: '550e8400-e29b-41d4-a716-446655440003',
      user_id: user2.id,
      name: 'Projeto Marketing',
      domain: 'marketing.exemplo.com',
      logo: 'https://exemplo.com/logo2.png',
      settings: { theme: 'light', language: 'en-US' },
    });

    await dataSource.getRepository(Project).save([project1, project2]);
    console.log('✅ Projetos criados');

    // Criar quizzes
    console.log('🎯 Criando quizzes...');
    const quiz1 = dataSource.getRepository(Quiz).create({
      id: '550e8400-e29b-41d4-a716-446655440004',
      project_id: project1.id,
      name: 'Quiz JavaScript',
      status: QuizStatus.PUBLISHED,
      quiz_json: {
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'Qual é a linguagem de programação mais popular?',
            options: ['JavaScript', 'Python', 'Java', 'C++'],
            correct_answer: 0,
            required: true,
          },
          {
            id: 'q2',
            type: 'text',
            question: 'Descreva sua experiência com JavaScript:',
            required: false,
          },
        ],
        settings: {
          time_limit: 300,
          show_results: true,
          allow_anonymous: true,
        },
      },
      settings: { theme: 'default', allow_anonymous: true },
      published_at: new Date(),
    });

    const quiz2 = dataSource.getRepository(Quiz).create({
      id: '550e8400-e29b-41d4-a716-446655440005',
      project_id: project2.id,
      name: 'Quiz Marketing Digital',
      status: QuizStatus.DRAFT,
      quiz_json: {
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'Qual é a melhor estratégia de marketing digital?',
            options: ['SEO', 'Redes Sociais', 'Email Marketing', 'Todas as anteriores'],
            correct_answer: 3,
            required: true,
          },
          {
            id: 'q2',
            type: 'text',
            question: 'Descreva sua estratégia de marketing:',
            required: true,
          },
        ],
        settings: {
          time_limit: 600,
          show_results: false,
          allow_anonymous: false,
        },
      },
      settings: { theme: 'modern', allow_anonymous: false },
    });

    await dataSource.getRepository(Quiz).save([quiz1, quiz2]);
    console.log('✅ Quizzes criados');

    // Criar leads (respostas)
    console.log('📝 Criando leads...');
    const leads = [
      dataSource.getRepository(Lead).create({
        quiz_id: quiz1.id,
        project_id: project1.id,
        email: 'respondente1@exemplo.com',
        name: 'Carlos Oliveira',
        phone: '+5511777777777',
        custom_fields: { idade: '28', cidade: 'São Paulo', empresa: 'Tech Corp' },
        responses: {
          q1: 0,
          q2: 'Tenho 3 anos de experiência com JavaScript, principalmente React e Node.js',
        },
        source: 'website',
      }),
      dataSource.getRepository(Lead).create({
        quiz_id: quiz1.id,
        project_id: project1.id,
        email: 'respondente2@exemplo.com',
        name: 'Ana Costa',
        phone: '+5511666666666',
        custom_fields: { idade: '32', cidade: 'Rio de Janeiro', empresa: 'Digital Solutions' },
        responses: {
          q1: 1,
          q2: 'Comecei com JavaScript há 1 ano, ainda estou aprendendo',
        },
        source: 'social_media',
      }),
      dataSource.getRepository(Lead).create({
        quiz_id: quiz1.id,
        project_id: project1.id,
        email: 'respondente3@exemplo.com',
        name: 'Pedro Santos',
        custom_fields: { idade: '25', cidade: 'Belo Horizonte' },
        responses: {
          q1: 0,
          q2: 'JavaScript é minha linguagem principal há 2 anos',
        },
        source: 'email',
      }),
    ];

    await dataSource.getRepository(Lead).save(leads);
    console.log('✅ Leads criados');

    // Atualizar contador de leads
    await dataSource.getRepository(Quiz).update(quiz1.id, { lead_count: 3 });

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Dados criados:');
    console.log('- 2 usuários');
    console.log('- 2 projetos');
    console.log('- 2 quizzes');
    console.log('- 3 leads');
    console.log('\n🔑 Credenciais de teste:');
    console.log('- Email: joao@exemplo.com | Senha: senha123');
    console.log('- Email: maria@exemplo.com | Senha: senha123');
    console.log('- Email: a@a.com | Senha: 123');
    console.log('- Email: b@b.com | Senha: 123');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seed();
} 