-- Script de inicialização do banco de dados
-- Este script é executado automaticamente quando o container MySQL é criado

-- Garantir que o banco quizzes existe
CREATE DATABASE IF NOT EXISTS `quizzes` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Dar permissões completas ao usuário mysqluser no banco quizzes
GRANT ALL PRIVILEGES ON `quizzes`.* TO 'mysqluser'@'%';

-- Aplicar as mudanças
FLUSH PRIVILEGES;

-- Usar o banco quizzes
USE `quizzes`;

-- Log de sucesso
SELECT 'Database setup completed successfully!' as status; 