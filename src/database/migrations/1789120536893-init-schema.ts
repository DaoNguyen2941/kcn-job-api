import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1789120536893 implements MigrationInterface {
  name = 'InitSchema1789120536893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ------------------------------------------------------------------
    // admin_users
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`admin_users\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`username\` VARCHAR(50) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`full_name\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NULL,
        \`phone\` VARCHAR(20) NULL,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`last_login_at\` DATETIME NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_admin_users_username\` (\`username\`),
        UNIQUE KEY \`UQ_admin_users_email\` (\`email\`),
        KEY \`IDX_admin_users_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // industrial_zones
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`industrial_zones\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(150) NOT NULL,
        \`code\` VARCHAR(50) NOT NULL,
        \`province\` VARCHAR(100) NULL,
        \`district\` VARCHAR(100) NULL,
        \`address\` VARCHAR(255) NULL,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_industrial_zones_code\` (\`code\`),
        KEY \`IDX_industrial_zones_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // job_categories
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`job_categories\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(150) NOT NULL,
        \`code\` VARCHAR(50) NOT NULL,
        \`description\` TEXT NULL,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_job_categories_code\` (\`code\`),
        KEY \`IDX_job_categories_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // recruitment_sources
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`recruitment_sources\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`code\` VARCHAR(50) NOT NULL,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_recruitment_sources_code\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // companies
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`companies\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`industrial_zone_id\` BIGINT UNSIGNED NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`short_name\` VARCHAR(150) NULL,
        \`tax_code\` VARCHAR(50) NULL,
        \`phone\` VARCHAR(20) NULL,
        \`email\` VARCHAR(150) NULL,
        \`address\` VARCHAR(255) NULL,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`note\` TEXT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_companies_tax_code\` (\`tax_code\`),
        KEY \`IDX_companies_industrial_zone_id\` (\`industrial_zone_id\`),
        KEY \`IDX_companies_status\` (\`status\`),
        CONSTRAINT \`FK_companies_industrial_zone\` FOREIGN KEY (\`industrial_zone_id\`)
          REFERENCES \`industrial_zones\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // company_contacts
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`company_contacts\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`company_id\` BIGINT UNSIGNED NOT NULL,
        \`full_name\` VARCHAR(150) NOT NULL,
        \`position\` VARCHAR(100) NULL,
        \`phone\` VARCHAR(20) NULL,
        \`email\` VARCHAR(150) NULL,
        \`is_primary\` TINYINT(1) NOT NULL DEFAULT 0,
        \`status\` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`note\` TEXT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_company_contacts_company_id\` (\`company_id\`),
        CONSTRAINT \`FK_company_contacts_company\` FOREIGN KEY (\`company_id\`)
          REFERENCES \`companies\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // labor_orders (central table)
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`labor_orders\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`company_id\` BIGINT UNSIGNED NOT NULL,
        \`industrial_zone_id\` BIGINT UNSIGNED NULL,
        \`job_category_id\` BIGINT UNSIGNED NULL,
        \`code\` VARCHAR(50) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) NOT NULL,
        \`quantity_required\` INT UNSIGNED NOT NULL,
        \`employment_type\` ENUM('FULL_TIME','PART_TIME','SEASONAL','CONTRACT') NOT NULL DEFAULT 'FULL_TIME',
        \`salary_min\` DECIMAL(12,2) NULL,
        \`salary_max\` DECIMAL(12,2) NULL,
        \`salary_description\` VARCHAR(255) NULL,
        \`work_location\` VARCHAR(255) NULL,
        \`start_date\` DATE NULL,
        \`deadline\` DATE NULL,
        \`gender_requirement\` ENUM('MALE','FEMALE','ANY') NOT NULL DEFAULT 'ANY',
        \`age_min\` SMALLINT UNSIGNED NULL,
        \`age_max\` SMALLINT UNSIGNED NULL,
        \`experience_requirement\` VARCHAR(255) NULL,
        \`education_requirement\` VARCHAR(255) NULL,
        \`work_shift\` ENUM('DAY','NIGHT','ROTATING') NOT NULL DEFAULT 'DAY',
        \`accommodation\` TINYINT(1) NOT NULL DEFAULT 0,
        \`meal_support\` TINYINT(1) NOT NULL DEFAULT 0,
        \`transport_support\` TINYINT(1) NOT NULL DEFAULT 0,
        \`description\` TEXT NULL,
        \`requirements_description\` TEXT NULL,
        \`is_public\` TINYINT(1) NOT NULL DEFAULT 0,
        \`status\` ENUM('DRAFT','CONFIRMED','RECRUITING','PARTIALLY_FILLED','FULFILLED','PAUSED','CANCELLED','CLOSED') NOT NULL DEFAULT 'DRAFT',
        \`note\` TEXT NULL,
        \`closed_at\` DATETIME NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_labor_orders_code\` (\`code\`),
        UNIQUE KEY \`UQ_labor_orders_slug\` (\`slug\`),
        KEY \`IDX_labor_orders_company_id\` (\`company_id\`),
        KEY \`IDX_labor_orders_industrial_zone_id\` (\`industrial_zone_id\`),
        KEY \`IDX_labor_orders_job_category_id\` (\`job_category_id\`),
        KEY \`IDX_labor_orders_status\` (\`status\`),
        KEY \`IDX_labor_orders_is_public\` (\`is_public\`),
        KEY \`IDX_labor_orders_employment_type\` (\`employment_type\`),
        KEY \`IDX_labor_orders_start_date\` (\`start_date\`),
        KEY \`IDX_labor_orders_deadline\` (\`deadline\`),
        KEY \`IDX_labor_orders_salary_min\` (\`salary_min\`),
        KEY \`IDX_labor_orders_salary_max\` (\`salary_max\`),
        CONSTRAINT \`FK_labor_orders_company\` FOREIGN KEY (\`company_id\`)
          REFERENCES \`companies\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_labor_orders_industrial_zone\` FOREIGN KEY (\`industrial_zone_id\`)
          REFERENCES \`industrial_zones\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_labor_orders_job_category\` FOREIGN KEY (\`job_category_id\`)
          REFERENCES \`job_categories\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // labor_order_requirements
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`labor_order_requirements\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`labor_order_id\` BIGINT UNSIGNED NOT NULL,
        \`requirement_type\` ENUM('HEALTH','DOCUMENT','SKILL','OTHER') NOT NULL DEFAULT 'OTHER',
        \`requirement_value\` VARCHAR(255) NOT NULL,
        \`is_required\` TINYINT(1) NOT NULL DEFAULT 1,
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_labor_order_requirements_labor_order_id\` (\`labor_order_id\`),
        CONSTRAINT \`FK_labor_order_requirements_labor_order\` FOREIGN KEY (\`labor_order_id\`)
          REFERENCES \`labor_orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // recruitment_posts
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`recruitment_posts\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`labor_order_id\` BIGINT UNSIGNED NOT NULL,
        \`source_id\` BIGINT UNSIGNED NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`content\` TEXT NULL,
        \`slug\` VARCHAR(255) NOT NULL,
        \`status\` ENUM('DRAFT','PUBLISHED','EXPIRED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
        \`published_at\` DATETIME NULL,
        \`expired_at\` DATETIME NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_recruitment_posts_slug\` (\`slug\`),
        KEY \`IDX_recruitment_posts_labor_order_id\` (\`labor_order_id\`),
        KEY \`IDX_recruitment_posts_source_id\` (\`source_id\`),
        KEY \`IDX_recruitment_posts_status\` (\`status\`),
        CONSTRAINT \`FK_recruitment_posts_labor_order\` FOREIGN KEY (\`labor_order_id\`)
          REFERENCES \`labor_orders\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_recruitment_posts_source\` FOREIGN KEY (\`source_id\`)
          REFERENCES \`recruitment_sources\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // candidates
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`candidates\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`full_name\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(20) NOT NULL,
        \`email\` VARCHAR(150) NULL,
        \`date_of_birth\` DATE NULL,
        \`gender\` ENUM('MALE','FEMALE','ANY') NULL,
        \`province\` VARCHAR(100) NULL,
        \`district\` VARCHAR(100) NULL,
        \`address\` VARCHAR(255) NULL,
        \`experience\` VARCHAR(255) NULL,
        \`education\` VARCHAR(255) NULL,
        \`note\` TEXT NULL,
        \`status\` ENUM('ACTIVE','BLACKLISTED','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_candidates_phone\` (\`phone\`),
        KEY \`IDX_candidates_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ------------------------------------------------------------------
    // labor_order_workers
    // ------------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE \`labor_order_workers\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`labor_order_id\` BIGINT UNSIGNED NOT NULL,
        \`candidate_id\` BIGINT UNSIGNED NOT NULL,
        \`status\` ENUM('SUPPLIED','STARTED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'SUPPLIED',
        \`supplied_at\` DATETIME NULL,
        \`started_at\` DATETIME NULL,
        \`note\` TEXT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_labor_order_workers_order_candidate\` (\`labor_order_id\`, \`candidate_id\`),
        KEY \`IDX_labor_order_workers_labor_order_id\` (\`labor_order_id\`),
        KEY \`IDX_labor_order_workers_candidate_id\` (\`candidate_id\`),
        KEY \`IDX_labor_order_workers_status\` (\`status\`),
        CONSTRAINT \`FK_labor_order_workers_labor_order\` FOREIGN KEY (\`labor_order_id\`)
          REFERENCES \`labor_orders\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_labor_order_workers_candidate\` FOREIGN KEY (\`candidate_id\`)
          REFERENCES \`candidates\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `labor_order_workers`;');
    await queryRunner.query('DROP TABLE IF EXISTS `candidates`;');
    await queryRunner.query('DROP TABLE IF EXISTS `recruitment_posts`;');
    await queryRunner.query('DROP TABLE IF EXISTS `labor_order_requirements`;');
    await queryRunner.query('DROP TABLE IF EXISTS `labor_orders`;');
    await queryRunner.query('DROP TABLE IF EXISTS `company_contacts`;');
    await queryRunner.query('DROP TABLE IF EXISTS `companies`;');
    await queryRunner.query('DROP TABLE IF EXISTS `recruitment_sources`;');
    await queryRunner.query('DROP TABLE IF EXISTS `job_categories`;');
    await queryRunner.query('DROP TABLE IF EXISTS `industrial_zones`;');
    await queryRunner.query('DROP TABLE IF EXISTS `admin_users`;');
  }
}
