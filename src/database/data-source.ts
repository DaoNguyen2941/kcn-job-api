import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { AdminUser } from '../modules/admin-users/admin-user.entity';
import { IndustrialZone } from '../modules/industrial-zones/industrial-zone.entity';
import { Company } from '../modules/companies/company.entity';
import { CompanyContact } from '../modules/company-contacts/company-contact.entity';
import { JobCategory } from '../modules/job-categories/job-category.entity';
import { LaborOrder } from '../modules/labor-orders/labor-order.entity';
import { LaborOrderRequirement } from '../modules/labor-order-requirements/labor-order-requirement.entity';
import { RecruitmentSource } from '../modules/recruitment-sources/recruitment-source.entity';
import { RecruitmentPost } from '../modules/recruitment-posts/recruitment-post.entity';
import { Candidate } from '../modules/candidates/candidate.entity';
import { LaborOrderWorker } from '../modules/labor-order-workers/labor-order-worker.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'kcnjob',
  charset: 'utf8mb4_unicode_ci',
  entities: [
    AdminUser,
    IndustrialZone,
    Company,
    CompanyContact,
    JobCategory,
    LaborOrder,
    LaborOrderRequirement,
    RecruitmentSource,
    RecruitmentPost,
    Candidate,
    LaborOrderWorker,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
