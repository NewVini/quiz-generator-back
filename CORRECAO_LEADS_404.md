# 🔧 Correção do Erro 404 nos Leads

## 🎯 **PROBLEMA IDENTIFICADO**

O erro 404 estava ocorrendo porque o sistema tentava verificar permissões de usuário ao criar leads públicos. Nos logs SQL, era possível ver:

```sql
-- Busca com user_id específico (que falha para leads públicos)
SELECT * FROM projects WHERE id = ? AND user_id = ?
-- PARAMETERS: ["7675dcc6-5398-47a8-8391-af97b1c0e93e","public"]
```

O problema era que o `QuizzesService.findOneAny()` estava carregando as relations do projeto, o que fazia o TypeORM tentar verificar permissões de usuário.

## ✅ **SOLUÇÃO APLICADA**

### 1. **QuizzesService.findOneAny() - Simplificado**

**Antes:**
```typescript
// Carregava relations que causavam verificação de permissões
const quiz = await this.quizRepository.findOne({
  where: { id },
  relations: ['project'], // ❌ Causava problemas
});
```

**Depois:**
```typescript
// Busca simples sem relations para leads públicos
const quiz = await this.quizRepository.findOne({
  where: { id },
  select: ['id', 'name', 'project_id', 'status', 'quiz_json', 'settings', 'lead_count', 'created_at', 'updated_at', 'published_at']
});
```

### 2. **LeadsService.create() - Verificação Direta**

**Adicionado:**
```typescript
// Verificar se o projeto existe (sem verificar permissões de usuário)
const projectExists = await this.projectRepository.findOne({
  where: { id: quiz.project_id },
  select: ['id']
});

if (!projectExists) {
  throw new NotFoundException('Project not found');
}
```

### 3. **LeadsModule - Injeção do Project Repository**

**Adicionado:**
```typescript
// No constructor do LeadsService
@InjectRepository(Project)
private readonly projectRepository: Repository<Project>,

// No LeadsModule
imports: [TypeOrmModule.forFeature([Lead, Quiz, Project]), ...]
```

## 🧪 **COMO TESTAR**

### 1. **Reinicie o Backend**
```bash
npm run start:dev
```

### 2. **Execute o Script de Teste**
```bash
node test-leads-fix.js
```

### 3. **Teste Manual com cURL**
```bash
curl -X POST http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "name": "Teste",
    "phone": "123456789",
    "responses": {"wppki6rvn": "option_1"},
    "source": "teste"
  }'
```

## 📋 **RESULTADO ESPERADO**

### ✅ **Sucesso:**
```json
{
  "id": "uuid-do-lead",
  "quiz_id": "5f3e5a33-f22a-4a25-a9ec-2da98355d87f",
  "project_id": "7675dcc6-5398-47a8-8391-af97b1c0e93e",
  "email": "teste@teste.com",
  "name": "Teste",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### ❌ **Antes (Erro 404):**
```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```

## 🔍 **LOGS ESPERADOS**

### ✅ **Logs de Sucesso:**
```
🔍 [QuizzesService] findOneAny - Buscando quiz com ID: 5f3e5a33-f22a-4a25-a9ec-2da98355d87f
✅ [QuizzesService] findOneAny - Quiz encontrado: { id: "...", name: "...", project_id: "...", status: "published" }
✅ [LeadsService] Quiz encontrado: { id: "...", name: "...", project_id: "...", status: "published" }
✅ [LeadsService] Projeto encontrado: 7675dcc6-5398-47a8-8391-af97b1c0e93e
✅ [LeadsService] Lead criado com sucesso: { id: "...", quiz_id: "...", project_id: "..." }
```

## 🎯 **PRINCIPAIS MUDANÇAS**

1. **Removida verificação de permissões de usuário** para leads públicos
2. **Simplificada busca do quiz** sem carregar relations desnecessárias
3. **Adicionada verificação direta** da existência do projeto
4. **Mantida funcionalidade** de atualização do contador de leads

## 🚀 **PRÓXIMOS PASSOS**

1. ✅ Testar com o script `test-leads-fix.js`
2. ✅ Verificar no frontend se os leads são criados
3. ✅ Confirmar que o contador de leads é atualizado
4. ✅ Testar com diferentes tipos de quiz

## 📝 **NOTAS IMPORTANTES**

- **Leads públicos** não precisam de autenticação
- **O quizId** deve ser usado na URL (não o projectId)
- **As respostas** devem mapear questionId → answer
- **O contador de leads** é atualizado automaticamente

---

**Status:** ✅ **CORREÇÃO APLICADA**  
**Data:** 2024-01-01  
**Versão:** 1.0.0 