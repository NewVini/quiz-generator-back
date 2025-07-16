import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1752651229302 implements MigrationInterface {
    name = 'CreateInitialTables1752651229302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`leads\` (\`id\` varchar(36) NOT NULL, \`quiz_id\` varchar(255) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`name\` varchar(255) NULL, \`phone\` varchar(20) NULL, \`custom_fields\` json NULL, \`responses\` json NOT NULL, \`source\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quizzes\` (\`id\` varchar(36) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`quiz_json\` json NOT NULL, \`settings\` json NULL, \`lead_count\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`published_at\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_users\` (\`id\` varchar(36) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`permissions\` json NOT NULL DEFAULT ('{}'), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4d392d4703ae37be0cc9a25317\` (\`project_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_invites\` (\`id\` varchar(36) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`permissions\` json NOT NULL DEFAULT ('{}'), \`token\` varchar(255) NOT NULL, \`accepted\` tinyint NOT NULL DEFAULT 0, \`expires_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6595df28a8a99b65ddac9675af\` (\`project_id\`, \`email\`), UNIQUE INDEX \`IDX_18710c7d7e6bb6f8aaab8ffe5d\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`domain\` varchar(255) NULL, \`logo\` longtext NULL, \`settings\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`plan_type\` varchar(20) NOT NULL, \`status\` varchar(20) NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`next_billing\` date NOT NULL, \`quizzes_limit\` int NOT NULL DEFAULT '50', \`leads_limit\` int NOT NULL DEFAULT '10000', \`quizzes_used\` int NOT NULL DEFAULT '0', \`leads_used\` int NOT NULL DEFAULT '0', \`price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`billings\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`subscription_id\` varchar(255) NULL, \`billing_type\` varchar(50) NOT NULL, \`status\` varchar(20) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(10) NOT NULL DEFAULT 'BRL', \`payment_method\` varchar(255) NULL, \`payment_gateway_id\` varchar(255) NULL, \`payment_gateway_response\` text NULL, \`due_date\` date NOT NULL, \`paid_date\` date NULL, \`trial_start_date\` date NULL, \`trial_end_date\` date NULL, \`is_trial\` tinyint NOT NULL DEFAULT 0, \`description\` text NULL, \`failure_reason\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_8c587ef1ad8855fa35326894ba\` (\`subscription_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_invites\` (\`id\` varchar(36) NOT NULL, \`invited_by_user_id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`default_permissions\` json NOT NULL DEFAULT ('{}'), \`token\` varchar(255) NOT NULL, \`accepted\` tinyint NOT NULL DEFAULT 0, \`expires_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_aa8589dcb34f926f9351fbb3f8\` (\`invited_by_user_id\`, \`email\`), UNIQUE INDEX \`IDX_69913152eb288951fde66c2dd7\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_permissions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`permissions\` json NOT NULL DEFAULT ('{}'), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(20) NULL, \`password_hash\` varchar(255) NULL, \`auth_provider\` enum ('local', 'google', 'facebook') NOT NULL DEFAULT 'local', \`provider_id\` varchar(255) NULL, \`avatar_url\` varchar(500) NULL, \`role\` enum ('system_admin', 'creator', 'assistant') NOT NULL DEFAULT 'assistant', \`created_by_user_id\` varchar(36) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_settings\` (\`id\` varchar(36) NOT NULL, \`project_id\` varchar(255) NOT NULL, \`primary_color\` varchar(20) NULL, \`secondary_color\` varchar(20) NULL, \`background_color\` varchar(20) NULL, \`font_family\` varchar(100) NULL, \`logo_base64\` longtext NULL, \`icon_base64\` longtext NULL, \`extra\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_3ab8a7f781a65d02b14f227bde8\` FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`leads\` ADD CONSTRAINT \`FK_ca42dd045052d5688dfe9a74466\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD CONSTRAINT \`FK_917ebdd5d330a10172ca61a2b09\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_users\` ADD CONSTRAINT \`FK_3a53b25fef9b1ac81501a2816a5\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_users\` ADD CONSTRAINT \`FK_076af26ee5a7bbcce3f77bfddfb\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_invites\` ADD CONSTRAINT \`FK_c422f909ce92e487b363b78eb97\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_bd55b203eb9f92b0c8390380010\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`billings\` ADD CONSTRAINT \`FK_9a671f450f27ad0250fcaa101b8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`billings\` ADD CONSTRAINT \`FK_8c587ef1ad8855fa35326894bac\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_invites\` ADD CONSTRAINT \`FK_9ae31c5fd6791f80f4302a84d4c\` FOREIGN KEY (\`invited_by_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` ADD CONSTRAINT \`FK_3495bd31f1862d02931e8e8d2e8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_3402191df44bc05c18c1cbbdc92\` FOREIGN KEY (\`created_by_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_settings\` ADD CONSTRAINT \`FK_05cf250364d77b0603193d55422\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_settings\` DROP FOREIGN KEY \`FK_05cf250364d77b0603193d55422\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_3402191df44bc05c18c1cbbdc92\``);
        await queryRunner.query(`ALTER TABLE \`user_permissions\` DROP FOREIGN KEY \`FK_3495bd31f1862d02931e8e8d2e8\``);
        await queryRunner.query(`ALTER TABLE \`user_invites\` DROP FOREIGN KEY \`FK_9ae31c5fd6791f80f4302a84d4c\``);
        await queryRunner.query(`ALTER TABLE \`billings\` DROP FOREIGN KEY \`FK_8c587ef1ad8855fa35326894bac\``);
        await queryRunner.query(`ALTER TABLE \`billings\` DROP FOREIGN KEY \`FK_9a671f450f27ad0250fcaa101b8\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_bd55b203eb9f92b0c8390380010\``);
        await queryRunner.query(`ALTER TABLE \`project_invites\` DROP FOREIGN KEY \`FK_c422f909ce92e487b363b78eb97\``);
        await queryRunner.query(`ALTER TABLE \`project_users\` DROP FOREIGN KEY \`FK_076af26ee5a7bbcce3f77bfddfb\``);
        await queryRunner.query(`ALTER TABLE \`project_users\` DROP FOREIGN KEY \`FK_3a53b25fef9b1ac81501a2816a5\``);
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_917ebdd5d330a10172ca61a2b09\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_ca42dd045052d5688dfe9a74466\``);
        await queryRunner.query(`ALTER TABLE \`leads\` DROP FOREIGN KEY \`FK_3ab8a7f781a65d02b14f227bde8\``);
        await queryRunner.query(`DROP TABLE \`project_settings\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_3495bd31f1862d02931e8e8d2e\` ON \`user_permissions\``);
        await queryRunner.query(`DROP TABLE \`user_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_69913152eb288951fde66c2dd7\` ON \`user_invites\``);
        await queryRunner.query(`DROP INDEX \`IDX_aa8589dcb34f926f9351fbb3f8\` ON \`user_invites\``);
        await queryRunner.query(`DROP TABLE \`user_invites\``);
        await queryRunner.query(`DROP INDEX \`REL_8c587ef1ad8855fa35326894ba\` ON \`billings\``);
        await queryRunner.query(`DROP TABLE \`billings\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_18710c7d7e6bb6f8aaab8ffe5d\` ON \`project_invites\``);
        await queryRunner.query(`DROP INDEX \`IDX_6595df28a8a99b65ddac9675af\` ON \`project_invites\``);
        await queryRunner.query(`DROP TABLE \`project_invites\``);
        await queryRunner.query(`DROP INDEX \`IDX_4d392d4703ae37be0cc9a25317\` ON \`project_users\``);
        await queryRunner.query(`DROP TABLE \`project_users\``);
        await queryRunner.query(`DROP TABLE \`quizzes\``);
        await queryRunner.query(`DROP TABLE \`leads\``);
    }

}
