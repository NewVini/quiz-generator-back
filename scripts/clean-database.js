const mysql = require('mysql2/promise');

async function cleanDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
   database: 'u228402541_opsevor',,
  });

  try {
    console.log('🧹 Limpando banco de dados...');
    
    // Desabilitar verificação de foreign keys
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Limpar todas as tabelas
    await connection.execute('TRUNCATE TABLE leads');
    await connection.execute('TRUNCATE TABLE quizzes');
    await connection.execute('TRUNCATE TABLE projects');
    await connection.execute('TRUNCATE TABLE users');
    
    // Reabilitar verificação de foreign keys
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
  } finally {
    await connection.end();
  }
}

cleanDatabase(); 