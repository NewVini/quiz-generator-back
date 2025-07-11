const axios = require('axios');

const API_BASE = 'http://localhost:3000';

console.log('🔍 DEMONSTRAÇÃO: Endpoints de Leads\n');
console.log('=' .repeat(60));

// Simular dados de exemplo
const EXAMPLE_QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
const EXAMPLE_PROJECT_ID = 'fb624020-dff7-438c-b68c-884edb468f68';

console.log('📋 ENDPOINTS DISPONÍVEIS:\n');

console.log('✅ 1. POST /quizzes/{quizId}/leads');
console.log('   - Para enviar respostas de quiz (público)');
console.log('   - Exemplo: POST /quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads');
console.log('   - Parâmetro: quizId (ID do quiz)\n');

console.log('✅ 2. GET /quizzes/project/{projectId}/leads');
console.log('   - Para listar leads de um projeto (autenticado)');
console.log('   - Exemplo: GET /quizzes/project/fb624020-dff7-438c-b68c-884edb468f68/leads');
console.log('   - Parâmetro: projectId (ID do projeto)\n');

console.log('❌ 3. POST /quizzes/{projectId}/leads');
console.log('   - NÃO EXISTE - Este é o erro que você estava enfrentando');
console.log('   - Exemplo: POST /quizzes/fb624020-dff7-438c-b68c-884edb468f68/leads');
console.log('   - Resultado: 404 Not Found\n');

console.log('=' .repeat(60));
console.log('🔄 FLUXO CORRETO NO FRONTEND:\n');

console.log('1️⃣ Buscar quiz público:');
console.log(`   GET /quizzes/${EXAMPLE_QUIZ_ID}/public`);
console.log('   Retorna: { id: "quiz-uuid", project: { id: "project-uuid", ... } }\n');

console.log('2️⃣ Enviar respostas (CORRETO):');
console.log(`   POST /quizzes/${EXAMPLE_QUIZ_ID}/leads`);
console.log('   ✅ Usando quizId na URL\n');

console.log('3️⃣ Enviar respostas (INCORRETO):');
console.log(`   POST /quizzes/${EXAMPLE_PROJECT_ID}/leads`);
console.log('   ❌ Usando projectId na URL (NÃO EXISTE)\n');

console.log('=' .repeat(60));
console.log('🧪 TESTE PRÁTICO:\n');

async function testCorrectEndpoint() {
  console.log('✅ Testando endpoint CORRETO...');
  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${EXAMPLE_QUIZ_ID}/leads`,
      {
        email: "teste@exemplo.com",
        name: "Usuário Teste",
        phone: "+5511999999999",
        custom_fields: {},
        responses: { question1: "resposta1" },
        source: "teste-script"
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('✅ Sucesso! Lead criado:', response.data.id);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Quiz não encontrado (ID pode não existir no banco)');
    } else {
      console.log('❌ Erro:', error.response?.data?.message || error.message);
    }
  }
}

async function testWrongEndpoint() {
  console.log('\n❌ Testando endpoint INCORRETO...');
  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${EXAMPLE_PROJECT_ID}/leads`, // ❌ Usando projectId
      {
        email: "teste@exemplo.com",
        name: "Usuário Teste",
        responses: {}
      }
    );
    console.log('❌ Isso não deveria funcionar!');
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✅ Erro esperado: Endpoint não existe');
      console.log('✅ Confirma que POST /quizzes/{projectId}/leads NÃO EXISTE');
    } else {
      console.log('❌ Erro inesperado:', error.response?.data?.message || error.message);
    }
  }
}

async function runTests() {
  await testCorrectEndpoint();
  await testWrongEndpoint();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📚 PRÓXIMOS PASSOS:');
  console.log('1. Verifique se o backend está rodando: npm run start:dev');
  console.log('2. Use IDs reais do seu banco de dados');
  console.log('3. Atualize o frontend para usar quiz.id na URL');
  console.log('4. Teste com dados reais');
  console.log('\n📖 Documentação completa: LEADS_ENDPOINT_SOLUTION.md');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCorrectEndpoint, testWrongEndpoint }; 