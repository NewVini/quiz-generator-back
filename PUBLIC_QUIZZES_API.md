# API de Quizzes Públicos

Esta documentação descreve os endpoints públicos para acessar quizzes publicados sem necessidade de autenticação.

## Visão Geral

Os endpoints públicos permitem que aplicações frontend ou sistemas externos acessem quizzes que foram publicados pelos usuários, sem necessidade de token de autenticação. Isso é útil para:

- Embedding de quizzes em sites externos
- Aplicações frontend que precisam exibir quizzes
- Integração com sistemas de terceiros

## Endpoints Disponíveis

### 1. Listar Quizzes por Projeto

**GET** `/quizzes?projectId={projectId}`

Retorna todos os quizzes publicados de um projeto específico.

#### Parâmetros de Query

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `projectId` | string (UUID) | Sim | ID único do projeto |

#### Exemplo de Requisição

```bash
curl -X GET "http://localhost:3000/quizzes?projectId=123e4567-e89b-12d3-a456-426614174000"
```

#### Exemplo de Resposta

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Quiz de Matemática Básica",
    "status": "published",
    "quiz_json": {
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice",
          "question": "Qual é o resultado de 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correct_answer": 1,
          "points": 10
        }
      ],
      "settings": {
        "time_limit": 30,
        "shuffle_questions": true
      }
    },
    "settings": {
      "theme": "default",
      "show_results": true,
      "allow_retry": false
    },
    "published_at": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-10T14:20:00.000Z",
    "project": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Escola Online",
      "domain": "escolaonline.com",
      "logo": "https://example.com/logo.png"
    }
  }
]
```

### 2. Obter Quiz Específico (Apenas Publicados)

**GET** `/quizzes/{id}`

Retorna um quiz específico pelo seu ID (apenas quizzes publicados).

### 3. Obter Qualquer Quiz por ID (Para Leads)

**GET** `/quizzes/{id}/public`

Retorna qualquer quiz pelo seu ID, independente do status. Esta rota é específica para leads acessarem qualquer quiz que queiram fazer.

#### Parâmetros de Path

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string (UUID) | Sim | ID único do quiz |

#### Exemplo de Requisição

```bash
curl -X GET "http://localhost:3000/quizzes/550e8400-e29b-41d4-a716-446655440000"
```

#### Exemplo de Resposta

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Quiz de Matemática Básica",
  "status": "published",
  "quiz_json": {
    "questions": [
      {
        "id": 1,
        "type": "multiple_choice",
        "question": "Qual é o resultado de 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct_answer": 1,
        "points": 10
      },
      {
        "id": 2,
        "type": "true_false",
        "question": "A Terra é plana?",
        "correct_answer": false,
        "points": 5
      }
    ],
    "settings": {
      "time_limit": 30,
      "shuffle_questions": true,
      "show_progress": true
    }
  },
  "settings": {
    "theme": "default",
    "show_results": true,
    "allow_retry": false,
    "background_color": "#ffffff",
    "text_color": "#000000"
  },
  "published_at": "2024-01-15T10:30:00.000Z",
  "created_at": "2024-01-10T14:20:00.000Z",
  "project": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Escola Online",
    "domain": "escolaonline.com",
    "logo": "https://example.com/logo.png"
  }
}
```

#### Exemplo de Requisição (Nova Rota)

```bash
curl -X GET "http://localhost:3000/quizzes/5f3e5a33-f22a-4a25-a9ec-2da98355d87f/public"
```

#### Exemplo de Resposta (Nova Rota)

```json
{
  "id": "5f3e5a33-f22a-4a25-a9ec-2da98355d87f",
  "name": "Quiz de Conhecimentos Gerais",
  "status": "draft",
  "quiz_json": {
    "questions": [
      {
        "id": 1,
        "type": "multiple_choice",
        "question": "Qual é a capital do Brasil?",
        "options": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
        "correct_answer": 2,
        "points": 10
      },
      {
        "id": 2,
        "type": "true_false",
        "question": "O Brasil é o maior país da América do Sul?",
        "correct_answer": true,
        "points": 5
      }
    ],
    "settings": {
      "time_limit": 45,
      "shuffle_questions": true,
      "show_progress": true
    }
  },
  "settings": {
    "theme": "modern",
    "show_results": true,
    "allow_retry": true,
    "background_color": "#f8f9fa",
    "text_color": "#212529"
  },
  "published_at": null,
  "created_at": "2024-01-10T14:20:00.000Z",
  "project": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Empresa XYZ",
    "domain": "empresaxyz.com",
    "logo": "https://empresaxyz.com/logo.png"
  }
}
```

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso - Quiz(s) retornado(s) com sucesso |
| 400 | Bad Request - ID inválido ou formato incorreto |
| 404 | Not Found - Quiz não encontrado ou não publicado |
| 500 | Internal Server Error - Erro interno do servidor |

