const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...');
  
  try {
    // Conectar ao MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ Conectado ao MySQL');

    // Criar banco de dados se não existir
    await connection.execute('CREATE DATABASE IF NOT EXISTS `quizzes` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Banco de dados "quizzes" criado/verificado');

    await connection.end();

    // Executar script SQL para criar banco de dados
    console.log('📋 Criando banco de dados...');
    await execAsync('mysql -u root < scripts/create-database.sql');
    console.log('✅ Banco de dados criado');

    // Executar script SQL para criar tabelas
    console.log('📋 Criando tabelas...');
    await execAsync('mysql -u root quizzes < scripts/create-tables.sql');
    console.log('✅ Tabelas criadas');

    // Executar seed
    console.log('🌱 Executando seed...');
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
  }
}

setupDatabase(); 