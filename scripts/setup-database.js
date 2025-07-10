const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados...');
  
  try {
    // Conectar ao MySQL sem especificar banco
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

    // Usar o banco de dados
    await connection.execute('USE `quizzes`');
    console.log('✅ Usando banco de dados "quizzes"');

    // Verificar se as tabelas já existem
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('📋 Executando migração inicial...');
      
      // Executar a migração inicial
      const migration = require('../src/migrations/1703123456789-CreateInitialTables.ts');
      const migrationInstance = new migration.CreateInitialTables1703123456789();
      
      // Simular QueryRunner para executar a migração
      const queryRunner = {
        query: async (sql) => {
          console.log('Executando:', sql.substring(0, 100) + '...');
          return await connection.execute(sql);
        }
      };
      
      await migrationInstance.up(queryRunner);
      console.log('✅ Migração inicial executada com sucesso!');
    } else {
      console.log('ℹ️  Tabelas já existem no banco de dados');
    }

    await connection.end();
    console.log('🎉 Configuração do banco de dados concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 