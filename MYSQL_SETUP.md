# 🗄️ Configuração MySQL - Quiz Builder

## 📋 Pré-requisitos

- MySQL 5.7 ou superior
- Node.js 16 ou superior
- npm ou yarn

## 🚀 Configuração Rápida

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp env.example .env
```

O arquivo `.env` deve conter:
```env
DATABASE_URL="mysql://root:@localhost:3306/quizzes?sslmode=DISABLED&charset=utf8mb4"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. **Criar Banco de Dados e Tabelas**

#### Opção A: Script Automático (Recomendado)
```bash
# Linux/macOS
chmod +x scripts/start.sh
./scripts/start.sh

# Windows
scripts\start.bat
```

#### Opção B: Manual
```bash
# Conectar ao MySQL
mysql -u root -p

# Executar script SQL
source scripts/create-tables.sql
```

#### Opção C: Linha de Comando
```bash
mysql -u root -p < scripts/create-tables.sql
```

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:
- `users` - Usuários do sistema
- `projects` - Projetos dos usuários
- `quizzes` - Quizzes dos projetos
- `leads` - Respostas dos quizzes

### Dados de Exemplo:
O script inclui dados de exemplo:
- 2 usuários (João e Maria)
- 2 projetos (Tech e Marketing)
- 2 quizzes (JavaScript e Marketing Digital)

## 🔧 Configurações MySQL

### Configurações Recomendadas
```sql
-- Configurar charset global
SET GLOBAL character_set_server = utf8mb4;
SET GLOBAL collation_server = utf8mb4_unicode_ci;

-- Verificar configurações
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

### Configuração do my.cnf (Linux/macOS)
```ini
[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-storage-engine = InnoDB
innodb_buffer_pool_size = 256M
```

## 🚀 Executar a Aplicação

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Verificar Status
```bash
# Verificar se a aplicação está rodando
curl http://localhost:3000

# Acessar documentação Swagger
# http://localhost:3000/api
```

## 🔍 Troubleshooting

### Erro de Conexão MySQL
```bash
# Verificar se o MySQL está rodando
sudo service mysql status  # Linux
brew services list | grep mysql  # macOS
net start mysql  # Windows

# Iniciar MySQL se necessário
sudo service mysql start  # Linux
brew services start mysql  # macOS
net start mysql  # Windows
```

### Erro de Permissão
```bash
# Criar usuário MySQL se necessário
mysql -u root -p
CREATE USER 'quizuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON quizzes.* TO 'quizuser'@'localhost';
FLUSH PRIVILEGES;
```

### Erro de Charset
```sql
-- Verificar charset das tabelas
SHOW TABLE STATUS FROM quizzes;

-- Alterar charset se necessário
ALTER DATABASE quizzes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📈 Monitoramento

### Verificar Tabelas
```sql
USE quizzes;
SHOW TABLES;
DESCRIBE users;
DESCRIBE projects;
DESCRIBE quizzes;
DESCRIBE leads;
```

### Verificar Dados
```sql
-- Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM quizzes;
SELECT COUNT(*) FROM leads;

-- Ver dados de exemplo
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM quizzes;
```

### Logs da Aplicação
```bash
# Ver logs em tempo real
npm run start:dev

# Logs de erro
tail -f logs/error.log
```

## 🔒 Segurança

### Configurações Recomendadas
1. **Alterar senha do root**
2. **Criar usuário específico para a aplicação**
3. **Configurar firewall**
4. **Usar SSL em produção**

### Exemplo de Usuário Seguro
```sql
CREATE USER 'quizapp'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON quizzes.* TO 'quizapp'@'localhost';
FLUSH PRIVILEGES;
```

## 📚 Recursos Adicionais

- [Documentação MySQL](https://dev.mysql.com/doc/)
- [TypeORM MySQL](https://typeorm.io/#/mysql)
- [NestJS Database](https://docs.nestjs.com/techniques/database)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs da aplicação
2. Verifique a conexão com MySQL
3. Confirme as configurações do `.env`
4. Verifique se todas as dependências estão instaladas 