## Estrutura dos Dados

### Quiz JSON

O campo `quiz_json` contém a estrutura completa do quiz:

```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Pergunta do quiz",
      "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
      "correct_answer": 1,
      "points": 10
    }
  ],
  "settings": {
    "time_limit": 30,
    "shuffle_questions": true,
    "show_progress": true
  }
}
```

### Configurações do Quiz

O campo `settings` contém configurações visuais e comportamentais:

```json
{
  "theme": "default",
  "show_results": true,
  "allow_retry": false,
  "background_color": "#ffffff",
  "text_color": "#000000"
}
```

## Diferenças Entre as Rotas

### `/quizzes/{id}` vs `/quizzes/{id}/public`

| Aspecto | `/quizzes/{id}` | `/quizzes/{id}/public` |
|---------|-----------------|------------------------|
| **Acesso** | Apenas quizzes publicados | Qualquer quiz (draft, published, archived) |
| **Uso** | Para exibição pública de quizzes finalizados | Para leads acessarem qualquer quiz |
| **Segurança** | Mais restritivo | Menos restritivo |
| **Caso de Uso** | Sites públicos, embeds | Links diretos para leads |

## Limitações e Segurança

1. **Rota `/quizzes/{id}`**: Apenas quizzes com status "published" são acessíveis
2. **Rota `/quizzes/{id}/public`**: Qualquer quiz é acessível, independente do status
3. **Dados Públicos**: Não são retornados dados sensíveis como IDs de usuário ou informações internas
4. **Rate Limiting**: Considere implementar rate limiting para evitar abuso
5. **CORS**: Configure adequadamente o CORS para permitir acesso do frontend

## Exemplos de Uso no Frontend

### React/TypeScript

```typescript
interface PublicQuiz {
  id: string;
  name: string;
  status: string;
  quiz_json: any;
  settings?: any;
  published_at?: Date;
  created_at: Date;
  project: {
    id: string;
    name: string;
    domain?: string;
    logo?: string;
  };
}

// Buscar quiz específico (apenas publicados)
const fetchQuiz = async (quizId: string): Promise<PublicQuiz> => {
  const response = await fetch(`http://localhost:3000/quizzes/${quizId}`);
  if (!response.ok) {
    throw new Error('Quiz não encontrado');
  }
  return response.json();
};

// Buscar qualquer quiz (para leads)
const fetchAnyQuiz = async (quizId: string): Promise<PublicQuiz> => {
  const response = await fetch(`http://localhost:3000/quizzes/${quizId}/public`);
  if (!response.ok) {
    throw new Error('Quiz não encontrado');
  }
  return response.json();
};

// Buscar quizzes por projeto
const fetchQuizzesByProject = async (projectId: string): Promise<PublicQuiz[]> => {
  const response = await fetch(`http://localhost:3000/quizzes?projectId=${projectId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar quizzes');
  }
  return response.json();
};
```

### JavaScript

```javascript
// Buscar quiz específico (apenas publicados)
async function fetchQuiz(quizId) {
  try {
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}`);
    if (!response.ok) {
      throw new Error('Quiz não encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    throw error;
  }
}

// Buscar qualquer quiz (para leads)
async function fetchAnyQuiz(quizId) {
  try {
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}/public`);
    if (!response.ok) {
      throw new Error('Quiz não encontrado');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    throw error;
  }
}

// Buscar quizzes por projeto
async function fetchQuizzesByProject(projectId) {
  try {
    const response = await fetch(`http://localhost:3000/quizzes?projectId=${projectId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error);
    throw error;
  }
}
```

## Notas Importantes

1. **Cache**: Considere implementar cache no frontend para melhorar a performance
2. **Error Handling**: Sempre trate os erros adequadamente no frontend
3. **Loading States**: Implemente estados de carregamento para melhor UX
4. **Fallbacks**: Forneça fallbacks para casos onde o quiz não está disponível 