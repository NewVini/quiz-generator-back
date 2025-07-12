# Sistema de Subscriptions - Guia Completo

## 📋 Visão Geral

O sistema de subscriptions permite gerenciar planos de usuários com limites de uso para quizzes e leads. Atualmente suporta três tipos de planos:

### 🆓 Plano Free
- **Quizzes**: 50 por mês
- **Leads**: 10.000 por mês
- **Preço**: R$ 0,00

### 💳 Plano Monthly
- **Quizzes**: 1.000 por mês
- **Leads**: 100.000 por mês
- **Preço**: R$ 29,90/mês

### 📅 Plano Yearly
- **Quizzes**: 1.000 por mês
- **Leads**: 100.000 por mês
- **Preço**: R$ 299,90/ano (2 meses grátis)

## 🚀 Endpoints Disponíveis

### 1. Obter Planos Disponíveis
```http
GET /subscriptions/plans
```

**Resposta:**
```json
{
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
}
```

### 2. Criar Subscription
```http
POST /subscriptions
```

**Payload:**
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174001",
  "plan_type": "monthly",
  "status": "active",
  "start_date": "2024-01-01",
  "end_date": "2024-02-01",
  "next_billing": "2024-02-01"
}
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174001",
  "plan_type": "monthly",
  "status": "active",
  "start_date": "2024-01-01",
  "end_date": "2024-02-01",
  "next_billing": "2024-02-01",
  "quizzes_limit": 1000,
  "leads_limit": 100000,
  "quizzes_used": 0,
  "leads_used": 0,
  "price": 29.90,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 3. Verificar Limite de Quizzes
```http
GET /subscriptions/limits/quiz/{userId}
```

**Resposta:**
```json
{
  "canCreate": true,
  "current": 5,
  "limit": 1000
}
```

### 4. Verificar Limite de Leads
```http
GET /subscriptions/limits/lead/{userId}
```

**Resposta:**
```json
{
  "canCreate": true,
  "current": 150,
  "limit": 100000
}
```

### 5. Obter Subscription Ativa do Usuário
```http
GET /subscriptions/user/{userId}/active
```

### 6. Renovar Subscription
```http
POST /subscriptions/{id}/renew
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "123e4567-e89b-12d3-a456-426614174001",
  "plan_type": "monthly",
  "status": "active",
  "start_date": "2024-02-01",
  "end_date": "2024-03-01",
  "next_billing": "2024-03-01",
  "quizzes_limit": 1000,
  "leads_limit": 100000,
  "quizzes_used": 0,
  "leads_used": 0,
  "price": 29.90,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-02-01T00:00:00.000Z"
}
```

### 7. Minha Subscription (Autenticado)
```http
GET /subscriptions/me
Authorization: Bearer {token}
```

## 🔧 Integração com Outros Módulos

### Verificação de Limites em Quizzes
Antes de criar um quiz, verifique se o usuário pode criar mais:

```javascript
// No service de quizzes
const limitCheck = await this.subscriptionsService.checkQuizLimit(userId);
if (!limitCheck.canCreate) {
  throw new BadRequestException(`Limite de quizzes atingido. Usado: ${limitCheck.current}/${limitCheck.limit}`);
}

// Após criar o quiz com sucesso
await this.subscriptionsService.incrementQuizUsage(userId);
```

### Verificação de Limites em Leads
Antes de salvar um lead, verifique se o usuário pode receber mais:

```javascript
// No service de leads
const limitCheck = await this.subscriptionsService.checkLeadLimit(userId);
if (!limitCheck.canCreate) {
  throw new BadRequestException(`Limite de leads atingido. Usado: ${limitCheck.current}/${limitCheck.limit}`);
}

// Após salvar o lead com sucesso
await this.subscriptionsService.incrementLeadUsage(userId);
```

## 🧪 Testando o Sistema

Execute o script de teste:

```bash
node test-subscriptions.js
```

