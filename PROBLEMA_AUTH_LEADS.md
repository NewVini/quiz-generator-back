# 🔍 Problema de Autenticação no Endpoint de Leads

## 📋 Descrição do Problema

O usuário está recebendo erro "unauthorized" ao tentar acessar os leads do seu próprio quiz, mesmo estando autenticado.

### Comando curl que está falhando:
```bash
curl 'http://localhost:3000/quizzes/7ba790d6-49bf-41d2-8f1e-e88ab296abc7/leads' \
  -H 'Accept: */*' \
  -H 'Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'DNT: 1' \
  -H 'Origin: http://localhost:5173' \
  -H 'Referer: http://localhost:5173/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"'
```

## 🔍 Análise do Problema

### 1. Endpoint Protegido
O endpoint `GET /quizzes/:quizId/leads` está protegido com `@UseGuards(JwtAuthGuard)`, então **requer autenticação**.

### 2. Fluxo de Verificação
```typescript
// LeadsController.findAllByQuiz
@UseGuards(JwtAuthGuard)
findAllByQuiz(@Param('quizId') quizId: string, @Request() req) {
  return this.leadsService.findAllByQuiz(quizId, req.user.sub);
}

// LeadsService.findAllByQuiz
async findAllByQuiz(quizId: string, userId: string): Promise<Lead[]> {
  // Verifica se o quiz pertence ao usuário
  await this.quizzesService.findOne(quizId, userId);
  
  return this.leadRepository.find({
    where: { quiz_id: quizId },
    order: { created_at: 'DESC' },
  });
}

// QuizzesService.findOne
async findOne(id: string, userId: string): Promise<Quiz> {
  const quiz = await this.quizRepository.findOne({
    where: { id },
    relations: ['project'],
  });

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  // Verifica se o projeto pertence ao usuário
  await this.projectsService.findOne(quiz.project_id, userId);

  return quiz;
}

// ProjectsService.findOne
async findOne(id: string, userId: string): Promise<Project> {
  const project = await this.projectRepository.findOne({
    where: { id, user_id: userId },
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  return project;
}
```

## 🚨 Possíveis Causas

### 1. Token JWT Ausente ou Inválido
- O comando curl não está enviando o header `Authorization: Bearer <token>`
- O token pode estar expirado
- O token pode estar malformado

### 2. Problema na Extração do User ID
- O `req.user.sub` pode não estar sendo extraído corretamente do token
- O JWT strategy pode estar com problema

### 3. Quiz Não Pertence ao Usuário
- O quiz pode pertencer a outro usuário
- O projeto pode pertencer a outro usuário

### 4. Problema no Banco de Dados
- Relacionamentos quebrados entre quiz, projeto e usuário
- Dados inconsistentes

## 🔧 Soluções

### 1. Comando curl Correto
```bash
# Primeiro, faça login para obter o token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "seu@email.com", "password": "suasenha"}'

# Use o token retornado no endpoint de leads
curl 'http://localhost:3000/quizzes/7ba790d6-49bf-41d2-8f1e-e88ab296abc7/leads' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -H 'Content-Type: application/json'
```

### 2. Scripts de Debug Criados

#### `debug-leads-auth.js`
Script completo para debugar o problema:
```bash
node debug-leads-auth.js
```

#### `test-leads-with-token.js`
Script para testar com token correto:
```bash
node test-leads-with-token.js
```

### 3. Logs Adicionados
Adicionei logs detalhados nos serviços para identificar onde está falhando:

- **LeadsService.findAllByQuiz**: Logs do início ao fim
- **QuizzesService.findOne**: Logs da busca do quiz e verificação do projeto
- **ProjectsService.findOne**: Logs da busca do projeto

## 🧪 Como Testar

### 1. Execute o Script de Debug
```bash
node debug-leads-auth.js
```

### 2. Verifique os Logs do Backend
Execute o backend e observe os logs quando fizer a requisição:
```bash
npm run start:dev
```

### 3. Teste Manual com Token
```bash
# 1. Faça login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123456"}'

# 2. Use o token retornado
curl 'http://localhost:3000/quizzes/7ba790d6-49bf-41d2-8f1e-e88ab296abc7/leads' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -H 'Content-Type: application/json'
```

## 📊 Resultados Esperados

### Se Tudo Estiver Funcionando:
```
✅ Login realizado com sucesso!
✅ Quiz encontrado e verificado
✅ Projeto verificado
✅ Leads obtidos com sucesso!
```

### Se Houver Problema:
```
❌ Erro 401: Token ausente ou inválido
❌ Erro 404: Quiz não encontrado
❌ Erro 404: Projeto não encontrado ou não pertence ao usuário
```

## 🔍 Próximos Passos

1. **Execute os scripts de debug** para identificar o problema específico
2. **Verifique os logs do backend** para ver onde está falhando
3. **Confirme as credenciais** do usuário
4. **Verifique se o quiz pertence ao usuário** correto
5. **Teste com o comando curl correto** incluindo o token JWT

## 📝 Notas Importantes

- O endpoint `POST /quizzes/:quizId/leads` é **público** (não requer auth)
- O endpoint `GET /quizzes/:quizId/leads` é **protegido** (requer auth)
- O usuário só pode ver leads dos seus próprios quizzes
- O sistema verifica propriedade através do relacionamento: Quiz → Project → User 