-- phpMyAdmin SQL Dump - VERSÃO CORRIGIDA
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 193.203.175.69
-- Tempo de geração: 14/07/2025 às 15:45
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

-- Configurações corrigidas para evitar erro de collation
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Configurações de charset e collation corrigidas
SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;
SET COLLATION_CONNECTION = utf8mb4_unicode_ci;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `u228402541_opsevor`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `billings`
--

CREATE TABLE `billings` (
  `id` varchar(36) NOT NULL,
  `subscription_id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'BRL',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `billing_date` date NOT NULL,
  `due_date` date NOT NULL,
  `paid_at` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `leads`
--

CREATE TABLE `leads` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `responses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`responses`)),
  `source` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `quiz_id` varchar(255) NOT NULL,
  `project_id` varchar(255) NOT NULL,
  `custom_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_fields`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `leads`
--

INSERT INTO `leads` (`id`, `email`, `name`, `phone`, `responses`, `source`, `created_at`, `quiz_id`, `project_id`, `custom_fields`) VALUES
('64d7294c-6083-4c5c-954f-47826be12f50', 'respondente1@exemplo.com', 'Carlos Oliveira', '+5511777777777', '{\"q1\":0,\"q2\":\"Tenho 3 anos de experiência com JavaScript, principalmente React e Node.js\"}', 'website', '2025-07-12 19:58:45.312544', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '{\"idade\":\"28\",\"cidade\":\"São Paulo\",\"empresa\":\"Tech Corp\"}'),
('91da2fad-11fc-4faf-b792-9e3a514eb16c', 'respondente3@exemplo.com', 'Pedro Santos', NULL, '{\"q1\":0,\"q2\":\"JavaScript é minha linguagem principal há 2 anos\"}', 'email', '2025-07-12 19:58:45.316536', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '{\"idade\":\"25\",\"cidade\":\"Belo Horizonte\"}'),
('f3927313-26da-46c7-b476-13182a9d5e9b', 'respondente2@exemplo.com', 'Ana Costa', '+5511666666666', '{\"q1\":1,\"q2\":\"Comecei com JavaScript há 1 ano, ainda estou aprendendo\"}', 'social_media', '2025-07-12 19:58:45.315190', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '{\"idade\":\"32\",\"cidade\":\"Rio de Janeiro\",\"empresa\":\"Digital Solutions\"}');

-- --------------------------------------------------------

--
-- Estrutura para tabela `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1703123456789, 'CreateInitialTables1703123456789'),
(2, 1752119163833, 'AddOAuthFields1752119163833');

-- --------------------------------------------------------

--
-- Estrutura para tabela `projects`
--

CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `user_id` varchar(255) NOT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `projects`
--

INSERT INTO `projects` (`id`, `name`, `domain`, `logo`, `created_at`, `updated_at`, `user_id`, `settings`) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Projeto Tech', 'tech.exemplo.com', 'https://exemplo.com/logo.png', '2025-07-12 19:58:45.298035', '2025-07-12 19:58:45.298035', '550e8400-e29b-41d4-a716-446655440000', '{\"theme\":\"dark\",\"language\":\"pt-BR\"}'),
('550e8400-e29b-41d4-a716-446655440003', 'Projeto Marketing', 'marketing.exemplo.com', 'https://exemplo.com/logo2.png', '2025-07-12 19:58:45.299571', '2025-07-12 19:58:45.299571', '550e8400-e29b-41d4-a716-446655440001', '{\"theme\":\"light\",\"language\":\"en-US\"}');

-- --------------------------------------------------------

--
-- Estrutura para tabela `project_settings`
--

CREATE TABLE `project_settings` (
  `id` varchar(36) NOT NULL,
  `project_id` varchar(255) NOT NULL,
  `primary_color` varchar(20) DEFAULT NULL,
  `secondary_color` varchar(20) DEFAULT NULL,
  `background_color` varchar(20) DEFAULT NULL,
  `font_family` varchar(100) DEFAULT NULL,
  `logo_base64` longtext DEFAULT NULL,
  `icon_base64` longtext DEFAULT NULL,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra`)),
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `project_settings`
--

INSERT INTO `project_settings` (`id`, `project_id`, `primary_color`, `secondary_color`, `background_color`, `font_family`, `logo_base64`, `icon_base64`, `extra`, `created_at`, `updated_at`) VALUES
('1beee8a5-17bc-41ec-822b-fd636be9bb13', '550e8400-e29b-41d4-a716-446655440003', '#3b82f6', '#ff0000', '#000000', 'Inter', '', '', '{}', '2025-07-12 19:54:26.377722', '2025-07-12 19:54:26.377722');

-- --------------------------------------------------------

--
-- Estrutura para tabela `quizzes`
--

CREATE TABLE `quizzes` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `quiz_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`quiz_json`)),
  `lead_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `project_id` varchar(255) NOT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `quizzes`
--

