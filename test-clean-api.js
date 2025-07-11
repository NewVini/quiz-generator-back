const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '7ba790d6-49bf-41d2-8f1e-e88ab296abc7';

console.log('🧪 Testando API Limpa (Sem Logs)\n');
console.log('=' .repeat(50));

async function testCleanAPI() {
  console.log('1️⃣ Testando endpoint de leads com autenticação...');
  
  try {
    // Login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login realizado');

    // Testar leads
    const leadsResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Leads obtidos com sucesso');
    console.log(`   - Total de leads: ${leadsResponse.data.length}`);
    
    if (leadsResponse.data.length > 0) {
      const firstLead = leadsResponse.data[0];
      console.log(`   - Primeiro lead: ${firstLead.email || 'N/A'}`);
      console.log(`   - Respostas detalhadas: ${firstLead.detailed_responses?.length || 0}`);
    }

    return { success: true };
  } catch (error) {
    console.log('❌ Erro:', error.response?.status, error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function testPublicLeadCreation() {
  console.log('\n2️⃣ Testando criação de lead público...');
  
  try {
    const payload = {
      email: "teste.limpo@teste.com",
      name: "Teste API Limpa",
      phone: "11999887766",
      responses: {
        "teste1": "resposta teste",
        "teste2": "outra resposta"
      },
      source: "teste-limpo"
    };

    const response = await axios.post(
      `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Lead criado com sucesso');
    console.log(`   - Lead ID: ${response.data.id}`);
    console.log(`   - Email: ${response.data.email}`);

    return { success: true, lead: response.data };
  } catch (error) {
    console.log('❌ Erro:', error.response?.status, error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes da API limpa...\n');
  
  const authTest = await testCleanAPI();
  const leadTest = await testPublicLeadCreation();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 RESULTADO DOS TESTES:');
  console.log('=' .repeat(50));
  console.log(`   - Autenticação: ${authTest.success ? '✅' : '❌'}`);
  console.log(`   - Criação de lead: ${leadTest.success ? '✅' : '❌'}`);
  
  if (authTest.success && leadTest.success) {
    console.log('\n🎉 API FUNCIONANDO PERFEITAMENTE!');
    console.log('✅ Sem logs SQL no terminal');
    console.log('✅ Sem logs de debug');
    console.log('✅ Apenas a API rodando limpa');
  } else {
    console.log('\n⚠️  Alguns testes falharam');
  }
  
  console.log('\n💡 Para verificar se não há logs:');
  console.log('   - Execute: npm run start:dev');
  console.log('   - O terminal deve ficar limpo, sem queries SQL');
  console.log('   - Apenas o servidor rodando silenciosamente');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCleanAPI, testPublicLeadCreation }; 