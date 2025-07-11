const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRoutes() {
  console.log('🧪 Testando rotas de quiz público...\n');

  try {
    // Testar a rota principal de quizzes
    console.log('1️⃣ Testando GET /quizzes (listar por projeto)...');
    try {
      const response1 = await axios.get(`${BASE_URL}/quizzes?projectId=123e4567-e89b-12d3-a456-426614174000`);
      console.log('✅ Rota /quizzes funcionando:', response1.status);
    } catch (error) {
      console.log('❌ Rota /quizzes não funcionando:', error.response?.status || error.message);
    }

    // Testar a rota específica de quiz
    console.log('\n2️⃣ Testando GET /quizzes/{id} (quiz publicado)...');
    try {
      const response2 = await axios.get(`${BASE_URL}/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f`);
      console.log('✅ Rota /quizzes/{id} funcionando:', response2.status);
    } catch (error) {
      console.log('❌ Rota /quizzes/{id} não funcionando:', error.response?.status || error.message);
    }

    // Testar a nova rota /public
    console.log('\n3️⃣ Testando GET /quizzes/{id}/public (nova rota)...');
    try {
      const response3 = await axios.get(`${BASE_URL}/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public`);
      console.log('✅ Rota /quizzes/{id}/public funcionando:', response3.status);
      console.log('📄 Dados retornados:', JSON.stringify(response3.data, null, 2));
    } catch (error) {
      console.log('❌ Rota /quizzes/{id}/public não funcionando:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📄 Erro detalhado:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // Testar se o Swagger está acessível
    console.log('\n4️⃣ Testando acesso ao Swagger...');
    try {
      const response4 = await axios.get(`${BASE_URL}/api`);
      console.log('✅ Swagger acessível:', response4.status);
    } catch (error) {
      console.log('❌ Swagger não acessível:', error.response?.status || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar testes
testRoutes().catch(console.error); 