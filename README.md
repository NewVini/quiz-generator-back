# Quiz Builder Backend

Backend completo para um sistema de Quiz Builder desenvolvido com Node.js e NestJS.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de registro e login
- **Gestão de Projetos**: CRUD de projetos vinculados ao usuário
- **Criação de Quizzes**: Sistema flexível para criar e editar quizzes em JSON
- **Publicação de Quizzes**: Controle de status (draft, published, archived)
- **Captura de Leads**: Endpoint público para receber respostas de quizzes
- **Estatísticas**: Dados agregados de quizzes, projetos e leads
- **Documentação Swagger**: API documentada automaticamente

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd quiz-generator-back
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_DATABASE=quiz_builder

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

4. **Configure o banco de dados**
```bash
# Opção 1: Execute o script SQL diretamente
mysql -u root -p < scripts/create-tables.sql

# Opção 2: Use o MySQL Workbench ou phpMyAdmin
# Execute o conteúdo do arquivo scripts/create-tables.sql
```

5. **Execute as migrações (desenvolvimento)**
```bash
npm run start:dev
```

## 🏃‍♂️ Executando a aplicação

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/api`

## 🔌 Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Obter dados do usuário atual

### Projetos
- `GET /projects` - Listar projetos do usuário
- `POST /projects` - Criar novo projeto
- `GET /projects/:id` - Obter projeto específico
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Deletar projeto

### Quizzes
- `GET /projects/:projectId/quizzes` - Listar quizzes do projeto
- `POST /projects/:projectId/quizzes` - Criar novo quiz
- `GET /quizzes/:id` - Obter quiz específico
- `PUT /quizzes/:id` - Atualizar quiz
- `DELETE /quizzes/:id` - Deletar quiz
- `POST /quizzes/:id/publish` - Publicar quiz
- `POST /quizzes/:id/unpublish` - Despublicar quiz
- `POST /quizzes/:id/archive` - Arquivar quiz

### Leads (Respostas)
- `POST /quizzes/:quizId/leads` - Enviar respostas do quiz (público)
- `GET /quizzes/:quizId/leads` - Listar leads do quiz (autenticado)
- `GET /quizzes/project/:projectId/leads` - Listar leads do projeto (autenticado)

### Estatísticas
- `GET /stats/user` - Estatísticas do usuário
- `GET /stats/projects/:projectId` - Estatísticas do projeto
- `GET /stats/quizzes/:quizId` - Estatísticas do quiz

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### Users
- `id` (UUID, PK)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `phone` (VARCHAR, nullable)
- `password_hash` (VARCHAR)
- `role` (ENUM: owner, admin, editor, viewer)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Projects
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `name` (VARCHAR)
- `domain` (VARCHAR, nullable)
- `logo` (VARCHAR, nullable)
- `settings` (JSONB, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Quizzes
- `id` (UUID, PK)
- `project_id` (UUID, FK)
- `name` (VARCHAR)
- `status` (ENUM: draft, published, archived)
- `quiz_json` (JSONB)
- `settings` (JSONB, nullable)
- `lead_count` (INTEGER, default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `published_at` (TIMESTAMP, nullable)

#### Leads
- `id` (UUID, PK)
- `quiz_id` (UUID, FK)
- `project_id` (UUID, FK)
- `email` (VARCHAR, nullable)
- `name` (VARCHAR, nullable)
- `phone` (VARCHAR, nullable)
- `custom_fields` (JSONB, nullable)
- `responses` (JSONB)
- `source` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)

## 🔒 Segurança

- Autenticação JWT para endpoints protegidos
- Validação de dados com class-validator
- Hash de senhas com bcryptjs
- CORS configurado para integração com frontend
- Verificação de propriedade de recursos

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📦 Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento com hot reload
- `npm run start:debug` - Inicia em modo debug
- `npm run start:prod` - Inicia em modo produção
- `npm run build` - Compila a aplicação
- `npm run test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:cov` - Executa testes com cobertura
- `npm run test:debug` - Executa testes em modo debug
- `npm run test:e2e` - Executa testes e2e

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.
