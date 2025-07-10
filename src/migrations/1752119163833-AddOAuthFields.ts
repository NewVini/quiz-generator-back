import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOAuthFields1752119163833 implements MigrationInterface {
    name = 'AddOAuthFields1752119163833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_leads_project_id\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_leads_quiz_id\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_quizzes_project_id\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_projects_user_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_leads_created_at\` ON \`leads\``);
        await queryRunner.query(`DROP INDEX \`IDX_leads_email\` ON \`leads\``);
        await queryRunner.query(`DROP INDEX \`IDX_leads_project_id\` ON \`leads\``);
        await queryRunner.query(`DROP INDEX \`IDX_leads_quiz_id\` ON \`leads\``);
        await queryRunner.query(`DROP INDEX \`IDX_leads_source\` ON \`leads\``);
        await queryRunner.query(`DROP INDEX \`IDX_quizzes_created_at\` ON \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_quizzes_lead_count\` ON \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_quizzes_project_id\` ON \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_quizzes_published_at\` ON \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_quizzes_status\` ON \`quizzes\``);
        await queryRunner.query(`DROP INDEX \`IDX_projects_created_at\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_projects_domain\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_projects_user_id\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_users_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_users_role\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`auth_provider\` enum ('local', 'google', 'facebook') NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`provider_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar_url\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`quiz_id\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`quiz_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`project_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`project_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`published_at\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`published_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`user_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password_hash\` \`password_hash\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_3ab8a7f781a65d02b14f227bde8\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_ca42dd045052d5688dfe9a74466\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_917ebdd5d330a10172ca61a2b09\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_bd55b203eb9f92b0c8390380010\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_bd55b203eb9f92b0c8390380010\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_917ebdd5d330a10172ca61a2b09\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_ca42dd045052d5688dfe9a74466\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_3ab8a7f781a65d02b14f227bde8\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password_hash\` \`password_hash\` varchar(255) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`user_id\` varchar(36) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`published_at\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`published_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`project_id\` varchar(36) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`project_id\` varchar(36) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`quiz_id\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`quiz_id\` varchar(36) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar_url\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`provider_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`auth_provider\``);
        await queryRunner.query(`CREATE INDEX \`IDX_users_role\` ON \`users\` (\`role\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_users_email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_projects_user_id\` ON \`projects\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_projects_domain\` ON \`projects\` (\`domain\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_projects_created_at\` ON \`projects\` (\`created_at\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quizzes_status\` ON \`quizzes\` (\`status\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quizzes_published_at\` ON \`quizzes\` (\`published_at\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quizzes_project_id\` ON \`quizzes\` (\`project_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quizzes_lead_count\` ON \`quizzes\` (\`lead_count\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_quizzes_created_at\` ON \`quizzes\` (\`created_at\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_leads_source\` ON \`leads\` (\`source\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_leads_quiz_id\` ON \`leads\` (\`quiz_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_leads_project_id\` ON \`leads\` (\`project_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_leads_email\` ON \`leads\` (\`email\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_leads_created_at\` ON \`leads\` (\`created_at\`)`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_projects_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_quizzes_project_id\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_leads_quiz_id\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_leads_project_id\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
