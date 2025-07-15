const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function completeSetup() {
  let connection;
  
  try {
    console.log('🚀 Iniciando setup completo do banco de dados...');
    
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

    // Fechar conexão
    await connection.end();

    // Executar migrations
    console.log('📋 Executando migrations...');
    await execAsync('npm run migration:run');
    console.log('✅ Migrations executadas');

    // Executar seed
    console.log('🌱 Executando seed...');
    await execAsync('npm run seed:run');
    console.log('✅ Seed executado');

    console.log('🎉 Setup completo concluído!');
    console.log('\n📊 Dados disponíveis:');
    console.log('- 2 usuários de teste');
    console.log('- 2 projetos');
    console.log('- 2 quizzes');
    console.log('- 3 leads de exemplo');
    console.log('\n🔑 Credenciais:');
    console.log('- joao@exemplo.com / senha123');
    console.log('- maria@exemplo.com / senha123');

  } catch (error) {
    console.error('❌ Erro durante setup:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

completeSetup(); 