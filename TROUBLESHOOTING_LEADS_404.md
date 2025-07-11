# 🔍 Troubleshooting: Erro 404 no Endpoint de Leads

## 🚨 Problema Reportado

```
POST /quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads
```

**Erro:** `{"message":"Project not found","error":"Not Found","statusCode":404}`

## 🔍 Análise do Problema

### ❌ **ERRO INCORRETO**
O erro diz "Project not found", mas deveria ser "Quiz not found" se o problema fosse o quiz não existir.

### ✅ **DIAGNÓSTICO**
O problema está no **LeadsService** que está chamando `ProjectsService.findOne()` que requer um `userId`, mas para leads públicos não temos `userId`.

## 🛠️ Soluções Implementadas

### 1. **Logs de Debug Adicionados**
```typescript
// LeadsService
console.log('🔍 [LeadsService] Criando lead para quizId:', quizId);
console.log('🔍 [LeadsService] Payload recebido:', JSON.stringify(createLeadDto, null, 2));

// QuizzesService
console.log('🔍 [QuizzesService] findOneAny - Buscando quiz com ID:', id);
```

### 2. **Scripts de Teste Criados**
- `debug-backend.js` - Debug completo do backend
- `test-specific-quiz.js` - Teste específico do seu quiz
- `check-database-ids.js` - Verificar IDs no banco

## 🧪 Testes para Executar

### 1. **Verificar Backend**
```bash
node debug-backend.js
```

### 2. **Testar Quiz Específico**
```bash
node test-specific-quiz.js
```

### 3. **Verificar IDs no Banco**
```bash
node check-database-ids.js
```

## 🔧 Possíveis Causas e Soluções

### **Causa 1: Quiz não existe no banco**
**Sintomas:**
- Logs mostram "Quiz não encontrado"
- Endpoint `/quizzes/{id}/public` retorna 404

**Solução:**
```sql
-- Verificar se o quiz existe
SELECT * FROM quizzes WHERE id = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
```

### **Causa 2: Problema de conexão com banco**
**Sintomas:**
- Backend não consegue conectar ao MySQL
- Erros de timeout ou connection refused

**Solução:**
1. Verificar se MySQL está rodando
2. Confirmar credenciais no `.env`
3. Testar conexão manual

### **Causa 3: Problema na consulta SQL**
**Sintomas:**
- Quiz existe mas consulta falha
- Erros no log do backend

**Solução:**
1. Verificar logs detalhados do backend
2. Confirmar estrutura da tabela
3. Testar consulta SQL manual

### **Causa 4: Problema de configuração**
**Sintomas:**
- Backend não inicia
- Erros de configuração

**Solução:**
1. Verificar arquivo `.env`
2. Confirmar `ormconfig.ts`
3. Reiniciar backend

## 📋 Checklist de Verificação

### ✅ **Backend**
- [ ] Backend está rodando (`npm run start:dev`)
- [ ] Logs aparecem no console
- [ ] Endpoint raiz responde (`GET /`)

### ✅ **Banco de Dados**
- [ ] MySQL está rodando
- [ ] Credenciais corretas no `.env`
- [ ] Tabelas existem no banco
- [ ] Quiz existe na tabela `quizzes`

### ✅ **Quiz Específico**
- [ ] Quiz ID está correto
- [ ] Quiz está publicado
- [ ] Quiz tem projeto associado
- [ ] Endpoint `/quizzes/{id}/public` funciona

### ✅ **Endpoint de Leads**
- [ ] Rota está registrada
- [ ] Controller está funcionando
- [ ] Service está sendo chamado
- [ ] Logs aparecem no console

## 🚀 Próximos Passos

### 1. **Execute os Scripts de Debug**
```bash
# Debug completo
node debug-backend.js

# Teste específico
node test-specific-quiz.js
```

### 2. **Verifique os Logs do Backend**
```bash
npm run start:dev
# Observe os logs quando fizer a requisição
```

### 3. **Teste Manual com cURL**
```bash
# Teste o quiz público primeiro
curl 'http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public'

# Depois teste o endpoint de leads
curl -X POST 'http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads' \
  -H 'Content-Type: application/json' \
  -d '{"email":"teste@teste.com","name":"Teste","responses":{}}'
```

### 4. **Verifique o Banco Diretamente**
```sql
-- Conectar ao MySQL e executar:
USE quiz_generator;
SELECT * FROM quizzes WHERE id = '5f3e5a33-f22a-4a25-a9ec-2da98355d87f';
SELECT * FROM projects WHERE id = 'fb624020-dff7-438c-b68c-884edb468f68';
```

## 📞 Informações para Debug

### **Dados do Quiz:**
- **ID:** `5f3e5a33-f22a-4a25-a9ec-2da98355d87f`
- **Nome:** "nome do meu saco"
- **Status:** "published"
- **Project ID:** `fb624020-dff7-438c-b68c-884edb468f68`

### **Payload Enviado:**
```json
{
  "email": "teste@teste.com",
  "name": "Viniçando Machado",
  "phone": "799887987",
  "custom_fields": {},
  "responses": {
    "wppki6rvn": "option_1",
    "duj60yz52": "option_1",
    "d3x4bmdty": "1198873783",
    "of8x2vfrd": "teste@teste.com",
    "oi4kwk3fe": "119889484",
    "9y1k8a6ik": "option_2",
    "slalrym7t": {}
  },
  "source": "website"
}
```

## 🎯 Resultado Esperado

### **Sucesso (201 Created):**
```json
{
  "id": "lead-uuid",
  "quiz_id": "5f3e5a33-f22a-4a25-a9ec-2da98355d87f",
  "project_id": "fb624020-dff7-438c-b68c-884edb468f68",
  "email": "teste@teste.com",
  "name": "Viniçando Machado",
  "phone": "799887987",
  "responses": { ... },
  "source": "website",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

Execute os scripts de debug e me informe os resultados para identificarmos a causa exata do problema! 🔍 