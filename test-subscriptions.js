const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSubscriptions() {
  console.log('🧪 Testando Sistema de Subscriptions\n');

  try {
    // 1. Obter planos disponíveis
    console.log('1. 📋 Obtendo planos disponíveis...');
    const plansResponse = await axios.get(`${BASE_URL}/subscriptions/plans`);
    console.log('✅ Planos disponíveis:', JSON.stringify(plansResponse.data, null, 2));
    console.log('');

    // 2. Criar uma subscription mensal
    console.log('2. 💳 Criando subscription mensal...');
    const subscriptionData = {
      user_id: '123e4567-e89b-12d3-a456-426614174001',
      plan_type: 'monthly',
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-02-01',
      next_billing: '2024-02-01'
    };

    const createResponse = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData);
    console.log('✅ Subscription criada:', JSON.stringify(createResponse.data, null, 2));
    const subscriptionId = createResponse.data.id;
    console.log('');

    // 3. Verificar limites de quiz
    console.log('3. 📊 Verificando limites de quiz...');
    const quizLimitResponse = await axios.get(`${BASE_URL}/subscriptions/limits/quiz/${subscriptionData.user_id}`);
    console.log('✅ Limite de quiz:', JSON.stringify(quizLimitResponse.data, null, 2));
    console.log('');

    // 4. Verificar limites de lead
    console.log('4. 📊 Verificando limites de lead...');
    const leadLimitResponse = await axios.get(`${BASE_URL}/subscriptions/limits/lead/${subscriptionData.user_id}`);
    console.log('✅ Limite de lead:', JSON.stringify(leadLimitResponse.data, null, 2));
    console.log('');

    // 5. Obter subscription ativa do usuário
    console.log('5. 👤 Obtendo subscription ativa do usuário...');
    const activeResponse = await axios.get(`${BASE_URL}/subscriptions/user/${subscriptionData.user_id}/active`);
    console.log('✅ Subscription ativa:', JSON.stringify(activeResponse.data, null, 2));
    console.log('');

    // 6. Listar todas as subscriptions
    console.log('6. 📋 Listando todas as subscriptions...');
    const allResponse = await axios.get(`${BASE_URL}/subscriptions`);
    console.log('✅ Total de subscriptions:', allResponse.data.length);
    console.log('');

    // 7. Simular uso (incrementar contadores)
    console.log('7. ➕ Simulando uso da subscription...');
    
    // Incrementar uso de quiz
    await axios.patch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
      quizzes_used: 5,
      leads_used: 150
    });
    
    // Verificar limites novamente
    const updatedQuizLimit = await axios.get(`${BASE_URL}/subscriptions/limits/quiz/${subscriptionData.user_id}`);
    const updatedLeadLimit = await axios.get(`${BASE_URL}/subscriptions/limits/lead/${subscriptionData.user_id}`);
    
    console.log('✅ Limite de quiz após uso:', JSON.stringify(updatedQuizLimit.data, null, 2));
    console.log('✅ Limite de lead após uso:', JSON.stringify(updatedLeadLimit.data, null, 2));
    console.log('');

    // 8. Renovar subscription
    console.log('8. 🔄 Renovando subscription...');
    const renewResponse = await axios.post(`${BASE_URL}/subscriptions/${subscriptionId}/renew`);
    console.log('✅ Subscription renovada:', JSON.stringify(renewResponse.data, null, 2));
    console.log('');

    console.log('🎉 Todos os testes passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.response?.data || error.message);
  }
}

// Executar testes
testSubscriptions(); 