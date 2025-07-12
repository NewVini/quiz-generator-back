# Sistema de Login com Verificação de Subscription

## 🔐 Visão Geral

O sistema de autenticação agora inclui verificação obrigatória de subscription ativa. **Usuários sem plano ativo não conseguem fazer login**, garantindo que apenas usuários pagantes tenham acesso ao sistema.

## 🚫 Bloqueios Implementados

### 1. Usuário sem Subscription
- **Status**: 403 Forbidden
- **Código**: `SUBSCRIPTION_REQUIRED`
- **Mensagem**: "Você precisa de uma subscription ativa para acessar o sistema"
- **Inclui**: Lista de planos disponíveis

### 2. Subscription Expirada
- **Status**: 403 Forbidden
- **Código**: `SUBSCRIPTION_EXPIRED`
- **Mensagem**: "Sua subscription expirou. Renove para continuar usando o sistema."
- **Inclui**: Detalhes da subscription expirada

## 📋 Endpoints de Autenticação

### POST /auth/register
Registra um novo usuário, mas **não permite login** até que uma subscription seja criada.

**Payload:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456",
  "phone": "+5511999999999"
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+5511999999999",
    "role": "owner"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Usuário registrado com sucesso. Crie uma subscription para acessar o sistema."
}
```

### POST /auth/login
Autentica o usuário e verifica subscription ativa.

**Payload:**
```json
{
  "email": "joao@example.com",
  "password": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+5511999999999",
    "role": "owner"
  },
  "subscription": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "plan_type": "monthly",
    "status": "active",
    "end_date": "2024-02-01",
    "next_billing": "2024-02-01",
    "quizzes_limit": 1000,
    "leads_limit": 100000,
    "quizzes_used": 5,
    "leads_used": 150,
    "price": 29.90
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro - Sem Subscription (403):**
```json
{
  "statusCode": 403,
  "message": "Subscription required",
  "code": "SUBSCRIPTION_REQUIRED",
  "details": {
    "message": "Você precisa de uma subscription ativa para acessar o sistema",
    "availablePlans": {
      "free": {
        "quizzes_limit": 50,
        "leads_limit": 10000,
        "price": 0
      },
      "monthly": {
        "quizzes_limit": 1000,
        "leads_limit": 100000,
        "price": 29.90
      },
      "yearly": {
        "quizzes_limit": 1000,
        "leads_limit": 100000,
        "price": 299.90
      }
    },
    "user_id": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

**Resposta de Erro - Subscription Expirada (403):**
```json
{
  "statusCode": 403,
  "message": "Subscription expired",
  "code": "SUBSCRIPTION_EXPIRED",
  "details": {
    "message": "Sua subscription expirou. Renove para continuar usando o sistema.",
    "subscription": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "plan_type": "monthly",
      "end_date": "2024-01-01",
      "next_billing": "2024-02-01"
    },
    "user_id": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

## 🔄 Fluxo de Autenticação

### 1. Registro de Usuário
```
1. Usuário se registra → POST /auth/register
2. Sistema cria usuário
3. Retorna token + mensagem sobre subscription
4. Usuário NÃO consegue fazer login ainda
```

### 2. Criação de Subscription
```
1. Admin cria subscription → POST /subscriptions
2. Sistema associa subscription ao usuário
3. Subscription fica ativa
```

### 3. Login com Subscription
```
1. Usuário tenta login → POST /auth/login
2. Sistema verifica credenciais
3. Sistema verifica subscription ativa
4. Sistema verifica se não expirou
5. Se tudo OK → Login permitido + dados da subscription
```

### 4. Renovação de Subscription
```
1. Subscription expira
2. Usuário não consegue mais fazer login
3. Admin renova → POST /subscriptions/{id}/renew
4. Usuário consegue fazer login novamente
```

## 🧪 Testando o Sistema

### Script de Teste Completo
Execute o script para testar todo o fluxo:

```bash
node test-login-subscription.js
```

Este script testa:
1. ✅ Registro de usuário
2. ✅ Tentativa de login sem subscription (bloqueado)
3. ✅ Criação de subscription
4. ✅ Login com subscription (permitido)
5. ✅ Login com subscription expirada (bloqueado)
6. ✅ Renovação de subscription
7. ✅ Login após renovação (permitido)

### Testes Manuais

#### 1. Testar Login sem Subscription
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "123456"
  }'
