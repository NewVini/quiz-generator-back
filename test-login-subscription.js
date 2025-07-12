const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLoginWithSubscription() {
  console.log('🧪 Testando Login com Verificação de Subscription\n');

  try {
    // 1. Registrar um novo usuário
    console.log('1. 📝 Registrando novo usuário...');
    const registerData = {
      name: 'Teste Subscription',
      email: 'teste.subscription@example.com',
      password: '123456',
      phone: '+5511999999999'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Usuário registrado:', registerResponse.data.user.id);
    console.log('📝 Mensagem:', registerResponse.data.message);
    console.log('');

    const userId = registerResponse.data.user.id;

    // 2. Tentar fazer login sem subscription (deve falhar)
    console.log('2. 🚫 Tentando login sem subscription...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: registerData.email,
        password: registerData.password
      });
      console.log('❌ ERRO: Login deveria ter falhado!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Login bloqueado corretamente - Subscription required');
        console.log('📋 Código:', error.response.data.code);
        console.log('💬 Mensagem:', error.response.data.details.message);
        console.log('📊 Planos disponíveis:', Object.keys(error.response.data.details.availablePlans));
      } else {
        console.log('❌ Erro inesperado:', error.response?.data);
      }
    }
    console.log('');

    // 3. Criar uma subscription para o usuário
    console.log('3. 💳 Criando subscription mensal...');
    const subscriptionData = {
      user_id: userId,
      plan_type: 'monthly',
      status: 'active',
      start_date: '2024-01-01',
      end_date: '2024-02-01',
      next_billing: '2024-02-01'
    };

    const subscriptionResponse = await axios.post(`${BASE_URL}/subscriptions`, subscriptionData);
    console.log('✅ Subscription criada:', subscriptionResponse.data.id);
    console.log('');

    // 4. Tentar fazer login com subscription (deve funcionar)
    console.log('4. ✅ Tentando login com subscription...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Usuário:', loginResponse.data.user.name);
    console.log('📋 Plano:', loginResponse.data.subscription.plan_type);
    console.log('📊 Limites - Quizzes:', loginResponse.data.subscription.quizzes_used + '/' + loginResponse.data.subscription.quizzes_limit);
    console.log('📊 Limites - Leads:', loginResponse.data.subscription.leads_used + '/' + loginResponse.data.subscription.leads_limit);
    console.log('');

    // 5. Testar login com subscription expirada
    console.log('5. ⏰ Testando subscription expirada...');
    
    // Atualizar subscription para expirada
    await axios.patch(`${BASE_URL}/subscriptions/${subscriptionResponse.data.id}`, {
      end_date: '2023-12-01' // Data passada
    });

    // Tentar login novamente
    try {
      const expiredLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: registerData.email,
        password: registerData.password
      });
      console.log('❌ ERRO: Login deveria ter falhado com subscription expirada!');
    } catch (error) {
      if (error.response?.status === 403 && error.response.data.code === 'SUBSCRIPTION_EXPIRED') {
        console.log('✅ Login bloqueado corretamente - Subscription expired');
        console.log('📋 Código:', error.response.data.code);
        console.log('💬 Mensagem:', error.response.data.details.message);
        console.log('📅 Data de expiração:', error.response.data.details.subscription.end_date);
      } else {
        console.log('❌ Erro inesperado:', error.response?.data);
      }
    }
    console.log('');

    // 6. Renovar subscription e testar novamente
    console.log('6. 🔄 Renovando subscription...');
    const renewResponse = await axios.post(`${BASE_URL}/subscriptions/${subscriptionResponse.data.id}/renew`);
    console.log('✅ Subscription renovada até:', renewResponse.data.end_date);
    console.log('');

    // 7. Testar login após renovação
    console.log('7. ✅ Testando login após renovação...');
    const finalLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    
    console.log('✅ Login realizado com sucesso após renovação!');
    console.log('📅 Nova data de expiração:', finalLoginResponse.data.subscription.end_date);
    console.log('');

    console.log('🎉 Todos os testes de login com subscription passaram!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.response?.data || error.message);
  }
}

// Executar testes
testLoginWithSubscription(); 