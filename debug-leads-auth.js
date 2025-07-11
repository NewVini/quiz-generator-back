const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '7ba790d6-49bf-41d2-8f1e-e88ab296abc7';

console.log('🔍 Debugando Problema de Autenticação nos Leads\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testAuthFlow() {
  console.log('\n1️⃣ Testando fluxo de autenticação...');
  
  // Primeiro, vamos fazer login para obter um token válido
  const loginPayload = {
    email: "test@test.com", // Use o email correto do seu usuário
    password: "123456"      // Use a senha correta
  };

  console.log('📝 Tentando fazer login com:', loginPayload.email);

  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login realizado com sucesso!');
    console.log('   - Token obtido:', token.substring(0, 50) + '...');
    console.log('   - User ID:', loginResponse.data.user?.id);

    // Agora vamos testar o endpoint de leads com o token
    console.log('\n2️⃣ Testando endpoint de leads com token...');
    
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
      const firstLead = leadsResponse.data[0];
      console.log('   - Primeiro lead:');
      console.log('     * ID:', firstLead.id);
      console.log('     * Email:', firstLead.email);
      console.log('     * Respostas:', Object.keys(firstLead.responses || {}).length, 'campos');
    }

    return { success: true, token, userId: loginResponse.data.user?.id };
  } catch (error) {
    console.log('❌ Erro no fluxo de autenticação:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    console.log('   - Error:', error.response?.data?.error);
    
    return { success: false, error: error.response?.data };
  }
}

async function testWithoutAuth() {
  console.log('\n3️⃣ Testando endpoint SEM autenticação (deve falhar)...');
  
  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`);
    console.log('⚠️  Endpoint funcionou sem auth (problema de segurança):', response.status);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Endpoint corretamente rejeitou acesso sem autenticação');
    } else {
      console.log('❌ Erro inesperado:', error.response?.status, error.response?.data?.message);
    }
  }
}

async function testQuizOwnership() {
  console.log('\n4️⃣ Verificando propriedade do quiz...');
  
  try {
    // Primeiro fazer login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user?.id;

    console.log('   - User ID:', userId);

    // Verificar se o quiz existe e pertence ao usuário
    const quizResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Quiz encontrado:');
    console.log('   - ID:', quizResponse.data.id);
    console.log('   - Nome:', quizResponse.data.name);
    console.log('   - Project ID:', quizResponse.data.project?.id);
    console.log('   - Project User ID:', quizResponse.data.project?.user_id);
    console.log('   - Current User ID:', userId);
    console.log('   - Pertence ao usuário:', quizResponse.data.project?.user_id === userId);

    return { success: true, quiz: quizResponse.data, userId };
  } catch (error) {
    console.log('❌ Erro ao verificar propriedade do quiz:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function testProjectAccess() {
  console.log('\n5️⃣ Verificando acesso ao projeto...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@test.com",
      password: "123456"
    });

    const token = loginResponse.data.access_token;
    const userId = loginResponse.data.user?.id;

    // Primeiro, vamos descobrir o project_id do quiz
    const quizResponse = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const projectId = quizResponse.data.project?.id;
    console.log('   - Project ID do quiz:', projectId);

    // Agora vamos tentar acessar o projeto diretamente
    const projectResponse = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Projeto acessado com sucesso:');
    console.log('   - ID:', projectResponse.data.id);
    console.log('   - Nome:', projectResponse.data.name);
    console.log('   - User ID:', projectResponse.data.user_id);
    console.log('   - Current User ID:', userId);

    return { success: true, project: projectResponse.data };
  } catch (error) {
    console.log('❌ Erro ao acessar projeto:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    return { success: false, error: error.response?.data };
  }
}

async function createTestLead() {
  console.log('\n6️⃣ Criando lead de teste para verificar se funciona...');
  
  const payload = {
    email: "teste.auth@teste.com",
    name: "Teste Auth",
    phone: "11999887766",
    responses: {
      "pergunta1": "resposta_teste",
      "pergunta2": "outra_resposta"
    },
    source: "teste-auth"
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
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao criar lead de teste:', error.response?.status, error.response?.data?.message);
    return null;
  }
}

async function runDebug() {
  console.log('🚀 Iniciando debug do problema de autenticação...\n');
  
  // Testar fluxo completo de auth
  const authResult = await testAuthFlow();
  
  // Testar sem auth
  await testWithoutAuth();
  
  // Verificar propriedade do quiz
  const quizResult = await testQuizOwnership();
  
  // Verificar acesso ao projeto
  const projectResult = await testProjectAccess();
  
  // Criar lead de teste
  const testLead = await createTestLead();
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DO DEBUG:');
  console.log('=' .repeat(60));
  console.log(`   - Auth flow: ${authResult.success ? '✅' : '❌'}`);
  console.log(`   - Quiz ownership: ${quizResult.success ? '✅' : '❌'}`);
  console.log(`   - Project access: ${projectResult.success ? '✅' : '❌'}`);
  console.log(`   - Test lead created: ${testLead ? '✅' : '❌'}`);
  
  if (authResult.success && quizResult.success && projectResult.success) {
    console.log('\n🎯 PROBLEMA IDENTIFICADO:');
    console.log('O usuário está autenticado e tem acesso ao quiz/projeto,');
    console.log('mas algo está falhando na verificação de permissões.');
    console.log('\n💡 POSSÍVEIS CAUSAS:');
    console.log('1. Token JWT expirado ou inválido');
    console.log('2. Problema na extração do user.sub do token');
    console.log('3. Problema na verificação de propriedade do quiz');
    console.log('4. Problema na verificação de propriedade do projeto');
  } else {
    console.log('\n⚠️  PROBLEMAS ENCONTRADOS:');
    if (!authResult.success) console.log('   - Falha na autenticação');
    if (!quizResult.success) console.log('   - Falha no acesso ao quiz');
    if (!projectResult.success) console.log('   - Falha no acesso ao projeto');
  }
  
  console.log('\n🔧 PRÓXIMOS PASSOS:');
  console.log('1. Verificar se o token JWT está sendo enviado corretamente');
  console.log('2. Verificar se o user.sub está sendo extraído corretamente');
  console.log('3. Verificar se o quiz realmente pertence ao usuário');
  console.log('4. Verificar logs do backend para mais detalhes');
}

// Executar se chamado diretamente
if (require.main === module) {
  runDebug().catch(console.error);
}

module.exports = { 
  testAuthFlow, 
  testWithoutAuth, 
  testQuizOwnership, 
  testProjectAccess, 
  createTestLead 
}; 