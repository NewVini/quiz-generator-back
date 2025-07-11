const mysql = require('mysql2/promise');

// Configuração do banco (ajuste conforme seu .env)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'quiz_generator',
};

async function checkDatabaseIds() {
  console.log('🔍 Verificando IDs no Banco de Dados\n');
  console.log('=' .repeat(60));

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao banco de dados\n');

    // 1. Verificar projetos
    console.log('📋 PROJETOS:');
    const [projects] = await connection.execute('SELECT id, name, user_id FROM projects ORDER BY created_at DESC LIMIT 5');
    
    if (projects.length === 0) {
      console.log('❌ Nenhum projeto encontrado');
    } else {
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ID: ${project.id}`);
        console.log(`   Nome: ${project.name}`);
        console.log(`   User ID: ${project.user_id}\n`);
      });
    }

    // 2. Verificar quizzes
    console.log('📋 QUIZZES:');
    const [quizzes] = await connection.execute(`
      SELECT q.id, q.name, q.project_id, q.status, p.name as project_name 
      FROM quizzes q 
      LEFT JOIN projects p ON q.project_id = p.id 
      ORDER BY q.created_at DESC 
      LIMIT 10
    `);
    
    if (quizzes.length === 0) {
      console.log('❌ Nenhum quiz encontrado');
    } else {
      quizzes.forEach((quiz, index) => {
        console.log(`${index + 1}. Quiz ID: ${quiz.id}`);
        console.log(`   Nome: ${quiz.name}`);
        console.log(`   Status: ${quiz.status}`);
        console.log(`   Project ID: ${quiz.project_id}`);
        console.log(`   Project Name: ${quiz.project_name}\n`);
      });
    }

    // 3. Verificar leads
    console.log('📋 LEADS:');
    const [leads] = await connection.execute(`
      SELECT l.id, l.quiz_id, l.project_id, l.email, l.name, q.name as quiz_name
      FROM leads l
      LEFT JOIN quizzes q ON l.quiz_id = q.id
      ORDER BY l.created_at DESC
      LIMIT 5
    `);
    
    if (leads.length === 0) {
      console.log('❌ Nenhum lead encontrado');
    } else {
      leads.forEach((lead, index) => {
        console.log(`${index + 1}. Lead ID: ${lead.id}`);
        console.log(`   Email: ${lead.email}`);
        console.log(`   Nome: ${lead.name}`);
        console.log(`   Quiz ID: ${lead.quiz_id}`);
        console.log(`   Quiz Name: ${lead.quiz_name}`);
        console.log(`   Project ID: ${lead.project_id}\n`);
      });
    }

    // 4. Verificar usuários
    console.log('📋 USUÁRIOS:');
    const [users] = await connection.execute('SELECT id, name, email, role FROM users ORDER BY created_at DESC LIMIT 3');
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`);
        console.log(`   Nome: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}\n`);
      });
    }

    console.log('=' .repeat(60));
    console.log('💡 DICAS PARA TESTE:');
    console.log('1. Use um Quiz ID válido para testar POST /quizzes/{quizId}/leads');
    console.log('2. Use um Project ID válido para testar GET /quizzes/project/{projectId}/leads');
    console.log('3. Verifique se os IDs estão no formato UUID correto');
    console.log('4. Execute: node test-leads-correct.js para testar o endpoint');

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    console.log('\n🔧 Verifique:');
    console.log('1. Se o banco está rodando');
    console.log('2. Se as credenciais estão corretas');
    console.log('3. Se o arquivo .env está configurado');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkDatabaseIds().catch(console.error);
}

module.exports = { checkDatabaseIds }; 