Este script testa:
1. ✅ Obter planos disponíveis
2. ✅ Criar subscription mensal
3. ✅ Verificar limites de quiz e lead
4. ✅ Obter subscription ativa
5. ✅ Listar todas as subscriptions
6. ✅ Simular uso (incrementar contadores)
7. ✅ Renovar subscription

## 📊 Monitoramento de Uso

### Contadores Automáticos
- `quizzes_used`: Incrementa automaticamente quando um quiz é criado
- `leads_used`: Incrementa automaticamente quando um lead é salvo

### Verificação de Status
- `status`: 'active', 'pending', 'expired', 'canceled'
- `end_date`: Data de expiração da subscription
- `next_billing`: Próxima data de cobrança

## 🔄 Renovação Automática

Para implementar renovação automática, você pode:

1. **Criar um cron job** que verifica subscriptions expiradas
2. **Integrar com gateway de pagamento** (Stripe, PayPal, etc.)
3. **Enviar notificações** para usuários com subscription expirando

### Exemplo de Cron Job
```javascript
// Verificar subscriptions expiradas diariamente
@Cron('0 0 * * *')
async checkExpiredSubscriptions() {
  const expiredSubscriptions = await this.subscriptionRepository.find({
    where: {
      status: 'active',
      end_date: LessThan(new Date())
    }
  });

  for (const subscription of expiredSubscriptions) {
    await this.subscriptionRepository.update(subscription.id, {
      status: 'expired'
    });
    
    // Enviar notificação para o usuário
    await this.notificationService.sendExpirationNotification(subscription.user_id);
  }
}
```

## 🛡️ Validações e Segurança

### Validações Implementadas
- ✅ Apenas uma subscription ativa por usuário
- ✅ Tipos de plano válidos (free, monthly, yearly)
- ✅ Status válidos (active, pending, expired, canceled)
- ✅ Verificação de limites antes de criar recursos
- ✅ Incremento automático de contadores

### Próximos Passos Recomendados
1. **Autenticação**: Proteger endpoints sensíveis com JWT
2. **Autorização**: Verificar se usuário pode acessar/modificar subscription
3. **Auditoria**: Log de todas as operações de subscription
4. **Backup**: Backup automático da tabela subscriptions
5. **Métricas**: Dashboard para monitorar uso dos planos

## 📈 Métricas e Analytics

### Dados Disponíveis
- Total de subscriptions por plano
- Uso médio de quizzes e leads
- Taxa de renovação
- Revenue por período
- Usuários próximos do limite

### Queries Úteis
```sql
-- Subscriptions por plano
SELECT plan_type, COUNT(*) as total, 
       AVG(quizzes_used) as avg_quizzes_used,
       AVG(leads_used) as avg_leads_used
FROM subscriptions 
WHERE status = 'active' 
GROUP BY plan_type;

-- Usuários próximos do limite
SELECT user_id, plan_type, quizzes_used, quizzes_limit,
       (quizzes_used / quizzes_limit * 100) as usage_percentage
FROM subscriptions 
WHERE status = 'active' 
  AND (quizzes_used / quizzes_limit) > 0.8;
```

## 🎯 Casos de Uso Comuns

### 1. Usuário Novo
1. Usuário se registra → Plano Free automaticamente
2. Pode criar até 50 quizzes e receber 10.000 leads
3. Recebe notificação quando próximo do limite

### 2. Upgrade para Plano Pago
1. Usuário escolhe plano Monthly/Yearly
2. Sistema cria nova subscription
3. Limites são automaticamente atualizados
4. Contadores são resetados

### 3. Renovação
1. Sistema verifica subscription expirada
2. Processa pagamento automaticamente
3. Renova subscription e reseta contadores
4. Envia confirmação por email

### 4. Cancelamento
1. Usuário cancela subscription
2. Status muda para 'canceled'
3. Acesso continua até o fim do período
4. Não renova automaticamente

---

## 📞 Suporte

Para dúvidas sobre o sistema de subscriptions, consulte:
- 📖 Documentação Swagger: `http://localhost:3000/api`
- 🧪 Scripts de teste: `test-subscriptions.js`
- 📊 Logs do sistema para debugging 