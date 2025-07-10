# 🚀 Guia Completo de Integração Frontend-Backend Quiz Generator

## 📋 Visão Geral
Este guia instrui como integrar o frontend React existente com o backend NestJS, substituindo dados mock por chamadas reais à API.

## 🔧 Configuração Inicial

### 1. Configuração de Ambiente
```typescript
// src/lib/config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  PROJECTS: '/projects',
  QUIZZES: '/quizzes',
  LEADS: '/leads',
  STATS: '/stats',
} as const;
```

### 2. Cliente HTTP
```typescript
// src/lib/api-client.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth-storage') 
        ? JSON.parse(localStorage.getItem('auth-storage')!).state.token 
        : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  async get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url);
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data);
  }

  async patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
```

### 3. Variáveis de Ambiente
```env
# .env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Quiz Generator
```

## 🔐 Sistema de Autenticação

### Atualizar Auth Store (Zustand)
```typescript
// src/lib/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from './api-client';
import { ENDPOINTS } from './config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
          });
          
          const { user, token } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          apiClient.setAuthToken(token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Erro no login',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        apiClient.clearAuthToken();
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
          const { user, token } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          apiClient.setAuthToken(token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Erro no registro',
          });
          throw error;
        }
      },

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const response = await apiClient.get(ENDPOINTS.AUTH.ME);
          set({ user: response.data });
        } catch (error) {
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
```

### Atualizar LoginPage
```typescript
// src/pages/auth/LoginPage.tsx
import { useAuthStore } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      // Redirecionar para dashboard
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.response?.data?.message || "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  // ... resto do componente
}
```

## 📁 Gerenciamento de Projetos

### 1. Endpoint: `GET /projects`
**O que faz:** Lista todos os projetos do usuário autenticado
**Integração no Frontend:**

```typescript
// src/lib/projects.ts
import { apiClient } from './api-client';

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  async update(id: string, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};
```

### 2. Atualizar ProjectsPage
```typescript
// src/pages/projects/ProjectsPage.tsx
import { useEffect, useState } from 'react';
import { projectsApi } from '@/lib/projects';
import { useToast } from '@/hooks/use-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar projetos",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: CreateProjectDto) => {
    try {
      const newProject = await projectsApi.create(data);
      setProjects(prev => [...prev, newProject]);
      toast({
        title: "Projeto criado!",
        description: "Projeto criado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  // ... resto do componente
}
```

## 🎯 Gerenciamento de Quizzes

### 1. Endpoint: `GET /projects/:projectId/quizzes`
**O que faz:** Lista todos os quizzes de um projeto específico
**Integração:**

```typescript
// src/lib/quizzes.ts
export const quizzesApi = {
  async getByProject(projectId: string): Promise<Quiz[]> {
    const response = await apiClient.get<Quiz[]>(`/projects/${projectId}/quizzes`);
    return response.data;
  },

  async getById(id: string): Promise<Quiz> {
    const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },

  async create(projectId: string, data: CreateQuizDto): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(`/projects/${projectId}/quizzes`, data);
    return response.data;
  },

  async update(id: string, data: UpdateQuizDto): Promise<Quiz> {
    const response = await apiClient.patch<Quiz>(`/quizzes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/quizzes/${id}`);
  },

  async publish(id: string): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(`/quizzes/${id}/publish`);
    return response.data;
  },

  async unpublish(id: string): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(`/quizzes/${id}/unpublish`);
    return response.data;
  },

  async archive(id: string): Promise<Quiz> {
    const response = await apiClient.post<Quiz>(`/quizzes/${id}/archive`);
    return response.data;
  },
};
```

