const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Função para fazer login e obter token
async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para criar um usuário de teste
async function createTestUser() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Usuário Teste Billing',
      email: 'teste.billing@example.com',
      password: '123456',
    });
    console.log('✅ Usuário criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o sistema de billing
async function testBillingSystem() {
  console.log('🚀 Iniciando testes do sistema de billing...\n');

  try {
    // 1. Criar usuário de teste
    console.log('1️⃣ Criando usuário de teste...');
    const user = await createTestUser();
    const userId = user.id;

    // 2. Fazer login
    console.log('2️⃣ Fazendo login...');
    const token = await login('teste.billing@example.com', '123456');
    const headers = { Authorization: `Bearer ${token}` };

    // 3. Verificar se pode criar subscription (deve retornar true - período de teste)
    console.log('3️⃣ Verificando se pode criar subscription...');
    const canSubscribe = await axios.get(`${BASE_URL}/billings/check/can-subscribe/${userId}`, { headers });
    console.log('✅ Pode criar subscription:', canSubscribe.data);

    // 4. Verificar se está em período de teste
    console.log('4️⃣ Verificando período de teste...');
    const isInTrial = await axios.get(`${BASE_URL}/billings/check/trial/${userId}`, { headers });
    console.log('✅ Está em período de teste:', isInTrial.data);

    // 5. Verificar se tem billing pago
    console.log('5️⃣ Verificando billing pago...');
    const hasPaid = await axios.get(`${BASE_URL}/billings/check/paid/${userId}`, { headers });
    console.log('✅ Tem billing pago:', hasPaid.data);

    // 6. Criar uma subscription
    console.log('6️⃣ Criando subscription...');
    const subscription = await axios.post(`${BASE_URL}/subscriptions`, {
      user_id: userId,
      plan_type: 'monthly',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      next_billing: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }, { headers });
    console.log('✅ Subscription criada:', subscription.data);

    // 7. Listar billings do usuário
    console.log('7️⃣ Listando billings do usuário...');
    const billings = await axios.get(`${BASE_URL}/billings/my-billings`, { headers });
    console.log('✅ Billings encontrados:', billings.data.length);
    billings.data.forEach((billing, index) => {
      console.log(`   Billing ${index + 1}:`, {
        id: billing.id,
        type: billing.billing_type,
        status: billing.status,
        amount: billing.amount,
        is_trial: billing.is_trial,
        trial_end_date: billing.trial_end_date,
      });
    });

    // 8. Criar um billing de subscription (após período de teste)
    console.log('8️⃣ Criando billing de subscription...');
    const subscriptionBilling = await axios.post(`${BASE_URL}/billings/subscription`, {
      userId: userId,
      subscriptionId: subscription.data.id,
      amount: 29.90,
      planType: 'monthly',
    }, { headers });
    console.log('✅ Billing de subscription criado:', subscriptionBilling.data);

    // 9. Marcar billing como pago
    console.log('9️⃣ Marcando billing como pago...');
    const markPaid = await axios.post(`${BASE_URL}/billings/${subscriptionBilling.data.id}/mark-paid`, {
      paymentGatewayId: 'pg_test_123',
    }, { headers });
    console.log('✅ Billing marcado como pago:', markPaid.data);

    // 10. Verificar novamente se tem billing pago
    console.log('🔟 Verificando billing pago novamente...');
    const hasPaidAfter = await axios.get(`${BASE_URL}/billings/check/paid/${userId}`, { headers });
    console.log('✅ Tem billing pago após pagamento:', hasPaidAfter.data);

    // 11. Listar billings pendentes que vencem hoje
    console.log('1️⃣1️⃣ Listando billings pendentes que vencem hoje...');
    const pendingToday = await axios.get(`${BASE_URL}/billings/pending/due-today`, { headers });
    console.log('✅ Billings pendentes hoje:', pendingToday.data.length);

    // 12. Listar billings de teste que expiram hoje
    console.log('1️⃣2️⃣ Listando billings de teste que expiram hoje...');
    const trialExpiring = await axios.get(`${BASE_URL}/billings/trial/expiring-today`, { headers });
    console.log('✅ Billings de teste expirando hoje:', trialExpiring.data.length);

    console.log('\n🎉 Todos os testes do sistema de billing foram executados com sucesso!');

  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.response?.data || error.message);
  }
}

// Executar os testes
testBillingSystem(); 