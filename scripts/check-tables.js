const mysql = require('mysql2/promise');

async function checkTables() {
  let connection;
  
  try {
    // Conectar ao MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'quizzes2'
    });

    console.log('✅ Conectado ao banco de dados');

    // Verificar tabelas existentes
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'quizzes2'
      ORDER BY table_name
    `);

    console.log('\n📋 Tabelas existentes no banco:');
    if (tables.length === 0) {
      console.log('❌ Nenhuma tabela encontrada');
    } else {
      tables.forEach(table => {
        console.log(`✅ ${table.TABLE_NAME}`);
      });
    }

    // Verificar se a tabela subscriptions existe especificamente
    const [subscriptionTable] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'quizzes2' AND table_name = 'subscriptions'
    `);

    if (subscriptionTable.length > 0) {
      console.log('\n✅ Tabela subscriptions existe');
      
      // Verificar estrutura da tabela subscriptions
      const [columns] = await connection.execute(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'quizzes2' AND table_name = 'subscriptions'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📊 Estrutura da tabela subscriptions:');
      columns.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } else {
      console.log('\n❌ Tabela subscriptions NÃO existe');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTables(); 