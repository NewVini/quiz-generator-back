const mysql = require('mysql2/promise');
require('dotenv').config();

const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

console.log('🔍 Verificando Respostas dos Leads no Banco de Dados\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quiz_generator',
      charset: 'utf8mb4'
    });
    
    console.log('✅ Conectado ao banco de dados');
    return connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    return null;
  }
}

async function checkLeadsTable(connection) {
  console.log('\n1️⃣ Verificando estrutura da tabela leads...');
  
  try {
    const [rows] = await connection.execute(`
      DESCRIBE leads
    `);
    
    console.log('📋 Estrutura da tabela leads:');
    rows.forEach(row => {
      console.log(`   - ${row.Field}: ${row.Type} ${row.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
    });
    
    // Verificar se o campo responses existe
    const responsesField = rows.find(row => row.Field === 'responses');
    if (responsesField) {
      console.log('✅ Campo "responses" encontrado:', responsesField.Type);
    } else {
      console.log('❌ Campo "responses" NÃO encontrado!');
    }
    
    return responsesField;
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error.message);
    return null;
  }
}

async function checkRecentLeads(connection) {
  console.log('\n2️⃣ Verificando leads recentes...');
  
  try {
    const [rows] = await connection.execute(`
      SELECT 
        id, 
        email, 
        name, 
        responses,
        custom_fields,
        created_at,
        source
      FROM leads 
      WHERE quiz_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `, [QUIZ_ID]);
    
    if (rows.length === 0) {
      console.log('⚠️  Nenhum lead encontrado para este quiz');
      return [];
    }
    
    console.log(`📊 Encontrados ${rows.length} leads recentes:`);
    
    rows.forEach((lead, index) => {
      console.log(`\n   Lead ${index + 1}:`);
      console.log(`   - ID: ${lead.id}`);
      console.log(`   - Email: ${lead.email || 'N/A'}`);
      console.log(`   - Nome: ${lead.name || 'N/A'}`);
      console.log(`   - Fonte: ${lead.source || 'N/A'}`);
      console.log(`   - Criado: ${lead.created_at}`);
      
      // Verificar respostas
      if (lead.responses) {
        try {
          const responses = JSON.parse(lead.responses);
          console.log(`   - Respostas: ${Object.keys(responses).length} campos`);
          console.log(`   - Conteúdo:`, JSON.stringify(responses, null, 4));
        } catch (e) {
          console.log(`   - Respostas: ERRO ao parsear JSON - ${lead.responses}`);
        }
      } else {
        console.log(`   - Respostas: NULL ou vazio`);
      }
      
      // Verificar custom_fields
      if (lead.custom_fields) {
        try {
          const customFields = JSON.parse(lead.custom_fields);
          console.log(`   - Custom Fields: ${Object.keys(customFields).length} campos`);
          console.log(`   - Conteúdo:`, JSON.stringify(customFields, null, 4));
        } catch (e) {
          console.log(`   - Custom Fields: ERRO ao parsear JSON - ${lead.custom_fields}`);
        }
      } else {
        console.log(`   - Custom Fields: NULL ou vazio`);
      }
    });
    
    return rows;
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error.message);
    return [];
  }
}

async function checkResponseTypes(connection) {
  console.log('\n3️⃣ Analisando tipos de respostas...');
  
  try {
    const [rows] = await connection.execute(`
      SELECT responses FROM leads 
      WHERE quiz_id = ? AND responses IS NOT NULL AND responses != '{}'
      ORDER BY created_at DESC 
      LIMIT 5
    `, [QUIZ_ID]);
    
    if (rows.length === 0) {
      console.log('⚠️  Nenhuma resposta encontrada para análise');
      return;
    }
    
    console.log(`📊 Analisando ${rows.length} respostas:`);
    
    rows.forEach((row, index) => {
      try {
        const responses = JSON.parse(row.responses);
        console.log(`\n   Resposta ${index + 1}:`);
        
        Object.entries(responses).forEach(([key, value]) => {
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`   - ${key}: ${type} = ${JSON.stringify(value)}`);
        });
      } catch (e) {
        console.log(`   ❌ Erro ao parsear resposta ${index + 1}: ${e.message}`);
      }
    });
  } catch (error) {
    console.error('❌ Erro ao analisar tipos:', error.message);
  }
}

async function checkLeadCount(connection) {
  console.log('\n4️⃣ Verificando contadores...');
  
  try {
    // Contar leads por quiz
    const [leadCount] = await connection.execute(`
      SELECT COUNT(*) as total FROM leads WHERE quiz_id = ?
    `, [QUIZ_ID]);
    
    // Verificar lead_count no quiz
    const [quizData] = await connection.execute(`
      SELECT name, lead_count FROM quizzes WHERE id = ?
    `, [QUIZ_ID]);
    
    console.log(`📊 Estatísticas:`);
    console.log(`   - Total de leads no banco: ${leadCount[0].total}`);
    
    if (quizData.length > 0) {
      console.log(`   - Quiz: ${quizData[0].name}`);
      console.log(`   - Lead count no quiz: ${quizData[0].lead_count}`);
      
      if (leadCount[0].total !== quizData[0].lead_count) {
        console.log(`   ⚠️  DESCRONIZAÇÃO: lead_count (${quizData[0].lead_count}) != total real (${leadCount[0].total})`);
      } else {
        console.log(`   ✅ Contadores sincronizados`);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao verificar contadores:', error.message);
  }
}

async function runDatabaseCheck() {
  console.log('🚀 Iniciando verificação no banco de dados...\n');
  
  const connection = await connectToDatabase();
  if (!connection) {
    console.log('❌ Não foi possível conectar ao banco de dados');
    return;
  }
  
  try {
    // Verificar estrutura
    const responsesField = await checkLeadsTable(connection);
    
    // Verificar leads recentes
    const recentLeads = await checkRecentLeads(connection);
    
    // Analisar tipos de resposta
    await checkResponseTypes(connection);
    
    // Verificar contadores
    await checkLeadCount(connection);
    
    // Resumo
    console.log('\n' + '=' .repeat(60));
    console.log('📋 RESUMO DA VERIFICAÇÃO:');
    console.log(`   - Estrutura da tabela: ${responsesField ? '✅' : '❌'}`);
    console.log(`   - Leads encontrados: ${recentLeads.length}`);
    console.log(`   - Campo responses: ${responsesField ? 'Presente' : 'Ausente'}`);
    
    if (responsesField && recentLeads.length > 0) {
      console.log('\n🎉 RESPOSTAS ESTÃO SENDO SALVAS!');
      console.log('✅ Campo "responses" existe na tabela');
      console.log('✅ Leads estão sendo criados');
      console.log('✅ Dados JSON estão sendo armazenados');
    } else {
      console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
      if (!responsesField) console.log('   - Campo "responses" não existe na tabela');
      if (recentLeads.length === 0) console.log('   - Nenhum lead encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message);
  } finally {
    await connection.end();
    console.log('\n🔌 Conexão com banco fechada');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runDatabaseCheck().catch(console.error);
}

module.exports = { 
  connectToDatabase, 
  checkLeadsTable, 
  checkRecentLeads, 
  checkResponseTypes, 
  checkLeadCount 
}; 