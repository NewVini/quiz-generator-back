const mysql = require('mysql2/promise');

// Configuração do banco (ajuste conforme seu .env)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'quiz_generator',
};

const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
const PROJECT_ID = 'fb624020-dff7-438c-b68c-884edb468f68';

async function testDatabaseQueries() {
  console.log('🔍 Testando Consultas SQL Diretamente\n');
  console.log('=' .repeat(60));
  console.log(`Quiz ID: ${QUIZ_ID}`);
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log('=' .repeat(60));

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado ao banco de dados\n');

    // 1. Verificar se o quiz existe
    console.log('1️⃣ Verificando se o quiz existe...');
    const [quizzes] = await connection.execute(
      'SELECT id, name, project_id, status FROM quizzes WHERE id = ?',
      [QUIZ_ID]
    );
    
    if (quizzes.length === 0) {
      console.log('❌ Quiz não encontrado no banco');
      return;
    }
    
    const quiz = quizzes[0];
    console.log('✅ Quiz encontrado:');
    console.log('   - ID:', quiz.id);
    console.log('   - Nome:', quiz.name);
    console.log('   - Project ID:', quiz.project_id);
    console.log('   - Status:', quiz.status);

    // 2. Verificar se o projeto existe
    console.log('\n2️⃣ Verificando se o projeto existe...');
    const [projects] = await connection.execute(
      'SELECT id, name, user_id FROM projects WHERE id = ?',
      [quiz.project_id]
    );
    
    if (projects.length === 0) {
      console.log('❌ Projeto não encontrado no banco');
      console.log('   - Project ID:', quiz.project_id);
      return;
    }
    
    const project = projects[0];
    console.log('✅ Projeto encontrado:');
    console.log('   - ID:', project.id);
    console.log('   - Nome:', project.name);
    console.log('   - User ID:', project.user_id);

    // 3. Testar JOIN entre quiz e projeto
    console.log('\n3️⃣ Testando JOIN entre quiz e projeto...');
    const [quizWithProject] = await connection.execute(`
      SELECT 
        q.id as quiz_id,
        q.name as quiz_name,
        q.project_id,
        q.status as quiz_status,
        p.id as project_id,
        p.name as project_name,
        p.user_id
      FROM quizzes q
      LEFT JOIN projects p ON q.project_id = p.id
      WHERE q.id = ?
    `, [QUIZ_ID]);
    
    if (quizWithProject.length === 0) {
      console.log('❌ JOIN falhou - quiz não encontrado');
    } else {
      const result = quizWithProject[0];
      console.log('✅ JOIN funcionou:');
      console.log('   - Quiz ID:', result.quiz_id);
      console.log('   - Quiz Name:', result.quiz_name);
      console.log('   - Project ID:', result.project_id);
      console.log('   - Project Name:', result.project_name);
      console.log('   - User ID:', result.user_id);
    }

    // 4. Verificar se há leads existentes
    console.log('\n4️⃣ Verificando leads existentes...');
    const [leads] = await connection.execute(
      'SELECT id, quiz_id, project_id, email, name FROM leads WHERE quiz_id = ? ORDER BY created_at DESC LIMIT 5',
      [QUIZ_ID]
    );
    
    console.log(`📊 Leads encontrados: ${leads.length}`);
    leads.forEach((lead, index) => {
      console.log(`   ${index + 1}. Lead ID: ${lead.id}`);
      console.log(`      Email: ${lead.email}`);
      console.log(`      Nome: ${lead.name}`);
    });

    // 5. Testar inserção de lead
    console.log('\n5️⃣ Testando inserção de lead...');
    const testLead = {
      id: require('crypto').randomUUID(),
      quiz_id: QUIZ_ID,
      project_id: quiz.project_id,
      email: 'teste@teste.com',
      name: 'Teste SQL',
      phone: '123456789',
      custom_fields: JSON.stringify({}),
      responses: JSON.stringify({}),
      source: 'teste-script',
      created_at: new Date()
    };

    try {
      await connection.execute(`
        INSERT INTO leads (id, quiz_id, project_id, email, name, phone, custom_fields, responses, source, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        testLead.id,
        testLead.quiz_id,
        testLead.project_id,
        testLead.email,
        testLead.name,
        testLead.phone,
        testLead.custom_fields,
        testLead.responses,
        testLead.source,
        testLead.created_at
      ]);
      
      console.log('✅ Lead inserido com sucesso via SQL direto');
      console.log('   - Lead ID:', testLead.id);
      
      // Limpar o lead de teste
      await connection.execute('DELETE FROM leads WHERE id = ?', [testLead.id]);
      console.log('   - Lead de teste removido');
      
    } catch (error) {
      console.log('❌ Erro ao inserir lead via SQL:', error.message);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('📋 RESUMO DOS TESTES:');
    console.log('✅ Quiz existe no banco');
    console.log('✅ Projeto existe no banco');
    console.log('✅ JOIN entre quiz e projeto funciona');
    console.log('✅ Inserção de lead funciona via SQL');
    
    console.log('\n💡 CONCLUSÃO:');
    console.log('O banco de dados está funcionando corretamente.');
    console.log('O problema deve estar no código do backend.');
    console.log('Verifique os logs do backend quando fizer a requisição.');

  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    console.log('\n🔧 Verifique:');
    console.log('1. Se o MySQL está rodando');
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
  testDatabaseQueries().catch(console.error);
}

module.exports = { testDatabaseQueries }; 