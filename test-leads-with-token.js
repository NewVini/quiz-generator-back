const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '7ba790d6-49bf-41d2-8f1e-e88ab296abc7';

console.log('🔍 Testando Endpoint de Leads com Token JWT\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testWithToken() {
  console.log('\n1️⃣ Fazendo login para obter token...');
  
  // Use as credenciais corretas do seu usuário
  const loginPayload = {
    email: "test@test.com", // Substitua pelo email correto
    password: "123456"      // Substitua pela senha correta
  };

  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user?.id;

    console.log('✅ Login realizado com sucesso!');
    console.log('   - User ID:', userId);
    console.log('   - Token:', token.substring(0, 50) + '...');

    console.log('\n2️⃣ Testando endpoint de leads com token...');
    
    const leadsResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });

    console.log('✅ Leads obtidos com sucesso!');
    console.log('   - Status:', leadsResponse.status);
    console.log('   - Total de leads:', leadsResponse.data.length);
    
    if (leadsResponse.data.length > 0) {
      console.log('\n📊 Primeiros 3 leads:');
      leadsResponse.data.slice(0, 3).forEach((lead, index) => {
        console.log(`   Lead ${index + 1}:`);
        console.log(`     - ID: ${lead.id}`);
        console.log(`     - Email: ${lead.email || 'N/A'}`);
        console.log(`     - Nome: ${lead.name || 'N/A'}`);
        console.log(`     - Criado: ${lead.created_at}`);
        console.log(`     - Respostas: ${Object.keys(lead.responses || {}).length} campos`);
      });
    } else {
      console.log('   - Nenhum lead encontrado para este quiz');
    }

    return { success: true, token, userId, leads: leadsResponse.data };
  } catch (error) {
    console.log('❌ Erro no teste:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 Análise do erro 401:');
      console.log('   - Verifique se as credenciais estão corretas');
      console.log('   - Verifique se o token está sendo enviado corretamente');
      console.log('   - Verifique se o quiz pertence ao usuário');
    }
    
    return { success: false, error: error.response?.data };
  }
}

async function testCurlEquivalent() {
  console.log('\n3️⃣ Simulando o comando curl do usuário...');
  
  // Primeiro fazer login
  const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
    email: "test@test.com",
    password: "123456"
  });

  const token = loginResponse.data.access_token;
  
  // Simular exatamente os headers do curl
  const headers = {
    'Accept': '*/*',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Origin': 'http://localhost:5173',
    'Referer': 'http://localhost:5173/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Authorization': `Bearer ${token}` // Adicionar o token JWT
  };

  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, { headers });
    
    console.log('✅ Curl equivalente funcionou!');
    console.log('   - Status:', response.status);
    console.log('   - Total de leads:', response.data.length);
    
    return { success: true, leads: response.data };
  } catch (error) {
    console.log('❌ Curl equivalente falhou:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    
    return { success: false, error: error.response?.data };
  }
}

async function verifyQuizOwnership() {
  console.log('\n4️⃣ Verificando se o quiz pertence ao usuário...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user?.id;

    // Verificar o quiz
    const quizResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const quiz = quizResponse.data;
    const projectId = quiz.project?.id;

    console.log('📊 Informações do quiz:');
    console.log('   - Quiz ID:', quiz.id);
    console.log('   - Quiz Nome:', quiz.name);
    console.log('   - Project ID:', projectId);
    console.log('   - Project User ID:', quiz.project?.user_id);
    console.log('   - Current User ID:', userId);
    console.log('   - Pertence ao usuário:', quiz.project?.user_id === userId);

    if (quiz.project?.user_id === userId) {
      console.log('✅ O quiz pertence ao usuário!');
      return { success: true, quiz, userId };
    } else {
      console.log('❌ O quiz NÃO pertence ao usuário!');
      return { success: false, quiz, userId };
    }
  } catch (error) {
    console.log('❌ Erro ao verificar propriedade:', error.response?.status, error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes do endpoint de leads...\n');
  
  // Teste básico com token
  const basicTest = await testWithToken();
  
  // Teste simulando curl
  const curlTest = await testCurlEquivalent();
  
  // Verificar propriedade do quiz
  const ownershipTest = await verifyQuizOwnership();
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS TESTES:');
  console.log('=' .repeat(60));
  console.log(`   - Teste básico: ${basicTest.success ? '✅' : '❌'}`);
  console.log(`   - Teste curl: ${curlTest.success ? '✅' : '❌'}`);
  console.log(`   - Propriedade do quiz: ${ownershipTest.success ? '✅' : '❌'}`);
  
  if (basicTest.success && curlTest.success && ownershipTest.success) {
    console.log('\n🎉 TUDO FUNCIONANDO!');
    console.log('✅ O endpoint de leads está funcionando corretamente');
    console.log('✅ A autenticação está funcionando');
    console.log('✅ O usuário tem acesso ao quiz');
  } else {
    console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
    if (!basicTest.success) console.log('   - Falha no teste básico');
    if (!curlTest.success) console.log('   - Falha no teste curl');
    if (!ownershipTest.success) console.log('   - Quiz não pertence ao usuário');
    
    console.log('\n💡 SOLUÇÕES:');
    console.log('1. Verifique se as credenciais estão corretas');
    console.log('2. Verifique se o quiz realmente pertence ao usuário');
    console.log('3. Verifique se o token JWT está sendo enviado corretamente');
    console.log('4. Verifique os logs do backend para mais detalhes');
  }
  
  console.log('\n🔧 COMANDO CURL CORRETO:');
  console.log('```bash');
  console.log('curl "http://localhost:3000/quizzes/7ba790d6-49bf-41d2-8f1e-e88ab296abc7/leads" \\');
  console.log('  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\');
  console.log('  -H "Content-Type: application/json"');
  console.log('```');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { 
  testWithToken, 
  testCurlEquivalent, 
  verifyQuizOwnership 
}; 