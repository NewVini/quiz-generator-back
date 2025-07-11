const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
const PROJECT_ID = '7675dcc6-5398-47a8-8391-af97b1c0e93e';

console.log('🔍 Endpoints Disponíveis para Obter Respostas dos Leads\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log(`Project ID: ${PROJECT_ID}`);
console.log('=' .repeat(60));

async function testEndpointsWithoutAuth() {
  console.log('\n1️⃣ Testando endpoints SEM autenticação...');
  
  const endpoints = [
    {
      name: 'GET /quizzes/:quizId/leads',
      url: `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      description: 'Listar leads de um quiz específico'
    },
    {
      name: 'GET /quizzes/project/:projectId/leads', 
      url: `${API_BASE}/quizzes/project/${PROJECT_ID}/leads`,
      description: 'Listar leads de um projeto específico'
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n   Testando: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);
    console.log(`   Descrição: ${endpoint.description}`);
    
    try {
      const response = await axios.get(endpoint.url);
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Leads encontrados: ${response.data.length}`);
      
      if (response.data.length > 0) {
        const firstLead = response.data[0];
        console.log(`   📝 Exemplo de lead:`);
        console.log(`      - ID: ${firstLead.id}`);
        console.log(`      - Email: ${firstLead.email}`);
        console.log(`      - Respostas: ${Object.keys(firstLead.responses || {}).length} campos`);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`   🔒 Status: ${error.response.status} - Requer autenticação`);
        console.log(`   ℹ️  Este endpoint precisa de token JWT`);
      } else {
        console.log(`   ❌ Status: ${error.response?.status} - ${error.response?.data?.message}`);
      }
    }
  }
}

async function testWithMockAuth() {
  console.log('\n2️⃣ Testando com token mock (provavelmente falhará)...');
  
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE2NzI1NDU2NzgsImV4cCI6MTY3MjYzMjA3OH0.mock';
  
  try {
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, {
      headers: {
        'Authorization': `Bearer ${mockToken}`
      }
    });
    
    console.log('✅ Endpoint funcionou com token mock!');
    console.log(`📊 Leads encontrados: ${response.data.length}`);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('🔒 Token mock rejeitado (esperado)');
      console.log('ℹ️  Você precisa de um token JWT válido');
    } else {
      console.log('❌ Erro inesperado:', error.response?.status, error.response?.data?.message);
    }
  }
}

async function createTestLead() {
  console.log('\n3️⃣ Criando lead de teste para verificar respostas...');
  
  const payload = {
    email: "teste.endpoint@teste.com",
    name: "Teste Endpoint",
    phone: "11999887766",
    custom_fields: {
      teste: "valor_teste",
      numero: 123
    },
    responses: {
      "pergunta1": "Resposta 1",
      "pergunta2": "Resposta 2", 
      "pergunta3": {
        "subcampo": "valor_complexo"
      },
      "pergunta4": ["opcao1", "opcao2"]
    },
    source: "teste-endpoint"
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
    console.log(`   - Lead ID: ${response.data.id}`);
    console.log(`   - Email: ${response.data.email}`);
    console.log(`   - Respostas: ${Object.keys(response.data.responses).length} campos`);
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao criar lead de teste:', error.response?.status, error.response?.data?.message);
    return null;
  }
}

function showEndpointDocumentation() {
  console.log('\n' + '=' .repeat(60));
  console.log('📋 DOCUMENTAÇÃO DOS ENDPOINTS DE LEADS');
  console.log('=' .repeat(60));
  
  console.log('\n🔍 **ENDPOINTS DISPONÍVEIS:**');
  
  console.log('\n1️⃣ **GET /quizzes/:quizId/leads**');
  console.log('   📝 Descrição: Listar todos os leads de um quiz específico');
  console.log('   🔐 Autenticação: REQUERIDA (JWT Token)');
  console.log('   📊 Retorna: Array de leads com respostas');
  console.log('   💡 Uso: Para ver respostas de um quiz específico');
  
  console.log('\n2️⃣ **GET /quizzes/project/:projectId/leads**');
  console.log('   📝 Descrição: Listar todos os leads de um projeto');
  console.log('   🔐 Autenticação: REQUERIDA (JWT Token)');
  console.log('   📊 Retorna: Array de leads com respostas');
  console.log('   💡 Uso: Para ver respostas de todos os quizzes de um projeto');
  
  console.log('\n3️⃣ **POST /quizzes/:quizId/leads**');
  console.log('   📝 Descrição: Criar novo lead (submeter respostas)');
  console.log('   🔐 Autenticação: NÃO REQUERIDA (público)');
  console.log('   📊 Retorna: Lead criado com respostas');
  console.log('   💡 Uso: Para enviar respostas do quiz');
  
  console.log('\n🔐 **COMO OBTER TOKEN JWT:**');
  console.log('1. Faça login via POST /auth/login');
  console.log('2. Use o token retornado no header Authorization');
  console.log('3. Formato: Authorization: Bearer <seu_token>');
  
  console.log('\n📝 **EXEMPLO DE USO:**');
  console.log('```bash');
  console.log('# 1. Fazer login');
  console.log('curl -X POST http://localhost:3000/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"email":"seu@email.com","password":"sua_senha"}\'');
  console.log('');
  console.log('# 2. Usar o token para buscar leads');
  console.log('curl -X GET http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads \\');
  console.log('  -H "Authorization: Bearer SEU_TOKEN_AQUI"');
  console.log('```');
  
  console.log('\n📊 **ESTRUTURA DA RESPOSTA:**');
  console.log('```json');
  console.log('[');
  console.log('  {');
  console.log('    "id": "uuid-do-lead",');
  console.log('    "email": "lead@email.com",');
  console.log('    "name": "Nome do Lead",');
  console.log('    "phone": "11999887766",');
  console.log('    "responses": {');
  console.log('      "pergunta1": "resposta1",');
  console.log('      "pergunta2": "resposta2"');
  console.log('    },');
  console.log('    "custom_fields": {');
  console.log('      "campo1": "valor1"');
  console.log('    },');
  console.log('    "source": "website",');
  console.log('    "created_at": "2024-01-01T00:00:00.000Z"');
  console.log('  }');
  console.log(']');
  console.log('```');
}

async function runTests() {
  console.log('🚀 Iniciando testes dos endpoints de leads...\n');
  
  // Testar endpoints sem auth
  await testEndpointsWithoutAuth();
  
  // Testar com token mock
  await testWithMockAuth();
  
  // Criar lead de teste
  const testLead = await createTestLead();
  
  // Mostrar documentação
  showEndpointDocumentation();
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS ENDPOINTS:');
  console.log('=' .repeat(60));
  console.log('✅ POST /quizzes/:quizId/leads - PÚBLICO (criar leads)');
  console.log('🔒 GET /quizzes/:quizId/leads - AUTENTICADO (listar leads do quiz)');
  console.log('🔒 GET /quizzes/project/:projectId/leads - AUTENTICADO (listar leads do projeto)');
  
  console.log('\n💡 **PARA OBTER RESPOSTAS DOS LEADS:**');
  console.log('1. Use GET /quizzes/:quizId/leads (com autenticação)');
  console.log('2. Ou GET /quizzes/project/:projectId/leads (com autenticação)');
  console.log('3. As respostas estão no campo "responses" de cada lead');
  
  if (testLead) {
    console.log(`\n🎯 Lead de teste criado com ID: ${testLead.id}`);
    console.log('Use este ID para testar os endpoints autenticados!');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { 
  testEndpointsWithoutAuth, 
  testWithMockAuth, 
  createTestLead, 
  showEndpointDocumentation 
}; 