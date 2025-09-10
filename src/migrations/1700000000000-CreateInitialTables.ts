import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create clients table
    await queryRunner.query(`
      CREATE TABLE \`clients\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`company_name\` varchar(255) NOT NULL,
        \`role\` enum('client','admin') NOT NULL DEFAULT 'client',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_5c49c9c1f296493d8bb9c3f3e7\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create vendors table
    await queryRunner.query(`
      CREATE TABLE \`vendors\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`countries_supported\` text NOT NULL,
        \`services_offered\` text NOT NULL,
        \`rating\` decimal(3,2) NOT NULL DEFAULT '0.00',
        \`response_sla_hours\` int NOT NULL DEFAULT '24',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`client_id\` int NOT NULL,
        \`country\` varchar(255) NOT NULL,
        \`services_needed\` text NOT NULL,
        \`budget\` decimal(10,2) NOT NULL,
        \`status\` enum('draft','active','completed','cancelled') NOT NULL DEFAULT 'draft',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`IDX_9511d2a4c96e4b4c8f638e80174\` (\`client_id\`),
        CONSTRAINT \`FK_9511d2a4c96e4b4c8f638e80174\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create matches table
    await queryRunner.query(`
      CREATE TABLE \`matches\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`project_id\` int NOT NULL,
        \`vendor_id\` int NOT NULL,
        \`score\` decimal(5,2) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_project_vendor_unique\` (\`project_id\`, \`vendor_id\`),
        KEY \`IDX_6a8da3f8d5c2634b7d1d4f4e4c\` (\`project_id\`),
        KEY \`IDX_7b9da4f9e6d3745c8e2e5f5f5d\` (\`vendor_id\`),
        CONSTRAINT \`FK_6a8da3f8d5c2634b7d1d4f4e4c\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_7b9da4f9e6d3745c8e2e5f5f5d\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `matches`');
    await queryRunner.query('DROP TABLE `projects`');
    await queryRunner.query('DROP TABLE `vendors`');
    await queryRunner.query('DROP TABLE `clients`');
  }
}
