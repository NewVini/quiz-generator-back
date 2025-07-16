USE quizzes;

-- Corrigir a collation da tabela user_permissions para ser consistente com users
ALTER TABLE `user_permissions` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- Corrigir especificamente a coluna user_id para ter a mesma collation
ALTER TABLE `user_permissions` MODIFY `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL; 