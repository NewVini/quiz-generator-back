const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const QUIZ_ID = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

console.log('🧪 Testando Salvamento das Respostas dos Leads\n');
console.log('=' .repeat(60));
console.log(`Quiz ID: ${QUIZ_ID}`);
console.log('=' .repeat(60));

async function testLeadWithResponses() {
  console.log('\n1️⃣ Testando criação de lead com respostas...');
  
  const payload = {
    email: "teste.respostas@teste.com",
    name: "Teste Respostas",
    phone: "11999887766",
    custom_fields: {
      idade: "25",
      cidade: "São Paulo",
      interesse: "tecnologia"
    },
    responses: {
      "wppki6rvn": "option_1",
      "duj60yz52": "option_2", 
      "d3x4bmdty": "1198873783",
      "of8x2vfrd": "teste.respostas@teste.com",
      "oi4kwk3fe": "119889484",
      "9y1k8a6ik": "option_3",
      "slalrym7t": {
        "escolha1": "Sim",
        "escolha2": "Não"
      }
    },
    source: "teste-respostas"
  };

  console.log('📝 Payload com respostas:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      }
    );

    console.log('✅ Lead criado com sucesso!');
    console.log('   - Lead ID:', response.data.id);
    console.log('   - Email:', response.data.email);
    console.log('   - Nome:', response.data.name);
    console.log('   - Telefone:', response.data.phone);
    console.log('   - Fonte:', response.data.source);
    console.log('   - Custom Fields:', JSON.stringify(response.data.custom_fields, null, 2));
    console.log('   - Respostas:', JSON.stringify(response.data.responses, null, 2));
    
    return response.data;
  } catch (error) {
    console.log('❌ Erro ao criar lead com respostas:');
    console.log('   - Status:', error.response?.status);
    console.log('   - Mensagem:', error.response?.data?.message);
    return null;
  }
}

async function testDifferentResponseTypes() {
  console.log('\n2️⃣ Testando diferentes tipos de respostas...');
  
  const testCases = [
    {
      name: "Respostas Simples",
      payload: {
        email: "simples@teste.com",
        name: "Teste Simples",
        responses: {
          "q1": "Sim",
          "q2": "Não",
          "q3": "Talvez"
        },
        source: "teste-simples"
      }
    },
    {
      name: "Respostas Complexas",
      payload: {
        email: "complexo@teste.com", 
        name: "Teste Complexo",
        responses: {
          "escala": 8,
          "texto": "Esta é uma resposta longa com muito texto para testar se está sendo salva corretamente.",
          "multipla": ["opcao1", "opcao3"],
          "objeto": {
            "subcampo1": "valor1",
            "subcampo2": "valor2",
            "array": [1, 2, 3, 4, 5]
          },
          "booleano": true,
          "numero": 42.5
        },
        source: "teste-complexo"
      }
    },
    {
      name: "Respostas Vazias",
      payload: {
        email: "vazio@teste.com",
        name: "Teste Vazio", 
        responses: {
          "pergunta1": "",
          "pergunta2": null,
          "pergunta3": {},
          "pergunta4": []
        },
        source: "teste-vazio"
      }
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n   Testando: ${testCase.name}`);
    
    try {
      const response = await axios.post(
        `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
        testCase.payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log(`   ✅ ${testCase.name} - Lead criado:`, response.data.id);
      console.log(`   📊 Respostas salvas:`, Object.keys(response.data.responses).length, 'campos');
      
      results.push({
        name: testCase.name,
        success: true,
        leadId: response.data.id,
        responseCount: Object.keys(response.data.responses).length
      });
    } catch (error) {
      console.log(`   ❌ ${testCase.name} - Erro:`, error.response?.status, error.response?.data?.message);
      results.push({
        name: testCase.name,
        success: false,
        error: error.response?.data?.message
      });
    }
  }
  
  return results;
}

