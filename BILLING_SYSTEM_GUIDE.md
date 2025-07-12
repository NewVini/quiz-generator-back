# Sistema de Billing - Guia Completo

## Visão Geral

O sistema de billing foi implementado para gerenciar cobranças e períodos de teste dos usuários. Ele garante que:

1. **Usuários têm 7 dias gratuitos** ao se registrarem
2. **Subscriptions só podem ser criadas** se o usuário tiver um billing PAGO ou estiver em período de teste
3. **Billing está relacionado** com a subscription
4. **Toda subscription tem 7 dias gratuitos** e a cobrança é no 7º dia

## Estrutura do Sistema

### Entidade Billing

```typescript
@Entity('billings')
export class Billing {
  id: string;                    // UUID único
  user_id: string;              // ID do usuário
  subscription_id?: string;     // ID da subscription (opcional)
  billing_type: BillingType;    // subscription, one_time, trial
  status: BillingStatus;        // pending, paid, failed, cancelled, refunded
  amount: number;               // Valor da cobrança
  currency: string;             // Moeda (padrão: BRL)
  payment_method?: string;      // Método de pagamento
  payment_gateway_id?: string;  // ID do gateway de pagamento
  due_date: Date;              // Data de vencimento
  paid_date?: Date;            // Data do pagamento
  trial_start_date?: Date;     // Início do período de teste
  trial_end_date?: Date;       // Fim do período de teste
  is_trial: boolean;           // Se é um período de teste
  description?: string;        // Descrição da cobrança
  failure_reason?: string;     // Motivo da falha (se houver)
}
```

### Tipos de Billing

- **TRIAL**: Período de teste gratuito (7 dias)
- **SUBSCRIPTION**: Cobrança regular de subscription
- **ONE_TIME**: Cobrança única

### Status de Billing

- **PENDING**: Aguardando pagamento
- **PAID**: Pago
- **FAILED**: Falhou
- **CANCELLED**: Cancelado
- **REFUNDED**: Reembolsado

## Fluxo do Sistema

### 1. Registro de Usuário
- Usuário se registra no sistema
- Automaticamente tem direito a 7 dias gratuitos

### 2. Criação de Subscription
- Usuário tenta criar uma subscription
- Sistema verifica se tem billing pago OU está em período de teste
- Se não tiver, cria automaticamente um billing de teste
- Subscription é criada com status "active"

### 3. Período de Teste (7 dias)
- Billing de teste é criado com status "PAID"
- Usuário pode usar todas as funcionalidades
- Sistema monitora a data de expiração

### 4. Após o Período de Teste
- Sistema cria billing de subscription
- Status inicial: "PENDING"
- Vencimento: 7 dias após criação
- Usuário precisa pagar para continuar

### 5. Pagamento
- Billing é marcado como "PAID"
- Subscription permanece ativa
- Próxima cobrança é agendada

## Endpoints da API

### Billing Controller

#### CRUD Básico
- `POST /billings` - Criar billing
- `GET /billings` - Listar todos os billings
- `GET /billings/:id` - Buscar billing por ID
- `PATCH /billings/:id` - Atualizar billing
- `DELETE /billings/:id` - Remover billing

#### Endpoints Específicos
- `GET /billings/my-billings` - Billings do usuário logado
- `GET /billings/subscription/:subscriptionId` - Billings de uma subscription
- `POST /billings/trial/:userId` - Criar billing de teste
- `POST /billings/subscription` - Criar billing de subscription
- `GET /billings/check/paid/:userId` - Verificar se tem billing pago
- `GET /billings/check/trial/:userId` - Verificar se está em período de teste
- `GET /billings/check/can-subscribe/:userId` - Verificar se pode criar subscription
- `POST /billings/:id/mark-paid` - Marcar como pago
- `POST /billings/:id/mark-failed` - Marcar como falhado
- `GET /billings/pending/due-today` - Billings pendentes que vencem hoje
- `GET /billings/trial/expiring-today` - Billings de teste que expiram hoje
- `GET /billings/check/activate-subscription/:subscriptionId` - Verificar se pode ativar subscription

## Integração com Subscriptions

### Validações
- Subscription só pode ser criada se usuário tiver billing pago OU estiver em teste
- Billing de teste é criado automaticamente se necessário
- Billing de subscription é criado após período de teste

### Relacionamentos
- Um usuário pode ter múltiplos billings
- Uma subscription pode ter um billing associado
- Billing de teste não tem subscription_id (opcional)

## Exemplos de Uso

### 1. Criar Billing de Teste
```javascript
POST /billings/trial/user-id-123
{
  "subscriptionId": "sub-456" // opcional
}
```

### 2. Criar Billing de Subscription
```javascript
POST /billings/subscription
{
  "userId": "user-id-123",
  "subscriptionId": "sub-456",
  "amount": 29.90,
  "planType": "monthly"
}
```

### 3. Marcar como Pago
```javascript
POST /billings/billing-id-789/mark-paid
{
  "paymentGatewayId": "pg_123456"
}
```

### 4. Verificar Status
```javascript
GET /billings/check/can-subscribe/user-id-123
// Retorna: true/false
```

## Monitoramento e Relatórios

### Billings Pendentes
- Endpoint para listar billings que vencem hoje
- Útil para processamento automático de cobranças

### Billings de Teste Expirando
- Endpoint para listar testes que expiram hoje
- Permite notificar usuários sobre expiração

### Relatórios
- Billings por status
- Billings por período
- Receita gerada
- Taxa de conversão (teste → pago)

## Configuração e Deploy

### Migration
Execute a migration para criar a tabela:
```bash
npm run migration:run
```

### Variáveis de Ambiente
Não são necessárias variáveis específicas para billing, mas recomenda-se:
- Configurar gateway de pagamento
- Definir webhooks para notificações
- Configurar cron jobs para processamento automático

### Testes
Execute o script de teste:
```bash
node test-billing-system.js
```

## Segurança

### Validações
- Apenas usuários autenticados podem acessar endpoints
- Validação de propriedade (usuário só acessa seus próprios billings)
- Validação de status antes de operações

### Auditoria
- Todos os billings têm timestamps de criação/atualização
- Histórico de mudanças de status
- Logs de tentativas de pagamento

## Próximos Passos

### Melhorias Sugeridas
1. **Integração com Gateway de Pagamento**
   - Stripe, PayPal, PagSeguro
   - Webhooks para notificações
   - Processamento automático

2. **Sistema de Notificações**
   - Email de vencimento
   - Notificação de expiração de teste
   - Confirmação de pagamento

3. **Relatórios Avançados**
   - Dashboard de métricas
   - Análise de conversão
   - Previsão de receita

4. **Automação**
   - Cron jobs para processamento
   - Suspensão automática de subscriptions
   - Renovação automática

5. **Planos e Preços**
   - Múltiplos planos
   - Descontos e promoções
   - Preços dinâmicos

## Troubleshooting

### Problemas Comuns

1. **Subscription não pode ser criada**
   - Verificar se usuário tem billing pago ou está em teste
   - Verificar se não há subscription ativa

2. **Billing não é marcado como pago**
   - Verificar se billing existe
   - Verificar se status atual não é "PAID"

3. **Período de teste não funciona**
   - Verificar datas de início e fim
   - Verificar se billing é do tipo "TRIAL"

### Logs Úteis
- Verificar logs do service de billing
- Monitorar endpoints de verificação
- Verificar relacionamentos entre entidades 