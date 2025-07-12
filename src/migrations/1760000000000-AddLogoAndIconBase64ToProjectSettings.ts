import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogoAndIconBase64ToProjectSettings1760000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adiciona as colunas base64
        await queryRunner.query(`ALTER TABLE project_settings ADD COLUMN logo_base64 LONGTEXT NULL`);
        await queryRunner.query(`ALTER TABLE project_settings ADD COLUMN icon_base64 LONGTEXT NULL`);
        // Remove as colunas antigas de URL
        await queryRunner.query(`ALTER TABLE project_settings DROP COLUMN logo_url`);
        await queryRunner.query(`ALTER TABLE project_settings DROP COLUMN icon_url`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverte as alterações
        await queryRunner.query(`ALTER TABLE project_settings ADD COLUMN logo_url VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE project_settings ADD COLUMN icon_url VARCHAR(255) NULL`);
        await queryRunner.query(`ALTER TABLE project_settings DROP COLUMN logo_base64`);
        await queryRunner.query(`ALTER TABLE project_settings DROP COLUMN icon_base64`);
    }
} 