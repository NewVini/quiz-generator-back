# 📊 Leads com Respostas Detalhadas

## 🎯 Melhoria Implementada

O endpoint `GET /quizzes/:quizId/leads` agora retorna informações detalhadas das respostas, incluindo o texto das perguntas, tipo de pergunta e se é obrigatória.

## 📋 Estrutura da Resposta

### Antes (Formato Original)
```json
[
  {
    "id": "d0b36b8e-db72-40ff-8980-d1c250369f50",
    "quiz_id": "7ba790d6-49bf-41d2-8f1e-e88ab296abc7",
    "project_id": "7675dcc6-5398-47a8-8391-af97b1c0e93e",
    "email": "teste@teste.com",
    "name": "teste",
    "phone": "799998348",
    "custom_fields": {},
    "responses": {
      "txg5qew4i": "teste@tese.com",
      "0l8dcydo0": {}
    },
    "source": "website",
    "created_at": "2025-07-11T16:22:29.365Z"
  }
]
```

### Agora (Com Respostas Detalhadas)
```json
[
  {
    "id": "d0b36b8e-db72-40ff-8980-d1c250369f50",
    "quiz_id": "7ba790d6-49bf-41d2-8f1e-e88ab296abc7",
    "project_id": "7675dcc6-5398-47a8-8391-af97b1c0e93e",
    "email": "teste@teste.com",
    "name": "teste",
    "phone": "799998348",
    "custom_fields": {},
    "responses": {
      "txg5qew4i": "teste@tese.com",
      "0l8dcydo0": {}
    },
    "source": "website",
    "created_at": "2025-07-11T16:22:29.365Z",
    "detailed_responses": [
      {
        "question_id": "txg5qew4i",
        "question_text": "Qual é o seu email?",
        "question_type": "email",
        "answer": "teste@tese.com",
        "required": true
      },
      {
        "question_id": "0l8dcydo0",
        "question_text": "Selecione suas preferências",
        "question_type": "checkbox",
        "answer": {},
        "required": false
      }
    ]
  }
]
```

## 🔧 Implementação Técnica

### 1. Novos DTOs Criados

#### `LeadResponseDto`
```typescript
export class LeadResponseDto {
  id: string;
  quiz_id: string;
  project_id: string;
  email?: string;
  name?: string;
  phone?: string;
  custom_fields?: Record<string, any>;
  responses: Record<string, any>;
  source?: string;
  created_at: Date;
  detailed_responses?: QuestionResponseDto[];
}
```

#### `QuestionResponseDto`
```typescript
export class QuestionResponseDto {
  question_id: string;
  question_text: string;
  question_type: string;
  answer: any;
  required: boolean;
}
```

### 2. Método de Processamento

O `LeadsService` agora inclui um método `processLeadsWithDetails` que:

1. **Extrai perguntas do quiz**: Analisa o `quiz_json` para encontrar as perguntas
2. **Mapeia respostas**: Para cada resposta do lead, encontra a pergunta correspondente
3. **Cria detalhes**: Gera informações detalhadas incluindo texto da pergunta, tipo, etc.

### 3. Suporte a Diferentes Estruturas de Quiz

O sistema suporta diferentes formatos de `quiz_json`:

```typescript
// Formato 1: Array de perguntas
{
  "questions": [
    { "id": "q1", "text": "Pergunta 1", "type": "text" }
  ]
}

// Formato 2: Blocos
{
  "blocks": [
    { "type": "question", "data": { "id": "q1", "text": "Pergunta 1" } }
  ]
}

// Formato 3: Array direto
[
  { "id": "q1", "text": "Pergunta 1", "type": "text" }
]
```

## 🧪 Como Testar

### 1. Script de Teste
```bash
node test-detailed-leads.js
```

### 2. Teste Manual
```bash
# 1. Login para obter token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'

# 2. Usar o token para acessar leads
curl 'http://localhost:3000/quizzes/7ba790d6-49bf-41d2-8f1e-e88ab296abc7/leads' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -H 'Content-Type: application/json'
```

### 3. Exemplo de Resposta Esperada
```json
{
  "id": "lead-id",
  "email": "teste@teste.com",
  "responses": {
    "q1": "resposta simples"
  },
  "detailed_responses": [
    {
      "question_id": "q1",
      "question_text": "Qual é o seu nome?",
      "question_type": "text",
      "answer": "resposta simples",
      "required": true
    }
  ]
}
```

## 📊 Benefícios

### 1. **Informações Completas**
- Texto das perguntas para contexto
- Tipo de pergunta (text, email, checkbox, etc.)
- Indicação se é obrigatória

### 2. **Compatibilidade**
- Mantém o formato original (`responses`)
- Adiciona informações extras (`detailed_responses`)
- Não quebra integrações existentes

### 3. **Flexibilidade**
- Suporta diferentes estruturas de quiz
- Fallback para perguntas não encontradas
- Tratamento de erros robusto

### 4. **Documentação Swagger**
- DTOs documentados com `@ApiProperty`
- Exemplos claros na documentação
- Tipos TypeScript definidos

## 🔍 Casos de Uso

### 1. **Dashboard de Leads**
```javascript
// Exibir leads com contexto das perguntas
leads.forEach(lead => {
  lead.detailed_responses.forEach(response => {
    console.log(`${response.question_text}: ${response.answer}`);
  });
});
```

### 2. **Exportação de Dados**
```javascript
// Exportar para CSV com perguntas
const csvData = leads.map(lead => {
  const row = { email: lead.email, name: lead.name };
  lead.detailed_responses.forEach(response => {
    row[response.question_text] = response.answer;
  });
  return row;
});
```

### 3. **Análise de Respostas**
```javascript
// Analisar tipos de perguntas
const questionTypes = {};
leads.forEach(lead => {
  lead.detailed_responses.forEach(response => {
    questionTypes[response.question_type] = (questionTypes[response.question_type] || 0) + 1;
  });
});
```

## 🚀 Próximos Passos

1. **Teste o novo formato** com o script fornecido
2. **Atualize o frontend** para usar `detailed_responses`
3. **Implemente filtros** por tipo de pergunta
4. **Adicione estatísticas** de respostas
5. **Crie relatórios** baseados nas respostas detalhadas

## 📝 Notas Importantes

- **Autenticação obrigatória**: O endpoint requer JWT token
- **Propriedade do quiz**: Usuário só vê leads dos seus quizzes
- **Performance**: Processamento otimizado para grandes volumes
- **Logs detalhados**: Debug completo para troubleshooting 