# Scripts SQL para Criação de Tabelas

Este arquivo contém os scripts SQL para criar as tabelas `subscriptions` e `billings` no banco de dados MySQL.

## Tabela Subscriptions

A tabela `subscriptions` armazena informações sobre os planos de assinatura dos usuários.

```sql
CREATE TABLE `subscriptions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `plan_type` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `next_billing` date NOT NULL,
  `quizzes_limit` int NOT NULL DEFAULT '50',
  `leads_limit` int NOT NULL DEFAULT '10000',
  `quizzes_used` int NOT NULL DEFAULT '0',
  `leads_used` int NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Campos da tabela subscriptions:

- `id`: UUID único da subscription
- `user_id`: ID do usuário que possui a subscription
- `plan_type`: Tipo do plano (free, monthly, yearly)
- `status`: Status da subscription (active, pending, expired, canceled)
- `start_date`: Data de início da subscription
- `end_date`: Data de fim da subscription
- `next_billing`: Próxima data de cobrança
- `quizzes_limit`: Limite de quizzes permitidos
- `leads_limit`: Limite de leads permitidos
- `quizzes_used`: Quantidade de quizzes já utilizados
- `leads_used`: Quantidade de leads já utilizados
- `price`: Preço da subscription
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

## Tabela Billings

A tabela `billings` armazena informações sobre as cobranças e pagamentos das subscriptions.

```sql
CREATE TABLE `billings` (
  `id` varchar(36) NOT NULL,
  `subscription_id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'BRL',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) NULL,
  `payment_gateway` varchar(50) NULL,
  `gateway_transaction_id` varchar(255) NULL,
  `billing_date` date NOT NULL,
  `due_date` date NOT NULL,
  `paid_at` datetime NULL,
  `description` text NULL,
  `metadata` json NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_billings_subscription_id` (`subscription_id`),
  INDEX `IDX_billings_user_id` (`user_id`),
  INDEX `IDX_billings_status` (`status`),
  INDEX `IDX_billings_billing_date` (`billing_date`),
  CONSTRAINT `FK_billings_subscription_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Campos da tabela billings:

- `id`: UUID único da cobrança
- `subscription_id`: ID da subscription relacionada
- `user_id`: ID do usuário
- `amount`: Valor da cobrança
- `currency`: Moeda (padrão: BRL)
- `status`: Status da cobrança (pending, paid, failed, canceled)
- `payment_method`: Método de pagamento
- `payment_gateway`: Gateway de pagamento utilizado
- `gateway_transaction_id`: ID da transação no gateway
- `billing_date`: Data da cobrança
- `due_date`: Data de vencimento
- `paid_at`: Data do pagamento (quando pago)
- `description`: Descrição da cobrança
- `metadata`: Dados adicionais em formato JSON
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

## Como Executar

### Opção 1: Via MySQL CLI

```bash
# Conectar ao banco
mysql -u root -p quizzes2

# Executar os scripts SQL
```

### Opção 2: Via linha de comando

```bash
# Para subscriptions
mysql -u root -p quizzes2 -e "CREATE TABLE \`subscriptions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`plan_type\` varchar(20) NOT NULL, \`status\` varchar(20) NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`next_billing\` date NOT NULL, \`quizzes_limit\` int NOT NULL DEFAULT '50', \`leads_limit\` int NOT NULL DEFAULT '10000', \`quizzes_used\` int NOT NULL DEFAULT '0', \`leads_used\` int NOT NULL DEFAULT '0', \`price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"

# Para billings
mysql -u root -p quizzes2 -e "CREATE TABLE \`billings\` (\`id\` varchar(36) NOT NULL, \`subscription_id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'BRL', \`status\` varchar(20) NOT NULL DEFAULT 'pending', \`payment_method\` varchar(50) NULL, \`payment_gateway\` varchar(50) NULL, \`gateway_transaction_id\` varchar(255) NULL, \`billing_date\` date NOT NULL, \`due_date\` date NOT NULL, \`paid_at\` datetime NULL, \`description\` text NULL, \`metadata\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`), INDEX \`IDX_billings_subscription_id\` (\`subscription_id\`), INDEX \`IDX_billings_user_id\` (\`user_id\`), INDEX \`IDX_billings_status\` (\`status\`), INDEX \`IDX_billings_billing_date\` (\`billing_date\`), CONSTRAINT \`FK_billings_subscription_id\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscriptions\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
```

### Opção 3: Via arquivo SQL

1. Crie um arquivo `create_tables.sql` com os scripts acima
2. Execute:
```bash
mysql -u root -p quizzes2 < create_tables.sql
```

## Ordem de Execução

**IMPORTANTE**: Execute primeiro a tabela `subscriptions` e depois a tabela `billings`, pois a tabela `billings` tem uma foreign key que referencia `subscriptions`.

## Verificação

Para verificar se as tabelas foram criadas corretamente:

```sql
SHOW TABLES LIKE '%subscription%';
SHOW TABLES LIKE '%billing%';
```

Para ver a estrutura das tabelas:

```sql
DESCRIBE subscriptions;
DESCRIBE billings;
``` 