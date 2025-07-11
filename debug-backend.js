const axios = require('axios');

const API_BASE = 'http://localhost:3000';

console.log('🔍 DEBUG: Backend e Banco de Dados\n');
console.log('=' .repeat(60));

async function checkBackendStatus() {
  console.log('1️⃣ Verificando se o backend está rodando...');
  
  try {
    const response = await axios.get(`${API_BASE}/`);
    console.log('✅ Backend está rodando');
    console.log('   - Status:', response.status);
    console.log('   - Resposta:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend não está rodando');
    console.log('   - Erro:', error.message);
    console.log('   - Verifique se executou: npm run start:dev');
    return false;
  }
}

async function checkDatabaseConnection() {
  console.log('\n2️⃣ Verificando conexão com banco de dados...');
  
  try {
    // Tentar buscar projetos (endpoint que requer banco)
    const response = await axios.get(`${API_BASE}/projects`);
    console.log('✅ Conexão com banco OK');
    console.log('   - Status:', response.status);
    console.log('   - Projetos encontrados:', response.data?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Problema de conexão com banco');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    
    if (error.response?.status === 401) {
      console.log('   - Erro 401: Endpoint requer autenticação (normal)');
      return true; // Banco está funcionando, só precisa de auth
    }
    
    return false;
  }
}

async function checkQuizDirectly() {
  console.log('\n3️⃣ Verificando quiz diretamente no banco...');
  
  const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
  
  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/public`);
    console.log('✅ Quiz encontrado no banco');
    console.log('   - ID:', response.data.id);
    console.log('   - Nome:', response.data.name);
    console.log('   - Status:', response.data.status);
    console.log('   - Project ID:', response.data.project?.id);
    return true;
  } catch (error) {
    console.log('❌ Quiz não encontrado no banco');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    
    if (error.response?.status === 404) {
      console.log('   - Quiz com ID não existe no banco');
      console.log('   - Verifique se o ID está correto');
    }
    
    return false;
  }
}

async function testLeadEndpoint() {
  console.log('\n4️⃣ Testando endpoint de leads...');
  
  const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
  
  const payload = {
    email: "teste@teste.com",
    name: "Viniçando Machado",
    phone: "799887987",
    custom_fields: {},
    responses: {
      "wppki6rvn": "option_1",
      "duj60yz52": "option_1",
      "d3x4bmdty": "1198873783",
      "of8x2vfrd": "teste@teste.com",
      "oi4kwk3fe": "119889484",
      "9y1k8a6ik": "option_2",
      "slalrym7t": {}
    },
    source: "website"
  };

  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Lead criado com sucesso!');
    console.log('   - Lead ID:', response.data.id);
    console.log('   - Quiz ID:', response.data.quiz_id);
    console.log('   - Project ID:', response.data.project_id);
    return true;
  } catch (error) {
    console.log('❌ Erro ao criar lead');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    if (error.response?.status === 404) {
      console.log('\n🔍 Análise do erro 404:');
      console.log('   - O quiz pode não existir no banco');
      console.log('   - Pode haver problema na consulta SQL');
      console.log('   - Verifique os logs do backend');
    }
    
    return false;
  }
}

async function runDebug() {
  console.log('🚀 Iniciando debug completo...\n');
  
  const backendOk = await checkBackendStatus();
  const dbOk = await checkDatabaseConnection();
  const quizExists = await checkQuizDirectly();
  
  if (backendOk && dbOk && quizExists) {
    await testLeadEndpoint();
  } else {
    console.log('\n⚠️  Pulando teste de lead - pré-requisitos não atendidos');
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DO DEBUG:');
  console.log(`   - Backend rodando: ${backendOk ? '✅' : '❌'}`);
  console.log(`   - Banco conectado: ${dbOk ? '✅' : '❌'}`);
  console.log(`   - Quiz existe: ${quizExists ? '✅' : '❌'}`);
  
  console.log('\n💡 PRÓXIMOS PASSOS:');
  if (!backendOk) {
    console.log('1. Execute: npm run start:dev');
  }
  if (!dbOk) {
    console.log('2. Verifique se o MySQL está rodando');
    console.log('3. Confirme as credenciais no arquivo .env');
  }
  if (!quizExists) {
    console.log('4. Verifique se o quiz existe no banco');
    console.log('5. Execute: node check-database-ids.js');
  }
  
  console.log('\n🔍 Para mais detalhes, verifique os logs do backend');
}

// Executar se chamado diretamente
if (require.main === module) {
  runDebug().catch(console.error);
}

module.exports = { 
  checkBackendStatus, 
  checkDatabaseConnection, 
  checkQuizDirectly, 
  testLeadEndpoint 
}; 