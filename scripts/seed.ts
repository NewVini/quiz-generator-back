import { DataSource } from 'typeorm';
import { User, UserRole } from '../src/users/entities/user.entity';
import { Project } from '../src/projects/entities/project.entity';
import { Quiz, QuizStatus } from '../src/quizzes/entities/quiz.entity';
import { Lead } from '../src/leads/entities/lead.entity';
import { Subscription } from '../src/subscriptions/entities/subscription.entity';
import { Billing } from '../src/billings/entities/billing.entity';
import * as bcrypt from 'bcryptjs';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'quizzes2',
  entities: [User, Project, Quiz, Lead, Subscription, Billing],
  synchronize: false,
  logging: false,
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

    // Criar usuários
    console.log('👥 Criando usuários...');
    const user1 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '+5511999999999',
      password_hash: await bcrypt.hash('senha123', 10),
      role: UserRole.OWNER,
    });

    const user2 = dataSource.getRepository(User).create({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '+5511888888888',
      password_hash: await bcrypt.hash('senha123', 10),
      role: UserRole.ADMIN,
    });

    await dataSource.getRepository(User).save([user1, user2]);
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