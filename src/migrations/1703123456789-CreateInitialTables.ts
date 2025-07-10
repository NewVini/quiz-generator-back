import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1703123456789 implements MigrationInterface {
  name = 'CreateInitialTables1703123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para roles de usuário
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`phone\` varchar(20) NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`role\` enum('owner', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Criar tabela de projetos
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` varchar(36) NOT NULL,
        \`user_id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`domain\` varchar(255) NULL,
        \`logo\` varchar(500) NULL,
        \`settings\` json NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_projects_user_id\` (\`user_id\`),
        CONSTRAINT \`FK_projects_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Criar tabela de quizzes
    await queryRunner.query(`
      CREATE TABLE \`quizzes\` (
        \`id\` varchar(36) NOT NULL,
        \`project_id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`status\` enum('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
        \`quiz_json\` json NOT NULL,
        \`settings\` json NULL,
        \`lead_count\` int NOT NULL DEFAULT '0',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`published_at\` datetime NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_quizzes_project_id\` (\`project_id\`),
        INDEX \`IDX_quizzes_status\` (\`status\`),
        CONSTRAINT \`FK_quizzes_project_id\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Criar tabela de leads
    await queryRunner.query(`
      CREATE TABLE \`leads\` (
        \`id\` varchar(36) NOT NULL,
        \`quiz_id\` varchar(36) NOT NULL,
        \`project_id\` varchar(36) NOT NULL,
        \`email\` varchar(255) NULL,
        \`name\` varchar(255) NULL,
        \`phone\` varchar(20) NULL,
        \`custom_fields\` json NULL,
        \`responses\` json NOT NULL,
        \`source\` varchar(100) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_leads_quiz_id\` (\`quiz_id\`),
        INDEX \`IDX_leads_project_id\` (\`project_id\`),
        INDEX \`IDX_leads_created_at\` (\`created_at\`),
        CONSTRAINT \`FK_leads_quiz_id\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_leads_project_id\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Criar índices adicionais
    await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_users_email\` ON \`users\` (\`email\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_users_role\` ON \`users\` (\`role\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_projects_created_at\` ON \`projects\` (\`created_at\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_projects_domain\` ON \`projects\` (\`domain\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_quizzes_created_at\` ON \`quizzes\` (\`created_at\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_quizzes_published_at\` ON \`quizzes\` (\`published_at\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_quizzes_lead_count\` ON \`quizzes\` (\`lead_count\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_leads_email\` ON \`leads\` (\`email\`)`);
    await queryRunner.query(`CREATE INDEX \`IDX_leads_source\` ON \`leads\` (\`source\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabelas na ordem inversa (devido às foreign keys)
    await queryRunner.query(`DROP TABLE \`leads\``);
    await queryRunner.query(`DROP TABLE \`quizzes\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
} 