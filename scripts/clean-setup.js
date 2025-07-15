const mysql = require('mysql2/promise');

async function cleanSetup() {
  let connection;
  
  try {
    // Conectar ao MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'u228402541_opsevor'
    });

    console.log('✅ Conectado ao banco de dados');

    // Desabilitar verificação de foreign keys temporariamente
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Obter todas as tabelas
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'u228402541_opsevor'
    `);

    // Remover todas as tabelas
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`🗑️  Removendo tabela: ${tableName}`);
      await connection.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    // Reabilitar verificação de foreign keys
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Banco de dados limpo com sucesso');
    console.log('🔄 Execute agora: npm run migration:run');
    console.log('🌱 Depois execute: npm run seed:run');

  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

cleanSetup(); 