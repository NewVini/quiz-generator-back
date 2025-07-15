const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...');
  
  let connection;
  
  try {
    // Conectar ao MySQL sem especificar banco
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ Conectado ao MySQL');

    // Criar banco de dados se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS `quizzes` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Banco de dados "quizzes" criado/verificado');

    // Fechar conexão inicial
    await connection.end();

    // Conectar ao banco específico
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
     database: 'u228402541_opsevor',
    });

    // Ler e executar script de criação de tabelas
    console.log('📋 Criando tabelas...');
    const createTablesSQL = await fs.readFile(path.join(__dirname, 'create-tables.sql'), 'utf8');
    const statements = createTablesSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✅ Tabelas criadas');

    await connection.end();

    // Executar seed
    console.log('🌱 Executando seed...');
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync('npm run seed:run');
    console.log('✅ Seed executado');

    console.log('🎉 Configuração do banco de dados concluída!');
    console.log('\n📊 Dados disponíveis:');
    console.log('- 2 usuários de teste');
    console.log('- 2 projetos');
    console.log('- 2 quizzes');
    console.log('- 3 leads de exemplo');
    console.log('\n🔑 Credenciais:');
    console.log('- joao@exemplo.com / senha123');
    console.log('- maria@exemplo.com / senha123');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 