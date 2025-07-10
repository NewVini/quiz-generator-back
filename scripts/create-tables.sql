-- Script para criar as tabelas do Quiz Builder no MySQL
-- Execute este script no seu cliente MySQL

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS `quizzes` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE `quizzes`;

-- Criar tabela de usuários
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('owner', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_users_email` (`email`),
  KEY `IDX_users_role` (`role`),
  KEY `IDX_users_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de projetos
CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `domain` varchar(255) NULL,
  `logo` varchar(500) NULL,
  `settings` json NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_projects_user_id` (`user_id`),
  KEY `IDX_projects_created_at` (`created_at`),
  KEY `IDX_projects_domain` (`domain`),
  CONSTRAINT `FK_projects_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de quizzes
CREATE TABLE `quizzes` (
  `id` varchar(36) NOT NULL,
  `project_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  `quiz_json` json NOT NULL,
  `settings` json NULL,
  `lead_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `published_at` datetime NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_quizzes_project_id` (`project_id`),
  KEY `IDX_quizzes_status` (`status`),
  KEY `IDX_quizzes_created_at` (`created_at`),
  KEY `IDX_quizzes_published_at` (`published_at`),
  KEY `IDX_quizzes_lead_count` (`lead_count`),
  CONSTRAINT `FK_quizzes_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de leads
CREATE TABLE `leads` (
  `id` varchar(36) NOT NULL,
  `quiz_id` varchar(36) NOT NULL,
  `project_id` varchar(36) NOT NULL,
  `email` varchar(255) NULL,
  `name` varchar(255) NULL,
  `phone` varchar(20) NULL,
  `custom_fields` json NULL,
  `responses` json NOT NULL,
  `source` varchar(100) NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_leads_quiz_id` (`quiz_id`),
  KEY `IDX_leads_project_id` (`project_id`),
  KEY `IDX_leads_created_at` (`created_at`),
  KEY `IDX_leads_email` (`email`),
  KEY `IDX_leads_source` (`source`),
  CONSTRAINT `FK_leads_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_leads_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar trigger para incrementar lead_count automaticamente
DELIMITER $$
CREATE TRIGGER `increment_quiz_lead_count` 
AFTER INSERT ON `leads` 
FOR EACH ROW 
BEGIN
  UPDATE `quizzes` 
  SET `lead_count` = `lead_count` + 1 
  WHERE `id` = NEW.quiz_id;
END$$
DELIMITER ;

-- Inserir dados de exemplo (opcional)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'João Silva', 'joao@exemplo.com', '+5511999999999', '$2a$10$hashedpassword', 'owner'),
('550e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria@exemplo.com', '+5511888888888', '$2a$10$hashedpassword', 'admin');

INSERT INTO `projects` (`id`, `user_id`, `name`, `domain`, `logo`, `settings`) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Projeto Tech', 'tech.exemplo.com', 'https://exemplo.com/logo.png', '{"theme": "dark", "language": "pt-BR"}'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Projeto Marketing', 'marketing.exemplo.com', 'https://exemplo.com/logo2.png', '{"theme": "light", "language": "en-US"}');

INSERT INTO `quizzes` (`id`, `project_id`, `name`, `status`, `quiz_json`, `settings`) VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Quiz JavaScript', 'published', 
 '{"questions": [{"id": "q1", "type": "multiple_choice", "question": "Qual é a linguagem mais popular?", "options": ["JavaScript", "Python", "Java"], "correct_answer": 0}], "settings": {"time_limit": 300}}',
 '{"theme": "default", "allow_anonymous": true}'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Quiz Marketing Digital', 'draft',
 '{"questions": [{"id": "q1", "type": "text", "question": "Descreva sua estratégia de marketing:", "required": true}], "settings": {"time_limit": 600}}',
 '{"theme": "modern", "allow_anonymous": false}');

-- Mostrar mensagem de sucesso
SELECT '✅ Tabelas criadas com sucesso!' as message; 