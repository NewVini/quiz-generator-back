const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

console.log('🧪 Testando Quiz Específico\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testQuizExists() {
  console.log('\n1️⃣ Verificando se o quiz existe...');
  
  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/public`);
    console.log('✅ Quiz encontrado via endpoint público:');
    console.log('   - ID:', response.data.id);
    console.log('   - Nome:', response.data.name);
    console.log('   - Status:', response.data.status);
    console.log('   - Project ID:', response.data.project?.id);
    return true;
  } catch (error) {
    console.log('❌ Erro ao buscar quiz:', error.response?.status, error.response?.statusText);
    console.log('   - Mensagem:', error.response?.data?.message);
    return false;
  }
}

async function testLeadSubmission() {
  console.log('\n2️⃣ Testando submissão de lead...');
  
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

  console.log('📝 Payload a ser enviado:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Origin': 'http://localhost:5173'
        }
      }
    );

    console.log('✅ Lead criado com sucesso!');
    console.log('   - Lead ID:', response.data.id);
    console.log('   - Quiz ID:', response.data.quiz_id);
    console.log('   - Project ID:', response.data.project_id);
    console.log('   - Email:', response.data.email);
    console.log('   - Nome:', response.data.name);
    
    return true;
  } catch (error) {
    console.log('❌ Erro ao criar lead:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Status Text:', error.response?.statusText);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    if (error.response?.status === 404) {
      console.log('\n🔍 Possíveis causas do 404:');
      console.log('1. Quiz não existe no banco de dados');
      console.log('2. Problema na consulta do banco');
      console.log('3. Quiz ID está incorreto');
      console.log('4. Banco de dados não está conectado');
    }
    
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n3️⃣ Verificando conexão com banco...');
  
  try {
    // Tentar buscar qualquer quiz para testar conexão
    const response = await axios.get(`${API_BASE}/quizzes`);
    console.log('✅ Conexão com banco OK');
    console.log('   - Quizzes encontrados:', response.data?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Problema de conexão com banco:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes...\n');
  
  const quizExists = await testQuizExists();
  const dbConnection = await testDatabaseConnection();
  
  if (quizExists && dbConnection) {
    await testLeadSubmission();
  } else {
    console.log('\n⚠️  Pulando teste de lead - pré-requisitos não atendidos');
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS TESTES:');
  console.log(`   - Quiz existe: ${quizExists ? '✅' : '❌'}`);
  console.log(`   - Conexão DB: ${dbConnection ? '✅' : '❌'}`);
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Verifique os logs do backend para mais detalhes');
  console.log('2. Confirme se o banco está rodando e conectado');
  console.log('3. Verifique se o quiz ID está correto no banco');
  console.log('4. Execute: npm run start:dev para ver logs detalhados');
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testQuizExists, testLeadSubmission, testDatabaseConnection }; 