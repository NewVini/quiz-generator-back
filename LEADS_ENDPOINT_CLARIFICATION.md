# 🔍 Clarificação sobre Endpoints de Leads

## ❌ Problema Identificado

O usuário está tentando usar um endpoint que **não existe**:
```
POST /quizzes/{projectId}/leads  ❌ (NÃO EXISTE)
```

## ✅ Endpoints Corretos

### 1. **Enviar Respostas de Quiz (Público)**
```
POST /quizzes/{quizId}/leads
```

**O que faz:** Endpoint público para enviar respostas de quiz e capturar leads
**Parâmetro:** `quizId` (ID do quiz específico)
**Autenticação:** Não requerida
**Uso:** Frontend público para submissão de respostas

### 2. **Listar Leads de Projeto (Autenticado)**
```
GET /quizzes/project/{projectId}/leads
```

**O que faz:** Lista todos os leads de um projeto específico
**Parâmetro:** `projectId` (ID do projeto)
**Autenticação:** Requerida (JWT token)
**Uso:** Dashboard do usuário para visualizar leads

## 🔄 Fluxo Correto no Frontend

### Passo 1: Buscar Quiz Público
```typescript
// Buscar quiz pelo ID
const quiz = await fetch(`/quizzes/${quizId}/public`);
// Retorna: { id, name, project: { id, name, ... }, ... }
```

### Passo 2: Enviar Respostas do Quiz
```typescript
// Usar o quizId (NÃO o projectId)
const response = await fetch(`/quizzes/${quizId}/leads`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "lead@email.com",
    name: "Carlos Oliveira",
    phone: "+5511999999999",
    custom_fields: {},
    responses: { ... },
    source: "website"
  })
});
```

## 🚨 Erro Comum

**❌ Incorreto:**
```typescript
// Usando projectId na URL (NÃO EXISTE)
POST /quizzes/fb624020-dff7-438c-b68c-884edb468f68/leads
```

**✅ Correto:**
```typescript
// Usando quizId na URL
POST /quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads
```

## 📝 Exemplo Completo

### Frontend (React/TypeScript)
```typescript
// 1. Buscar quiz público
const fetchQuiz = async (quizId: string) => {
  const response = await fetch(`http://localhost:3000/quizzes/${quizId}/public`);
  if (!response.ok) throw new Error('Quiz não encontrado');
  return response.json();
};

// 2. Enviar respostas
const submitQuiz = async (quizId: string, leadData: any) => {
  const response = await fetch(`http://localhost:3000/quizzes/${quizId}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao enviar respostas');
  }
  
  return response.json();
};

// Uso
const quiz = await fetchQuiz('5f3e5a33-f22a-4a25-a9ec-2da98355d87f');
await submitQuiz(quiz.id, {
  email: "lead@email.com",
  name: "Carlos Oliveira",
  phone: "+5511999999999",
  custom_fields: {},
  responses: { question1: "resposta1", question2: "resposta2" },
  source: "website"
});
```

### cURL Exemplo
```bash
# 1. Buscar quiz
curl 'http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public'

# 2. Enviar respostas (usando quizId, NÃO projectId)
curl -X POST 'http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "lead@email.com",
    "name": "Carlos Oliveira",
    "phone": "+5511999999999",
    "custom_fields": {},
    "responses": {"question1": "resposta1"},
    "source": "website"
  }'
```

## 🔧 Verificação no Backend

### Endpoints Disponíveis
```bash
# Listar todas as rotas
curl 'http://localhost:3000/api' | grep -i leads
```

### Logs de Debug
```typescript
// No backend, adicionar logs para debug
console.log('Quiz ID recebido:', quizId);
console.log('Payload recebido:', createLeadDto);
```

## 📊 Resumo dos Endpoints

| Endpoint | Método | Parâmetro | Autenticação | Uso |
|----------|--------|-----------|--------------|-----|
| `/quizzes/{quizId}/leads` | POST | quizId | ❌ | Enviar respostas |
| `/quizzes/project/{projectId}/leads` | GET | projectId | ✅ | Listar leads |
| `/quizzes/{quizId}/leads` | GET | quizId | ✅ | Listar leads do quiz |

## 🎯 Solução

1. **Use sempre `quizId`** para enviar respostas de quiz
2. **O `projectId`** é apenas para listar leads no dashboard
3. **Confirme que está usando o ID correto** do quiz, não do projeto
4. **Verifique se o quiz existe** antes de tentar enviar respostas

## 🔍 Debug

Se ainda receber "Project not found", verifique:

1. **O ID na URL é realmente um quizId?**
2. **O quiz existe no banco de dados?**
3. **O quiz está associado a um projeto válido?**

```sql
-- Verificar se o quiz existe
SELECT * FROM quizzes WHERE id = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';

-- Verificar se o projeto existe
SELECT * FROM projects WHERE id = 'fb624020-dff7-438c-b68c-884edb468f68';
``` 