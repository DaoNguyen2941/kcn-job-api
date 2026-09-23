import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { AdminUser } from '../../modules/admin-users/admin-user.entity';
import { IndustrialZone } from '../../modules/industrial-zones/industrial-zone.entity';
import { JobCategory } from '../../modules/job-categories/job-category.entity';
import { RecruitmentSource } from '../../modules/recruitment-sources/recruitment-source.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';

async function seedAdminUser() {
  const repo = dataSource.getRepository(AdminUser);
  const existed = await repo.findOne({ where: { username: 'admin' } });
  if (existed) {
    console.log('[seed] admin_users: "admin" already exists, skip.');
    return;
  }
  const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);
  // Password is NEVER hard-coded: taken from DEFAULT_ADMIN_PASSWORD env var.
  const plainPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  if (!plainPassword) {
    throw new Error('DEFAULT_ADMIN_PASSWORD is not set in environment - cannot seed admin user.');
  }
  const passwordHash = await bcrypt.hash(plainPassword, rounds);

  await repo.save(
    repo.create({
      username: 'admin',
      passwordHash,
      fullName: 'System Administrator',
      email: 'admin@kcnjob.local',
      status: CommonStatus.ACTIVE,
    }),
  );
  console.log('[seed] admin_users: created user "admin" (password from DEFAULT_ADMIN_PASSWORD).');
}

async function seedIndustrialZones() {
  const repo = dataSource.getRepository(IndustrialZone);
  const zones = [
    { name: 'KCN Yên Phong', code: 'YEN_PHONG', province: 'Bắc Ninh' },
    { name: 'KCN Quế Võ', code: 'QUE_VO', province: 'Bắc Ninh' },
    { name: 'KCN Tiên Sơn', code: 'TIEN_SON', province: 'Bắc Ninh' },
  ];
  for (const zone of zones) {
    const existed = await repo.findOne({ where: { code: zone.code } });
    if (existed) continue;
    await repo.save(repo.create({ ...zone, status: CommonStatus.ACTIVE }));
    console.log(`[seed] industrial_zones: created "${zone.name}"`);
  }
}

async function seedJobCategories() {
  const repo = dataSource.getRepository(JobCategory);
  const categories = [
    { name: 'Công nhân', code: 'CONG_NHAN' },
    { name: 'QC / Kiểm tra chất lượng', code: 'QC' },
    { name: 'Kho vận', code: 'KHO_VAN' },
    { name: 'Kỹ thuật', code: 'KY_THUAT' },
    { name: 'Thợ điện', code: 'THO_DIEN' },
    { name: 'Lái xe', code: 'LAI_XE' },
    { name: 'Bán hàng', code: 'BAN_HANG' },
    { name: 'Bảo vệ', code: 'BAO_VE' },
  ];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const existed = await repo.findOne({ where: { code: category.code } });
    if (existed) continue;
    await repo.save(repo.create({ ...category, status: CommonStatus.ACTIVE, sortOrder: i + 1 }));
    console.log(`[seed] job_categories: created "${category.name}"`);
  }
}

async function seedRecruitmentSources() {
  const repo = dataSource.getRepository(RecruitmentSource);
  const sources = [
    { name: 'Facebook', code: 'FACEBOOK' },
    { name: 'Zalo', code: 'ZALO' },
    { name: 'Website', code: 'WEBSITE' },
    { name: 'TikTok', code: 'TIKTOK' },
    { name: 'CTV', code: 'CTV' },
    { name: 'Referral', code: 'REFERRAL' },
  ];
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const existed = await repo.findOne({ where: { code: source.code } });
    if (existed) continue;
    await repo.save(repo.create({ ...source, status: CommonStatus.ACTIVE, sortOrder: i + 1 }));
    console.log(`[seed] recruitment_sources: created "${source.name}"`);
  }
}

async function run() {
  await dataSource.initialize();
  console.log('[seed] Data source initialized.');

  await seedAdminUser();
  await seedIndustrialZones();
  await seedJobCategories();
  await seedRecruitmentSources();

  await dataSource.destroy();
  console.log('[seed] Done.');
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
