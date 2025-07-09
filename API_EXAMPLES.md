# Exemplos de Uso da API Quiz Builder

Este arquivo contém exemplos práticos de como usar os endpoints da API.

## 🔐 Autenticação

### 1. Registrar um novo usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "phone": "+5511999999999"
  }'
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+5511999999999",
    "role": "owner"
  },
  "token": "jwt-token-aqui"
}
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123"
  }'
```

### 3. Obter dados do usuário atual
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

## 📁 Projetos

### 1. Criar um novo projeto
```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meu Projeto de Quiz",
    "domain": "meusite.com",
    "logo": "https://exemplo.com/logo.png",
    "settings": {
      "theme": "dark",
      "language": "pt-BR"
    }
  }'
```

### 2. Listar projetos do usuário
```bash
curl -X GET http://localhost:3000/projects \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 3. Obter projeto específico
```bash
curl -X GET http://localhost:3000/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 4. Atualizar projeto
```bash
curl -X PATCH http://localhost:3000/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome do Projeto",
    "settings": {
      "theme": "light",
      "language": "en-US"
    }
  }'
```

### 5. Deletar projeto
```bash
curl -X DELETE http://localhost:3000/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

## 🎯 Quizzes

### 1. Criar um novo quiz
```bash
curl -X POST http://localhost:3000/projects/PROJECT_ID/quizzes \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quiz sobre Tecnologia",
    "status": "draft",
    "quiz_json": {
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "Qual é a linguagem de programação mais popular?",
          "options": ["JavaScript", "Python", "Java", "C++"],
          "correct_answer": 0
        },
        {
          "id": "q2",
          "type": "text",
          "question": "Descreva sua experiência com programação:",
          "required": true
        }
      ],
      "settings": {
        "time_limit": 300,
        "show_results": true
      }
    },
    "settings": {
      "theme": "default",
      "allow_anonymous": true
    }
  }'
```

### 2. Listar quizzes de um projeto
```bash
curl -X GET http://localhost:3000/projects/PROJECT_ID/quizzes \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 3. Obter quiz específico
```bash
curl -X GET http://localhost:3000/quizzes/QUIZ_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 4. Atualizar quiz
```bash
curl -X PATCH http://localhost:3000/quizzes/QUIZ_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quiz Atualizado",
    "quiz_json": {
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "Nova pergunta?",
          "options": ["Opção A", "Opção B", "Opção C"],
          "correct_answer": 1
        }
      ]
    }
  }'
```

### 5. Publicar quiz
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/publish \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 6. Despublicar quiz
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/unpublish \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 7. Arquivar quiz
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/archive \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 8. Deletar quiz
```bash
curl -X DELETE http://localhost:3000/quizzes/QUIZ_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

## 📝 Leads (Respostas)

### 1. Enviar respostas do quiz (endpoint público)
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "respondente@exemplo.com",
    "name": "Maria Silva",
    "phone": "+5511888888888",
    "custom_fields": {
      "idade": "25",
      "cidade": "São Paulo"
    },
    "responses": {
      "q1": 0,
      "q2": "Tenho 2 anos de experiência com JavaScript e Python"
    },
    "source": "website"
  }'
```

### 2. Listar leads de um quiz (autenticado)
```bash
curl -X GET http://localhost:3000/quizzes/QUIZ_ID/leads \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 3. Listar leads de um projeto (autenticado)
```bash
curl -X GET http://localhost:3000/quizzes/project/PROJECT_ID/leads \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

## 📊 Estatísticas

### 1. Estatísticas do usuário
```bash
curl -X GET http://localhost:3000/stats/user \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

**Resposta:**
```json
{
  "total_projects": 3,
  "total_quizzes": 15,
  "total_leads": 245
}
```

### 2. Estatísticas de um projeto
```bash
curl -X GET http://localhost:3000/stats/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

**Resposta:**
```json
{
  "project_id": "uuid-do-projeto",
  "total_quizzes": 5,
  "published_quizzes": 3,
  "total_leads": 120,
  "recent_leads": 10
}
```

### 3. Estatísticas de um quiz
```bash
curl -X GET http://localhost:3000/stats/quizzes/QUIZ_ID \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

**Resposta:**
```json
{
  "quiz_id": "uuid-do-quiz",
  "total_leads": 45,
  "recent_leads": 5,
  "quiz_status": "published",
  "created_at": "2024-01-15T10:30:00Z",
  "published_at": "2024-01-16T14:20:00Z"
}
```

## 🔧 Exemplos com JavaScript/Node.js

### Usando fetch API
```javascript
// Registrar usuário
const registerUser = async () => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'João Silva',
      email: 'joao@exemplo.com',
      password: 'senha123',
      phone: '+5511999999999'
    })
  });
  
  const data = await response.json();
  console.log('Token:', data.token);
  return data;
};

// Criar projeto
const createProject = async (token) => {
  const response = await fetch('http://localhost:3000/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Meu Projeto',
      domain: 'meusite.com'
    })
  });
  
  return await response.json();
};
```

### Usando axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de uso
const createQuiz = async (projectId, quizData) => {
  try {
    const response = await api.post(`/projects/${projectId}/quizzes`, quizData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar quiz:', error.response.data);
  }
};
```

## 🐳 Usando Docker

### Iniciar com Docker Compose
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar serviços
docker-compose down
```

### Acessar documentação Swagger
Após iniciar a aplicação, acesse: `http://localhost:3000/api`

## 📝 Notas Importantes

1. **Autenticação**: Todos os endpoints (exceto registro, login e envio de leads) requerem o header `Authorization: Bearer SEU_JWT_TOKEN`

2. **Validação**: Todos os dados de entrada são validados automaticamente

3. **CORS**: Configurado para aceitar requisições de `http://localhost:3000`

4. **Banco de Dados**: Certifique-se de que o PostgreSQL está rodando e configurado corretamente

5. **Variáveis de Ambiente**: Configure o arquivo `.env` antes de executar a aplicação 