### 2. Atualizar QuizBuilderPage
```typescript
// src/pages/quiz/QuizBuilderPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { quizzesApi } from '@/lib/quizzes';
import { useToast } from '@/hooks/use-toast';

export default function QuizBuilderPage() {
  const { projectId, quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const data = await quizzesApi.getById(quizId!);
      setQuiz(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar quiz",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (quizData: UpdateQuizDto) => {
    try {
      if (quizId) {
        const updatedQuiz = await quizzesApi.update(quizId, quizData);
        setQuiz(updatedQuiz);
        toast({
          title: "Quiz salvo!",
          description: "Alterações salvas com sucesso",
        });
      } else if (projectId) {
        const newQuiz = await quizzesApi.create(projectId, quizData);
        setQuiz(newQuiz);
        toast({
          title: "Quiz criado!",
          description: "Quiz criado com sucesso",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar quiz",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    if (!quizId) return;
    
    try {
      const publishedQuiz = await quizzesApi.publish(quizId);
      setQuiz(publishedQuiz);
      toast({
        title: "Quiz publicado!",
        description: "Quiz está agora disponível publicamente",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao publicar quiz",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  // ... resto do componente
}
```

## 📝 Captura de Leads

### 1. Endpoint: `POST /quizzes/:quizId/leads`
**O que faz:** Endpoint público para enviar respostas de quiz e capturar leads
**Integração:**

```typescript
// src/lib/leads.ts
export const leadsApi = {
  async submitQuizResponse(quizId: string, data: CreateLeadDto): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/quizzes/${quizId}/leads`, data);
    return response.data;
  },

  async getByQuiz(quizId: string): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>(`/quizzes/${quizId}/leads`);
    return response.data;
  },

  async getByProject(projectId: string): Promise<Lead[]> {
    const response = await apiClient.get<Lead[]>(`/quizzes/project/${projectId}/leads`);
    return response.data;
  },
};
```

### 2. Componente de Submissão Pública
```typescript
// src/components/quiz/QuizSubmission.tsx
import { useState } from 'react';
import { leadsApi } from '@/lib/leads';

interface QuizSubmissionProps {
  quizId: string;
  quizData: Quiz;
}

export default function QuizSubmission({ quizId, quizData }: QuizSubmissionProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const leadData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        custom_fields: formData.customFields,
        responses: responses,
        source: 'website',
      };

      await leadsApi.submitQuizResponse(quizId, leadData);
      
      // Mostrar sucesso ou redirecionar
    } catch (error: any) {
      console.error('Erro ao enviar respostas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... resto do componente
}
```

## 📊 Estatísticas

### 1. Endpoint: `GET /stats/user`
**O que faz:** Retorna estatísticas gerais do usuário
**Integração:**

```typescript
// src/lib/stats.ts
export const statsApi = {
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>('/stats/user');
    return response.data;
  },

  async getProjectStats(projectId: string): Promise<ProjectStats> {
    const response = await apiClient.get<ProjectStats>(`/stats/projects/${projectId}`);
    return response.data;
  },

  async getQuizStats(quizId: string): Promise<QuizStats> {
    const response = await apiClient.get<QuizStats>(`/stats/quizzes/${quizId}`);
    return response.data;
  },
};
```

### 2. Atualizar DashboardPage
```typescript
// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { statsApi } from '@/lib/stats';
import { projectsApi } from '@/lib/projects';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [stats, projects] = await Promise.all([
        statsApi.getUserStats(),
        projectsApi.getAll(),
      ]);
      
      setUserStats(stats);
      setRecentProjects(projects.slice(0, 5)); // Últimos 5 projetos
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dashboard",
        description: error.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto do componente
}
```

## 🔄 Atualizar Tipos TypeScript

```typescript
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  domain?: string;
  logo?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  project_id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
  quiz_json: Record<string, any>;
  settings?: Record<string, any>;
  lead_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Lead {
  id: string;
  quiz_id: string;
  project_id: string;
  email?: string;
  name?: string;
  phone?: string;
  custom_fields?: Record<string, any>;
  responses: Record<string, any>;
  source?: string;
  created_at: string;
}

export interface UserStats {
  total_leads: number;
  total_quizzes: number;
  total_projects: number;
  average_ctr: number;
  leads_by_day: Array<{ date: string; count: number }>;
  conversion_funnel: Array<{ stage: string; count: number }>;
}

export interface ProjectStats {
  project_id: string;
  total_leads: number;
  total_quizzes: number;
  average_ctr: number;
  leads_by_quiz: Array<{ quiz_id: string; quiz_name: string; count: number }>;
}

