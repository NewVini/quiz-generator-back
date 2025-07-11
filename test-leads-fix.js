const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

console.log('🧪 Testando Correção do Endpoint de Leads\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testQuizPublic() {
  console.log('\n1️⃣ Testando endpoint público do quiz...');
  
  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/public`);
    console.log('✅ Quiz público encontrado:');
    console.log('   - ID:', response.data.id);
    console.log('   - Nome:', response.data.name);
    console.log('   - Status:', response.data.status);
    console.log('   - Project ID:', response.data.project?.id);
    return true;
  } catch (error) {
    console.log('❌ Erro ao buscar quiz público:', error.response?.status, error.response?.statusText);
    console.log('   - Mensagem:', error.response?.data?.message);
    return false;
  }
}

async function testLeadSubmission() {
  console.log('\n2️⃣ Testando submissão de lead (CORREÇÃO)...');
  
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
    console.log('   - Status:', response.status);
    
    return true;
  } catch (error) {
    console.log('❌ Erro ao criar lead:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Status Text:', error.response?.statusText);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    if (error.response?.status === 404) {
      console.log('\n🔍 Análise do erro 404:');
      console.log('   - Verifique se o backend foi reiniciado');
      console.log('   - Verifique se as correções foram aplicadas');
      console.log('   - Verifique os logs do backend');
    }
    
    return false;
  }
}

async function testMultipleLeads() {
  console.log('\n3️⃣ Testando múltiplos leads...');
  
  const testLeads = [
    {
      email: "teste1@teste.com",
      name: "Teste 1",
      phone: "111111111",
      responses: { "wppki6rvn": "option_1" },
      source: "teste-multiplo"
    },
    {
      email: "teste2@teste.com", 
      name: "Teste 2",
      phone: "222222222",
      responses: { "wppki6rvn": "option_2" },
      source: "teste-multiplo"
    }
  ];

  let successCount = 0;
  
  for (let i = 0; i < testLeads.length; i++) {
    const lead = testLeads[i];
    console.log(`   Testando lead ${i + 1}/${testLeads.length}...`);
    
    try {
      const response = await axios.post(
        `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
        lead,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log(`   ✅ Lead ${i + 1} criado:`, response.data.id);
      successCount++;
    } catch (error) {
      console.log(`   ❌ Erro no lead ${i + 1}:`, error.response?.status, error.response?.data?.message);
    }
  }
  
  console.log(`\n📊 Resultado: ${successCount}/${testLeads.length} leads criados com sucesso`);
  return successCount === testLeads.length;
}

async function runTests() {
  console.log('🚀 Iniciando testes da correção...\n');
  
  const quizOk = await testQuizPublic();
  
  if (quizOk) {
    const leadOk = await testLeadSubmission();
    
    if (leadOk) {
      await testMultipleLeads();
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS TESTES:');
  console.log(`   - Quiz público: ${quizOk ? '✅' : '❌'}`);
  console.log(`   - Lead submission: ${leadOk ? '✅' : '❌'}`);
  
  if (quizOk && leadOk) {
    console.log('\n🎉 CORREÇÃO APLICADA COM SUCESSO!');
    console.log('✅ O endpoint de leads agora funciona corretamente');
    console.log('✅ Não há mais verificação de permissões de usuário');
    console.log('✅ Leads públicos podem ser criados sem autenticação');
  } else {
    console.log('\n⚠️  Ainda há problemas:');
    console.log('1. Verifique se o backend foi reiniciado');
    console.log('2. Verifique se as correções foram aplicadas');
    console.log('3. Verifique os logs do backend');
  }
  
  console.log('\n💡 Para verificar no frontend:');
  console.log('1. Use o endpoint: POST /quizzes/{quizId}/leads');
  console.log('2. Use o quizId (não o projectId) na URL');
  console.log('3. Envie o payload correto com as respostas');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testQuizPublic, testLeadSubmission, testMultipleLeads }; 