import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectSettingsTable1752325159527 implements MigrationInterface {
    name = 'CreateProjectSettingsTable1752325159527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_settings\` (\`id\` varchar(36) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`primary_color\` varchar(20) NULL, \`secondary_color\` varchar(20) NULL, \`background_color\` varchar(20) NULL, \`font_family\` varchar(100) NULL, \`logo_base64\` longtext NULL, \`icon_base64\` longtext NULL, \`extra\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`auth_provider\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`provider_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar_url\``);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`custom_fields\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`custom_fields\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`source\` \`source\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`settings\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` CHANGE \`published_at\` \`published_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`domain\` \`domain\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`logo\` \`logo\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`settings\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password_hash\` \`password_hash\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_3ab8a7f781a65d02b14f227bde8\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_ca42dd045052d5688dfe9a74466\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_917ebdd5d330a10172ca61a2b09\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_bd55b203eb9f92b0c8390380010\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` ADD CONSTRAINT \`FK_05cf250364d77b0603193d55422\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_settings\` DROP FOREIGN KEY \`FK_05cf250364d77b0603193d55422\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_bd55b203eb9f92b0c8390380010\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_917ebdd5d330a10172ca61a2b09\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_ca42dd045052d5688dfe9a74466\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_3ab8a7f781a65d02b14f227bde8\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password_hash\` \`password_hash\` varchar(255) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(20) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`settings\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`logo\` \`logo\` varchar(500) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`domain\` \`domain\` varchar(255) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` CHANGE \`published_at\` \`published_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`settings\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`source\` \`source\` varchar(100) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP COLUMN \`custom_fields\``);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD \`custom_fields\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`phone\` \`phone\` varchar(20) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`name\` \`name\` varchar(255) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`leads\` CHANGE \`email\` \`email\` varchar(255) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar_url\` varchar(500) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`provider_id\` varchar(255) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`auth_provider\` enum COLLATE "utf8mb4_unicode_ci" ('local', 'google', 'facebook') NOT NULL DEFAULT ''local''`);
        await queryRunner.query(`DROP TABLE \`project_settings\``);
    }

}
