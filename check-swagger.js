const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function checkSwagger() {
  console.log('🔍 Verificando Swagger e rotas...\n');

  try {
    // 1. Verificar se o servidor está rodando
    console.log('1️⃣ Verificando se o servidor está rodando...');
    const healthCheck = await axios.get(`${BASE_URL}`);
    console.log('✅ Servidor rodando:', healthCheck.status);

    // 2. Verificar se o Swagger está acessível
    console.log('\n2️⃣ Verificando Swagger...');
    const swaggerResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ Swagger acessível:', swaggerResponse.status);

    // 3. Verificar se a documentação JSON do Swagger está disponível
    console.log('\n3️⃣ Verificando documentação JSON do Swagger...');
    const swaggerJson = await axios.get(`${BASE_URL}/api-json`);
    console.log('✅ Documentação JSON disponível');

    // 4. Procurar pela rota específica na documentação
    console.log('\n4️⃣ Procurando pela rota /quizzes/{id}/public na documentação...');
    const paths = swaggerJson.data.paths;
    
    let foundRoute = false;
    for (const path in paths) {
      if (path.includes('/quizzes/') && path.includes('/public')) {
        console.log('✅ Rota encontrada:', path);
        console.log('📄 Métodos disponíveis:', Object.keys(paths[path]));
        foundRoute = true;
      }
    }

    if (!foundRoute) {
      console.log('❌ Rota /quizzes/{id}/public não encontrada na documentação');
      console.log('\n📋 Rotas disponíveis que contêm "quizzes":');
      for (const path in paths) {
        if (path.includes('quizzes')) {
          console.log('  -', path, '->', Object.keys(paths[path]));
        }
      }
    }

    // 5. Testar a rota diretamente
    console.log('\n5️⃣ Testando a rota diretamente...');
    try {
      const routeTest = await axios.get(`${BASE_URL}/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public`);
      console.log('✅ Rota funcionando:', routeTest.status);
    } catch (error) {
      console.log('❌ Rota não funcionando:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('📄 Erro:', JSON.stringify(error.response.data, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Erro ao verificar:', error.message);
  }
}

checkSwagger().catch(console.error); 