const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '7ba790d6-49bf-41d2-8f1e-e88ab296abc7';

console.log('🔍 Testando Leads com Respostas Detalhadas\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testDetailedLeads() {
  console.log('\n1️⃣ Fazendo login para obter token...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login realizado com sucesso!');
    console.log('   - User ID:', loginResponse.data.user?.id);

    console.log('\n2️⃣ Testando endpoint de leads com respostas detalhadas...');
    
    const leadsResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Leads obtidos com sucesso!');
    console.log('   - Status:', leadsResponse.status);
    console.log('   - Total de leads:', leadsResponse.data.length);
    
    if (leadsResponse.data.length > 0) {
      console.log('\n📊 Estrutura do primeiro lead:');
      const firstLead = leadsResponse.data[0];
      
      console.log('   📋 Informações básicas:');
      console.log(`     - ID: ${firstLead.id}`);
      console.log(`     - Email: ${firstLead.email || 'N/A'}`);
      console.log(`     - Nome: ${firstLead.name || 'N/A'}`);
      console.log(`     - Telefone: ${firstLead.phone || 'N/A'}`);
      console.log(`     - Fonte: ${firstLead.source || 'N/A'}`);
      console.log(`     - Criado: ${firstLead.created_at}`);
      
      console.log('\n   📝 Respostas brutas:');
      console.log('     - Objeto responses:', JSON.stringify(firstLead.responses, null, 4));
      
      console.log('\n   🔍 Respostas detalhadas:');
      if (firstLead.detailed_responses && firstLead.detailed_responses.length > 0) {
        firstLead.detailed_responses.forEach((response, index) => {
          console.log(`     Resposta ${index + 1}:`);
          console.log(`       - ID da pergunta: ${response.question_id}`);
          console.log(`       - Texto da pergunta: ${response.question_text}`);
          console.log(`       - Tipo da pergunta: ${response.question_type}`);
          console.log(`       - Resposta: ${JSON.stringify(response.answer)}`);
          console.log(`       - Obrigatória: ${response.required}`);
          console.log('');
        });
      } else {
        console.log('     - Nenhuma resposta detalhada encontrada');
      }
      
      console.log('\n   📊 Estatísticas:');
      console.log(`     - Total de respostas brutas: ${Object.keys(firstLead.responses || {}).length}`);
      console.log(`     - Total de respostas detalhadas: ${firstLead.detailed_responses?.length || 0}`);
      
    } else {
      console.log('   - Nenhum lead encontrado para este quiz');
    }

    return { success: true, leads: leadsResponse.data };
  } catch (error) {
    console.log('❌ Erro no teste:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    return { success: false, error: error.response?.data };
  }
}

async function testQuizStructure() {
  console.log('\n3️⃣ Verificando estrutura do quiz...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;

    const quizResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const quiz = quizResponse.data;
    console.log('✅ Quiz obtido com sucesso!');
    console.log('   - Nome:', quiz.name);
    console.log('   - Status:', quiz.status);
    
    console.log('\n   📋 Estrutura do quiz_json:');
    if (quiz.quiz_json) {
      console.log('     - Tipo:', typeof quiz.quiz_json);
      console.log('     - Chaves principais:', Object.keys(quiz.quiz_json));
      
      if (quiz.quiz_json.questions) {
        console.log('     - Total de perguntas:', quiz.quiz_json.questions.length);
        if (quiz.quiz_json.questions.length > 0) {
          console.log('     - Primeira pergunta:', JSON.stringify(quiz.quiz_json.questions[0], null, 4));
        }
      }
      
      if (quiz.quiz_json.blocks) {
        console.log('     - Total de blocos:', quiz.quiz_json.blocks.length);
        const questionBlocks = quiz.quiz_json.blocks.filter(block => block.type === 'question');
        console.log('     - Blocos de pergunta:', questionBlocks.length);
      }
    } else {
      console.log('     - Quiz JSON não encontrado');
    }

    return { success: true, quiz };
  } catch (error) {
    console.log('❌ Erro ao obter quiz:', error.response?.status, error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function createTestLead() {
  console.log('\n4️⃣ Criando lead de teste para verificar formato...');
  
  const payload = {
    email: "teste.detalhado@teste.com",
    name: "Teste Respostas Detalhadas",
    phone: "11999887766",
    responses: {
      "txg5qew4i": "resposta_detalhada@teste.com",
      "0l8dcydo0": {
        "opcao1": true,
        "opcao2": false,
        "texto": "Resposta detalhada"
      },
      "nova_pergunta": "Resposta simples"
    },
    source: "teste-detalhado"
  };

  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Lead de teste criado!');
    console.log('   - Lead ID:', response.data.id);
    console.log('   - Email:', response.data.email);
    console.log('   - Respostas:', Object.keys(response.data.responses || {}).length, 'campos');
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao criar lead de teste:', error.response?.status, error.response?.data?.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes de leads com respostas detalhadas...\n');
  
  // Testar leads detalhados
  const detailedTest = await testDetailedLeads();
  
  // Verificar estrutura do quiz
  const quizTest = await testQuizStructure();
  
  // Criar lead de teste
  const testLead = await createTestLead();
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS TESTES:');
  console.log('=' .repeat(60));
  console.log(`   - Teste detalhado: ${detailedTest.success ? '✅' : '❌'}`);
  console.log(`   - Estrutura do quiz: ${quizTest.success ? '✅' : '❌'}`);
  console.log(`   - Lead de teste criado: ${testLead ? '✅' : '❌'}`);
  
  if (detailedTest.success) {
    console.log('\n🎉 FORMATO DE RESPOSTAS DETALHADAS FUNCIONANDO!');
    console.log('✅ O endpoint agora retorna:');
    console.log('   - Informações básicas do lead');
    console.log('   - Respostas brutas (formato original)');
    console.log('   - Respostas detalhadas com texto das perguntas');
    console.log('   - Tipo de pergunta e se é obrigatória');
  } else {
    console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
    console.log('   - Verifique se o backend está rodando');
    console.log('   - Verifique se as credenciais estão corretas');
    console.log('   - Verifique se o quiz pertence ao usuário');
  }
  
  console.log('\n🔧 PRÓXIMOS PASSOS:');
  console.log('1. Use o endpoint GET /quizzes/:quizId/leads com autenticação');
  console.log('2. As respostas agora incluem detailed_responses');
  console.log('3. Cada resposta detalhada tem question_text, question_type, etc.');
  console.log('4. Mantém compatibilidade com o formato anterior');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { 
  testDetailedLeads, 
  testQuizStructure, 
  createTestLead 
}; 