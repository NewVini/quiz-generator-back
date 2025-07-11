const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testLeadsEndpoint() {
  console.log('🧪 Testando Endpoint de Leads - Uso Correto\n');

  try {
    // 1. Primeiro, vamos buscar um quiz público para obter o quizId
    console.log('1️⃣ Buscando quiz público...');
    
    // Usar um quizId válido (substitua por um ID real do seu banco)
    const quizId = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f'; // Exemplo
    
    const quizResponse = await axios.get(`${API_BASE}/quizzes/${quizId}/public`);
    console.log('✅ Quiz encontrado:', {
      id: quizResponse.data.id,
      name: quizResponse.data.name,
      projectId: quizResponse.data.project?.id
    });

    // 2. Agora vamos enviar respostas usando o quizId correto
    console.log('\n2️⃣ Enviando respostas do quiz...');
    
    const leadData = {
      email: "teste@exemplo.com",
      name: "Usuário Teste",
      phone: "+5511999999999",
      custom_fields: {
        empresa: "Empresa Teste",
        cargo: "Desenvolvedor"
      },
      responses: {
        question1: "Resposta 1",
        question2: "Resposta 2",
        question3: "Resposta 3"
      },
      source: "teste-script"
    };

    const leadResponse = await axios.post(
      `${API_BASE}/quizzes/${quizId}/leads`, // ✅ Usando quizId
      leadData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Lead criado com sucesso:', {
      id: leadResponse.data.id,
      quizId: leadResponse.data.quiz_id,
      projectId: leadResponse.data.project_id,
      email: leadResponse.data.email
    });

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📝 Resumo:');
    console.log('- ✅ Endpoint correto: POST /quizzes/{quizId}/leads');
    console.log('- ✅ Parâmetro correto: quizId (não projectId)');
    console.log('- ✅ Payload correto enviado');
    console.log('- ✅ Lead criado no banco de dados');

  } catch (error) {
    console.error('\n❌ Erro no teste:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n🔍 Possíveis causas do erro 404:');
      console.log('1. Quiz ID não existe no banco de dados');
      console.log('2. Quiz não está associado a um projeto válido');
      console.log('3. Banco de dados não está conectado');
      
      console.log('\n💡 Para verificar:');
      console.log('- Confirme que o quizId existe: SELECT * FROM quizzes WHERE id = ?');
      console.log('- Verifique se o projeto existe: SELECT * FROM projects WHERE id = ?');
    }
  }
}

async function testWrongEndpoint() {
  console.log('\n🚨 Testando Endpoint INCORRETO (para demonstração)\n');

  try {
    // Tentar usar projectId na URL (endpoint que não existe)
    const projectId = 'fb624020-dff7-438c-b68c-884edb468f68'; // Exemplo
    
    console.log('❌ Tentando usar endpoint incorreto...');
    console.log(`POST /quizzes/${projectId}/leads (NÃO EXISTE)`);
    
    const response = await axios.post(
      `${API_BASE}/quizzes/${projectId}/leads`, // ❌ Usando projectId
      {
        email: "teste@exemplo.com",
        name: "Usuário Teste",
        responses: {}
      }
    );
    
    console.log('❌ Isso não deveria funcionar!');
    
  } catch (error) {
    console.log('✅ Erro esperado:', error.response?.status, error.response?.statusText);
    console.log('✅ Confirma que o endpoint POST /quizzes/{projectId}/leads NÃO EXISTE');
  }
}

async function listAvailableEndpoints() {
  console.log('\n📋 Endpoints de Leads Disponíveis:\n');
  
  console.log('✅ POST /quizzes/{quizId}/leads');
  console.log('   - Para enviar respostas de quiz (público)');
  console.log('   - Parâmetro: quizId');
  console.log('   - Autenticação: Não requerida\n');
  
  console.log('✅ GET /quizzes/{quizId}/leads');
  console.log('   - Para listar leads de um quiz (autenticado)');
  console.log('   - Parâmetro: quizId');
  console.log('   - Autenticação: Requerida\n');
  
  console.log('✅ GET /quizzes/project/{projectId}/leads');
  console.log('   - Para listar leads de um projeto (autenticado)');
  console.log('   - Parâmetro: projectId');
  console.log('   - Autenticação: Requerida\n');
  
  console.log('❌ POST /quizzes/{projectId}/leads');
  console.log('   - NÃO EXISTE');
  console.log('   - Este é o erro que você estava enfrentando');
}

// Executar testes
async function runTests() {
  console.log('🔍 DIAGNÓSTICO: Endpoint de Leads\n');
  console.log('=' .repeat(50));
  
  await testLeadsEndpoint();
  await testWrongEndpoint();
  await listAvailableEndpoints();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📚 Para mais informações, consulte: LEADS_ENDPOINT_CLARIFICATION.md');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testLeadsEndpoint, testWrongEndpoint, listAvailableEndpoints }; 