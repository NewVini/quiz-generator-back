import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionsTable1752344245589 implements MigrationInterface {
    name = 'CreateSubscriptionsTable1752344245589'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`logo\` \`logo\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`settings\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`primary_color\` \`primary_color\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`secondary_color\` \`secondary_color\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`background_color\` \`background_color\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`font_family\` \`font_family\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`logo_base64\` \`logo_base64\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`icon_base64\` \`icon_base64\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` DROP COLUMN \`extra\``);
        await queryRunner.query(`ALTER TABLE \`project_settings\` ADD \`extra\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` ADD CONSTRAINT \`FK_05cf250364d77b0603193d55422\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_settings\` DROP FOREIGN KEY \`FK_05cf250364d77b0603193d55422\``);
        await queryRunner.query(`ALTER TABLE \`project_settings\` DROP COLUMN \`extra\``);
        await queryRunner.query(`ALTER TABLE \`project_settings\` ADD \`extra\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`icon_base64\` \`icon_base64\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`logo_base64\` \`logo_base64\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`font_family\` \`font_family\` varchar(100) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`background_color\` \`background_color\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`secondary_color\` \`secondary_color\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` CHANGE \`primary_color\` \`primary_color\` varchar(20) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(20) COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`settings\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`settings\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`logo\` \`logo\` longtext COLLATE "utf8mb4_unicode_ci" NULL DEFAULT 'NULL'`);
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
    }

}