INSERT INTO `quizzes` (`id`, `name`, `status`, `quiz_json`, `lead_count`, `created_at`, `updated_at`, `project_id`, `published_at`, `settings`) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Quiz JavaScript', 'published', '{\"questions\":[{\"id\":\"q1\",\"type\":\"multiple_choice\",\"question\":\"Qual é a linguagem de programação mais popular?\",\"options\":[\"JavaScript\",\"Python\",\"Java\",\"C++\"],\"correct_answer\":0,\"required\":true},{\"id\":\"q2\",\"type\":\"text\",\"question\":\"Descreva sua experiência com JavaScript:\",\"required\":false}],\"settings\":{\"time_limit\":300,\"show_results\":true,\"allow_anonymous\":true}}', 3, '2025-07-12 19:58:45.304208', '2025-07-12 19:58:45.000000', '550e8400-e29b-41d4-a716-446655440002', '2025-07-13 01:58:45', '{\"theme\":\"default\",\"allow_anonymous\":true}'),
('550e8400-e29b-41d4-a716-446655440005', 'Quiz Marketing Digital', 'draft', '{\"questions\":[{\"id\":\"q2\",\"type\":\"text\",\"question\":\"Descreva sua estratégia de marketing:\",\"options\":[],\"correct_answer\":-1,\"required\":true,\"logic\":[]},{\"id\":\"q1\",\"type\":\"multiple_choice\",\"question\":\"Qual é a melhor estratégia de marketing digital?\",\"options\":[\"SEO\",\"Redes Sociais\",\"Email Marketing\",\"Todas as anteriores\"],\"correct_answer\":3,\"required\":true,\"logic\":[]}]}', 0, '2025-07-12 19:58:45.305971', '2025-07-12 20:11:42.000000', '550e8400-e29b-41d4-a716-446655440003', NULL, '{\"theme\":\"modern\",\"allow_anonymous\":false}');

-- --------------------------------------------------------

--
-- Estrutura para tabela `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `plan_type` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `next_billing` date NOT NULL,
  `quizzes_limit` int(11) NOT NULL DEFAULT 50,
  `leads_limit` int(11) NOT NULL DEFAULT 10000,
  `quizzes_used` int(11) NOT NULL DEFAULT 0,
  `leads_used` int(11) NOT NULL DEFAULT 0,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_type`, `status`, `start_date`, `end_date`, `next_billing`, `quizzes_limit`, `leads_limit`, `quizzes_used`, `leads_used`, `price`, `created_at`, `updated_at`) VALUES
('5f5173dd-5662-409f-9e10-3f4ea68fa9a1', '550e8400-e29b-41d4-a716-4466554400001', 'monthly', 'active', '2024-01-01', '2024-02-01', '2024-02-01', 1000, 100000, 0, 0, 29.90, '2025-07-12 19:59:33.947452', '2025-07-12 19:59:33.947452'),
('72ec1445-8743-4be6-94ef-501427ed3591', '550e8400-e29b-41d4-a716-446655440000', 'monthly', 'active', '2024-01-01', '2024-02-01', '2024-02-01', 1000, 100000, 0, 0, 29.90, '2025-07-12 19:59:20.781637', '2025-07-12 19:59:20.781637');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('owner','admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'João Silva', 'joao@exemplo.com', '+5511999999999', '$2b$10$qmpRJteZb.h5QOPoA9rXLOS1vDfioSZCmGzkKxr3LOyHn/IhnCcFO', 'owner', '2025-07-12 19:58:45.288474', '2025-07-12 19:58:45.288474'),
('550e8400-e29b-41d4-a716-446655440001', 'Maria Santos', 'maria@exemplo.com', '+5511888888888', '$2b$10$wdJTnhgWK8WIX8TOGDg6peVUujLv97WErgGMBPduQtc.PiL81uhXG', 'admin', '2025-07-12 19:58:45.291935', '2025-07-12 19:58:45.291935'),
('afa0cf4d-f4ea-4381-a434-c9f5b4f85936', 'teste', 'teste@teste.com', '11988374948', '$2b$10$ODk6TeM1SeGZRmB8ESoY4uFa3x95Un.Blrb31q4y6y/Ik3kwuCK/a', 'owner', '2025-07-12 20:03:29.339104', '2025-07-12 20:03:29.339104');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `billings`
--
ALTER TABLE `billings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_billings_subscription_id` (`subscription_id`),
  ADD KEY `IDX_billings_user_id` (`user_id`),
  ADD KEY `IDX_billings_status` (`status`),
  ADD KEY `IDX_billings_billing_date` (`billing_date`);

--
-- Índices de tabela `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3ab8a7f781a65d02b14f227bde8` (`quiz_id`),
  ADD KEY `FK_ca42dd045052d5688dfe9a74466` (`project_id`);

--
-- Índices de tabela `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_bd55b203eb9f92b0c8390380010` (`user_id`);

--
-- Índices de tabela `project_settings`
--
ALTER TABLE `project_settings`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_917ebdd5d330a10172ca61a2b09` (`project_id`);

--
-- Índices de tabela `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `billings`
--
ALTER TABLE `billings`
  ADD CONSTRAINT `FK_billings_subscription_id` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Restrições para tabelas `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `FK_3ab8a7f781a65d02b14f227bde8` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ca42dd045052d5688dfe9a74466` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Restrições para tabelas `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `FK_bd55b203eb9f92b0c8390380010` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Restrições para tabelas `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `FK_917ebdd5d330a10172ca61a2b09` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 