export interface QuizStats {
  quiz_id: string;
  total_leads: number;
  completion_rate: number;
  average_time: number;
  leads_by_day: Array<{ date: string; count: number }>;
}

// DTOs para criação/atualização
export interface CreateProjectDto {
  name: string;
  domain?: string;
  logo?: string;
  settings?: Record<string, any>;
}

export interface UpdateProjectDto {
  name?: string;
  domain?: string;
  logo?: string;
  settings?: Record<string, any>;
}

export interface CreateQuizDto {
  name: string;
  status?: 'draft' | 'published' | 'archived';
  quiz_json: Record<string, any>;
  settings?: Record<string, any>;
}

export interface UpdateQuizDto {
  name?: string;
  status?: 'draft' | 'published' | 'archived';
  quiz_json?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface CreateLeadDto {
  email?: string;
  name?: string;
  phone?: string;
  custom_fields?: Record<string, any>;
  responses: Record<string, any>;
  source?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
```

## 🎯 Mapeamento de Endpoints por Funcionalidade

### Autenticação
- `POST /auth/login` → LoginPage.tsx
- `POST /auth/register` → RegisterPage.tsx (se existir)
- `GET /auth/me` → AppShell.tsx (verificar usuário)

### Dashboard
- `GET /stats/user` → DashboardPage.tsx
- `GET /projects` → DashboardPage.tsx (projetos recentes)

### Projetos
- `GET /projects` → ProjectsPage.tsx
- `POST /projects` → CreateProjectDialog.tsx
- `GET /projects/:id` → ProjectDetailPage.tsx
- `PATCH /projects/:id` → ProjectSettingsTab.tsx
- `DELETE /projects/:id` → ProjectDetailPage.tsx

### Quizzes
- `GET /projects/:projectId/quizzes` → QuizzesTab.tsx
- `POST /projects/:projectId/quizzes` → QuizBuilderPage.tsx
- `GET /quizzes/:id` → QuizBuilderPage.tsx
- `PATCH /quizzes/:id` → QuizBuilderPage.tsx (auto-save)
- `DELETE /quizzes/:id` → QuizzesTab.tsx
- `POST /quizzes/:id/publish` → QuizBuilderPage.tsx
- `POST /quizzes/:id/unpublish` → QuizBuilderPage.tsx
- `POST /quizzes/:id/archive` → QuizBuilderPage.tsx

### Leads
- `POST /quizzes/:quizId/leads` → QuizSubmission.tsx (público)
- `GET /quizzes/:quizId/leads` → LeadsTab.tsx
- `GET /quizzes/project/:projectId/leads` → LeadsTab.tsx

### Estatísticas
- `GET /stats/user` → DashboardPage.tsx
- `GET /stats/projects/:projectId` → ProjectDetailPage.tsx
- `GET /stats/quizzes/:quizId` → QuizStatsPage.tsx

## 🔧 Configuração do Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

## 🚀 Passos de Implementação

1. **Configurar ambiente** - Criar arquivos de configuração
2. **Implementar cliente HTTP** - Criar api-client.ts
3. **Atualizar autenticação** - Modificar auth.ts e LoginPage
4. **Integrar projetos** - Atualizar ProjectsPage e componentes relacionados
5. **Integrar quizzes** - Atualizar QuizBuilderPage e QuizzesTab
6. **Integrar leads** - Atualizar LeadsTab e criar QuizSubmission
7. **Integrar estatísticas** - Atualizar DashboardPage e QuizStatsPage
8. **Testar integração** - Verificar todos os fluxos

## 🎯 Credenciais de Teste

```bash
# Usuário Owner
Email: joao@exemplo.com
Senha: senha123

# Usuário Admin
Email: maria@exemplo.com
Senha: senha123
```

## 📝 Notas Importantes

- **Auto-save**: Implementar debounce para salvar quiz a cada 2 segundos
- **Tratamento de erros**: Usar toast para feedback do usuário
- **Loading states**: Mostrar spinners durante carregamento
- **Validação**: Manter validação do frontend + backend
- **CORS**: Backend já configurado para localhost:5173
- **JWT**: Token é automaticamente incluído nas requisições

Este guia fornece uma integração completa mantendo toda a estrutura existente do frontend! 