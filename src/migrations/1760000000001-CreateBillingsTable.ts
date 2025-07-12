import { MigrationInterface, QueryRunner, Table, ForeignKey } from 'typeorm';

export class CreateBillingsTable1760000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'billings',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid()',
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'subscription_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'billing_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            default: "'BRL'",
            isNullable: false,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'payment_gateway_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'payment_gateway_response',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'paid_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'trial_start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'trial_end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_trial',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'failure_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Adicionar foreign keys
    await queryRunner.query(
      'ALTER TABLE billings ADD CONSTRAINT FK_BILLINGS_USER_ID FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE',
    );

    await queryRunner.query(
      'ALTER TABLE billings ADD CONSTRAINT FK_BILLINGS_SUBSCRIPTION_ID FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE',
    );

    // Adicionar índices
    await queryRunner.query(
      'CREATE INDEX IDX_BILLINGS_USER_ID ON billings (user_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_BILLINGS_SUBSCRIPTION_ID ON billings (subscription_id)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_BILLINGS_STATUS ON billings (status)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_BILLINGS_DUE_DATE ON billings (due_date)',
    );
    await queryRunner.query(
      'CREATE INDEX IDX_BILLINGS_TRIAL_END_DATE ON billings (trial_end_date)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    await queryRunner.query('ALTER TABLE billings DROP FOREIGN KEY FK_BILLINGS_USER_ID');
    await queryRunner.query('ALTER TABLE billings DROP FOREIGN KEY FK_BILLINGS_SUBSCRIPTION_ID');

    // Remover índices
    await queryRunner.query('DROP INDEX IDX_BILLINGS_USER_ID ON billings');
    await queryRunner.query('DROP INDEX IDX_BILLINGS_SUBSCRIPTION_ID ON billings');
    await queryRunner.query('DROP INDEX IDX_BILLINGS_STATUS ON billings');
    await queryRunner.query('DROP INDEX IDX_BILLINGS_DUE_DATE ON billings');
    await queryRunner.query('DROP INDEX IDX_BILLINGS_TRIAL_END_DATE ON billings');

    // Remover tabela
    await queryRunner.dropTable('billings');
  }
} 