```

**Resposta esperada:**
```json
{
  "statusCode": 403,
  "message": "Subscription required",
  "code": "SUBSCRIPTION_REQUIRED"
}
```

#### 2. Testar Login com Subscription Ativa
```bash
# Primeiro criar subscription
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID",
    "plan_type": "monthly",
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-02-01",
    "next_billing": "2024-02-01"
  }'

# Depois fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "123456"
  }'
```

## 🛡️ Segurança e Validações

### Validações Implementadas
- ✅ Verificação de credenciais (email/senha)
- ✅ Verificação de subscription ativa
- ✅ Verificação de data de expiração
- ✅ Bloqueio de login sem subscription
- ✅ Bloqueio de login com subscription expirada

### Códigos de Erro
- `SUBSCRIPTION_REQUIRED`: Usuário não possui subscription
- `SUBSCRIPTION_EXPIRED`: Subscription ativa mas expirada
- `Invalid credentials`: Email ou senha incorretos

## 📊 Dados Retornados no Login

### Informações do Usuário
- ID, nome, email, telefone, role

### Informações da Subscription
- ID, tipo de plano, status
- Datas de início, fim e próxima cobrança
- Limites de quizzes e leads
- Uso atual de quizzes e leads
- Preço do plano

### Token JWT
- Token de autenticação para uso em outras APIs

## 🔧 Integração com Frontend

### Fluxo Recomendado
1. **Registro**: Usuário se registra → Mostrar mensagem sobre subscription
2. **Criação de Plano**: Admin cria subscription → Usuário pode fazer login
3. **Login**: Verificar resposta para mostrar dados da subscription
4. **Dashboard**: Mostrar limites e uso atual
5. **Renovação**: Alertar quando próximo da expiração

### Exemplo de Integração
```javascript
// Frontend - Login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Login bem-sucedido
    const { user, subscription, token } = response.data;
    
    // Salvar dados
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('subscription', JSON.stringify(subscription));
    
    // Mostrar dashboard com dados da subscription
    showDashboard(user, subscription);
    
  } catch (error) {
    if (error.response?.status === 403) {
      const { code, details } = error.response.data;
      
      if (code === 'SUBSCRIPTION_REQUIRED') {
        // Mostrar planos disponíveis
        showAvailablePlans(details.availablePlans);
      } else if (code === 'SUBSCRIPTION_EXPIRED') {
        // Mostrar opção de renovação
        showRenewalOption(details.subscription);
      }
    }
  }
};
```

## 📈 Monitoramento

### Métricas Importantes
- Total de tentativas de login sem subscription
- Total de logins com subscription expirada
- Taxa de conversão (registro → subscription → login)
- Tempo médio entre registro e criação de subscription

### Logs Recomendados
```javascript
// Log de tentativa de login sem subscription
logger.warn('Login attempt without subscription', {
  user_id: userId,
  email: email,
  timestamp: new Date()
});

// Log de login com subscription expirada
logger.warn('Login attempt with expired subscription', {
  user_id: userId,
  subscription_id: subscription.id,
  expired_date: subscription.end_date
});
```

---

## 📞 Suporte

Para dúvidas sobre o sistema de login com subscription:
- 📖 Documentação Swagger: `http://localhost:3000/api`
- 🧪 Scripts de teste: `test-login-subscription.js`
- 📊 Logs do sistema para debugging
- 📋 Guia de subscriptions: `SUBSCRIPTION_SYSTEM_GUIDE.md` 