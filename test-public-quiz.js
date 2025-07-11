// Script de teste para a nova rota de quiz público
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testPublicQuizEndpoint() {
  console.log('🧪 Testando endpoint de quiz público...\n');

  // ID de exemplo (substitua por um ID real do seu banco)
  const quizId = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

  try {
    console.log(`📡 Fazendo requisição para: ${BASE_URL}/quizzes/${quizId}/public`);
    
    const response = await axios.get(`${BASE_URL}/quizzes/${quizId}/public`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Sucesso! Resposta recebida:');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('\n📄 Dados do Quiz:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Erro na requisição:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Erro de rede:', error.message);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

async function testPublishedQuizEndpoint() {
  console.log('\n🧪 Testando endpoint de quiz publicado...\n');

  // ID de exemplo (substitua por um ID real do seu banco)
  const quizId = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

  try {
    console.log(`📡 Fazendo requisição para: ${BASE_URL}/quizzes/${quizId}`);
    
    const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Sucesso! Resposta recebida:');
    console.log('Status:', response.status);
    console.log('\n📄 Dados do Quiz:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Erro na requisição:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Erro de rede:', error.message);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes dos endpoints de quiz público...\n');
  
  await testPublicQuizEndpoint();
  await testPublishedQuizEndpoint();
  
  console.log('\n✨ Testes concluídos!');
}

// Executar se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testPublicQuizEndpoint, testPublishedQuizEndpoint }; 