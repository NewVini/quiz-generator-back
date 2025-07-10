-- =====================================================
-- SCHEMA DO BANCO DE DADOS - QUIZ BUILDER
-- =====================================================

-- Criação do banco de dados
CREATE DATABASE quiz_builder;

-- Conectar ao banco
\c quiz_builder;

-- =====================================================
-- ENUMS
-- =====================================================

-- Enum para roles de usuário
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- Enum para status de quiz
CREATE TYPE quiz_status AS ENUM ('draft', 'published', 'archived');

-- =====================================================
-- TABELA: USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para USERS
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- TABELA: PROJECTS
-- =====================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    logo VARCHAR(500),
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para PROJECTS
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_domain ON projects(domain);

-- =====================================================
-- TABELA: QUIZZES
-- =====================================================

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status quiz_status DEFAULT 'draft',
    quiz_json JSONB NOT NULL,
    settings JSONB,
    lead_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Índices para QUIZZES
CREATE INDEX idx_quizzes_project_id ON quizzes(project_id);
CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at);
CREATE INDEX idx_quizzes_published_at ON quizzes(published_at);
CREATE INDEX idx_quizzes_lead_count ON quizzes(lead_count);

-- =====================================================
-- TABELA: LEADS
-- =====================================================

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    email VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(20),
    custom_fields JSONB,
    responses JSONB NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para LEADS
CREATE INDEX idx_leads_quiz_id ON leads(quiz_id);
CREATE INDEX idx_leads_project_id ON leads(project_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_source ON leads(source);

-- =====================================================
-- TRIGGERS E FUNCTIONS
-- =====================================================

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function para incrementar lead_count automaticamente
CREATE OR REPLACE FUNCTION increment_lead_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quizzes 
    SET lead_count = lead_count + 1 
    WHERE id = NEW.quiz_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para incrementar lead_count
CREATE TRIGGER increment_quiz_lead_count AFTER INSERT ON leads
    FOR EACH ROW EXECUTE FUNCTION increment_lead_count();

-- =====================================================
-- VIEWS PARA ESTATÍSTICAS
-- =====================================================

-- View para estatísticas de usuário
CREATE VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT q.id) as total_quizzes,
    COUNT(DISTINCT l.id) as total_leads,
    COUNT(DISTINCT CASE WHEN q.status = 'published' THEN q.id END) as published_quizzes
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN quizzes q ON p.id = q.project_id
LEFT JOIN leads l ON p.id = l.project_id
GROUP BY u.id, u.name;

-- View para estatísticas de projeto
CREATE VIEW project_stats AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.user_id,
    COUNT(DISTINCT q.id) as total_quizzes,
    COUNT(DISTINCT CASE WHEN q.status = 'published' THEN q.id END) as published_quizzes,
    COUNT(DISTINCT l.id) as total_leads,
    COUNT(DISTINCT CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN l.id END) as recent_leads_7d,
    COUNT(DISTINCT CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN l.id END) as recent_leads_30d
FROM projects p
LEFT JOIN quizzes q ON p.id = q.project_id
LEFT JOIN leads l ON p.id = l.project_id
GROUP BY p.id, p.name, p.user_id;

-- View para estatísticas de quiz
CREATE VIEW quiz_stats AS
SELECT 
    q.id as quiz_id,
    q.name as quiz_name,
    q.project_id,
    q.status,
    q.lead_count,
    COUNT(l.id) as actual_leads,
    COUNT(DISTINCT CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN l.id END) as recent_leads_7d,
    COUNT(DISTINCT CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN l.id END) as recent_leads_30d,
    q.created_at,
    q.published_at
FROM quizzes q
LEFT JOIN leads l ON q.id = l.quiz_id
GROUP BY q.id, q.name, q.project_id, q.status, q.lead_count, q.created_at, q.published_at;

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir usuário de exemplo
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('João Silva', 'joao@exemplo.com', '+5511999999999', '$2a$10$hashedpassword', 'owner'),
('Maria Santos', 'maria@exemplo.com', '+5511888888888', '$2a$10$hashedpassword', 'admin');

-- Inserir projetos de exemplo
INSERT INTO projects (user_id, name, domain, logo, settings) VALUES
((SELECT id FROM users WHERE email = 'joao@exemplo.com'), 'Projeto Tech', 'tech.exemplo.com', 'https://exemplo.com/logo.png', '{"theme": "dark", "language": "pt-BR"}'),
((SELECT id FROM users WHERE email = 'maria@exemplo.com'), 'Projeto Marketing', 'marketing.exemplo.com', 'https://exemplo.com/logo2.png', '{"theme": "light", "language": "en-US"}');

-- Inserir quizzes de exemplo
INSERT INTO quizzes (project_id, name, status, quiz_json, settings) VALUES
((SELECT id FROM projects WHERE name = 'Projeto Tech'), 'Quiz JavaScript', 'published', 
 '{"questions": [{"id": "q1", "type": "multiple_choice", "question": "Qual é a linguagem mais popular?", "options": ["JavaScript", "Python", "Java"], "correct_answer": 0}], "settings": {"time_limit": 300}}',
 '{"theme": "default", "allow_anonymous": true}'),
((SELECT id FROM projects WHERE name = 'Projeto Marketing'), 'Quiz Marketing Digital', 'draft',
 '{"questions": [{"id": "q1", "type": "text", "question": "Descreva sua estratégia de marketing:", "required": true}], "settings": {"time_limit": 600}}',
 '{"theme": "modern", "allow_anonymous": false}');

-- =====================================================
-- CONSULTAS ÚTEIS
-- =====================================================

-- Consulta para obter todos os projetos de um usuário com estatísticas
SELECT 
    p.*,
    COUNT(DISTINCT q.id) as quiz_count,
    COUNT(DISTINCT l.id) as lead_count
FROM projects p
LEFT JOIN quizzes q ON p.id = q.project_id
LEFT JOIN leads l ON p.id = l.project_id
WHERE p.user_id = 'user-uuid-here'
GROUP BY p.id;

-- Consulta para obter leads de um quiz com informações do respondente
SELECT 
    l.*,
    q.name as quiz_name,
    p.name as project_name
FROM leads l
JOIN quizzes q ON l.quiz_id = q.id
JOIN projects p ON l.project_id = p.id
WHERE l.quiz_id = 'quiz-uuid-here'
ORDER BY l.created_at DESC;

-- Consulta para estatísticas de performance de quizzes
SELECT 
    q.name,
    q.status,
    q.lead_count,
    COUNT(l.id) as actual_leads,
    AVG(EXTRACT(EPOCH FROM (l.created_at - q.published_at))/3600) as avg_hours_to_first_lead
FROM quizzes q
LEFT JOIN leads l ON q.id = l.quiz_id
WHERE q.status = 'published'
GROUP BY q.id, q.name, q.status, q.lead_count
ORDER BY q.lead_count DESC; 