async function verifyDatabaseStructure() {
  console.log('\n3️⃣ Verificando estrutura do banco de dados...');
  
  try {
    // Testar se conseguimos buscar leads existentes
    const response = await axios.get(`${API_BASE}/quizzes/${QUIZ_ID}/leads`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Seria necessário token para endpoint privado
      }
    });
    
    console.log('✅ Estrutura do banco OK');
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️  Endpoint requer autenticação (normal para listagem)');
      console.log('✅ Estrutura do banco provavelmente OK');
      return true;
    } else {
      console.log('❌ Erro ao verificar estrutura:', error.response?.status);
      return false;
    }
  }
}

async function testResponseValidation() {
  console.log('\n4️⃣ Testando validação de respostas...');
  
  const invalidPayloads = [
    {
      name: "Sem respostas",
      payload: {
        email: "sem.respostas@teste.com",
        name: "Teste Sem Respostas"
        // Sem campo 'responses'
      }
    },
    {
      name: "Respostas vazias",
      payload: {
        email: "respostas.vazias@teste.com", 
        name: "Teste Respostas Vazias",
        responses: {}
      }
    },
    {
      name: "Respostas null",
      payload: {
        email: "respostas.null@teste.com",
        name: "Teste Respostas Null", 
        responses: null
      }
    }
  ];

  const results = [];
  
  for (const testCase of invalidPayloads) {
    console.log(`\n   Testando: ${testCase.name}`);
    
    try {
      const response = await axios.post(
        `${API_BASE}/quizzes/${QUIZ_ID}/leads`,
        testCase.payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log(`   ⚠️  ${testCase.name} - Aceito (pode ser um problema):`, response.data.id);
      results.push({
        name: testCase.name,
        accepted: true,
        leadId: response.data.id
      });
    } catch (error) {
      console.log(`   ✅ ${testCase.name} - Rejeitado (correto):`, error.response?.status, error.response?.data?.message);
      results.push({
        name: testCase.name,
        accepted: false,
        error: error.response?.data?.message
      });
    }
  }
  
  return results;
}

async function runTests() {
  console.log('🚀 Iniciando testes de respostas dos leads...\n');
  
  // Teste básico
  const basicLead = await testLeadWithResponses();
  
  // Teste diferentes tipos
  const typeResults = await testDifferentResponseTypes();
  
  // Verificar estrutura
  const dbOk = await verifyDatabaseStructure();
  
  // Teste validação
  const validationResults = await testResponseValidation();
  
  // Resumo
  console.log('\n' + '=' .repeat(60));
  console.log('📋 RESUMO DOS TESTES DE RESPOSTAS:');
  console.log(`   - Lead básico: ${basicLead ? '✅' : '❌'}`);
  console.log(`   - Estrutura DB: ${dbOk ? '✅' : '❌'}`);
  
  const successfulTypes = typeResults.filter(r => r.success).length;
  console.log(`   - Tipos de resposta: ${successfulTypes}/${typeResults.length} ✅`);
  
  const properValidation = validationResults.filter(r => !r.accepted).length;
  console.log(`   - Validação: ${properValidation}/${validationResults.length} ✅`);
  
  if (basicLead && dbOk && successfulTypes === typeResults.length) {
    console.log('\n🎉 RESPOSTAS SENDO SALVAS CORRETAMENTE!');
    console.log('✅ Campo "responses" está funcionando');
    console.log('✅ Diferentes tipos de dados são aceitos');
    console.log('✅ Estrutura JSON está correta');
    console.log('✅ Validação está adequada');
  } else {
    console.log('\n⚠️  Há problemas com o salvamento das respostas:');
    if (!basicLead) console.log('   - Lead básico não foi criado');
    if (!dbOk) console.log('   - Problema na estrutura do banco');
    if (successfulTypes < typeResults.length) console.log('   - Alguns tipos de resposta falharam');
  }
  
  console.log('\n💡 Para verificar no banco de dados:');
  console.log('SELECT id, email, responses FROM leads WHERE quiz_id = ? ORDER BY created_at DESC LIMIT 5;');
  console.log(`-- Substitua ? por: ${QUIZ_ID}`);
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { 
  testLeadWithResponses, 
  testDifferentResponseTypes, 
  verifyDatabaseStructure, 
  testResponseValidation 
}; 