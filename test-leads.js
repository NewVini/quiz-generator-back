// Script de teste para o endpoint de leads
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(requestOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testLeadsEndpoint() {
  console.log('🧪 Testando endpoint de leads...\n');

  const quizId = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
      const testData = {
      email: "teste@teste.com",
      name: "teste",
      phone: "344444444",
      custom_fields: {},
      responses: {
        "wppki6rvn": "option_1",
        "duj60yz52": "option_1",
        "d3x4bmdty": "33333",
        "of8x2vfrd": "teste@teste.com",
        "oi4kwk3fe": "44444444",
        "9y1k8a6ik": "option_1"
      },
      source: "website"
    };

  try {
    console.log(`📡 Fazendo requisição para: ${BASE_URL}/quizzes/${quizId}/leads`);
    console.log('📄 Dados enviados:', JSON.stringify(testData, null, 2));
    
    const response = await makeRequest(
      `${BASE_URL}/quizzes/${quizId}/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          'sec-ch-ua-platform': '"Windows"'
        }
      },
      testData
    );

    console.log('\n✅ Resposta recebida:');
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('\n📄 Dados da resposta:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 201) {
      console.log('\n🎉 Lead criado com sucesso!');
    } else {
      console.log('\n⚠️ Status inesperado:', response.status);
    }

  } catch (error) {
    console.log('❌ Erro na requisição:');
    console.error('Erro:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Dados do erro:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Executar teste
testLeadsEndpoint().catch(console.error); 