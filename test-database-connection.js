const mysql = require('mysql2/promise');

async function testConnection() {
  const configs = [
    {
      name: 'Configuração Atual (Remota)',
      host: '193.203.175.69',
      port: 3306,
      username: 'u228402541_opsevor',
      password: 'ywcY4Vg5h|G',
      database: 'u228402541_opsevor'
    },
    {
      name: 'Teste sem database',
      host: '193.203.175.69',
      port: 3306,
      username: 'u228402541_opsevor',
      password: 'ywcY4Vg5h|G'
    }
  ];

  for (const config of configs) {
    console.log(`\n=== Testando: ${config.name} ===`);
    try {
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database
      });

      console.log('✅ Conexão bem-sucedida!');
      
      // Testar se conseguimos listar as tabelas
      if (config.database) {
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('📋 Tabelas encontradas:', rows.length);
        rows.forEach(row => {
          console.log(`  - ${Object.values(row)[0]}`);
        });
      }

      await connection.end();
    } catch (error) {
      console.log('❌ Erro na conexão:', error.message);
      if (error.code) {
        console.log(`   Código: ${error.code}`);
      }
    }
  }
}

testConnection().catch(console.error); 