import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UseConfigModule } from '@config/config.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { CacheHelperModule } from './common/cache/cache.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import { AuthModule } from './modules/auth/auth.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { IndustrialZonesModule } from './modules/industrial-zones/industrial-zones.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompanyContactsModule } from './modules/company-contacts/company-contacts.module';
import { JobCategoriesModule } from './modules/job-categories/job-categories.module';
import { LaborOrdersModule } from './modules/labor-orders/labor-orders.module';
import { LaborOrderRequirementsModule } from './modules/labor-order-requirements/labor-order-requirements.module';
import { RecruitmentSourcesModule } from './modules/recruitment-sources/recruitment-sources.module';
import { RecruitmentPostsModule } from './modules/recruitment-posts/recruitment-posts.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { LaborOrderWorkersModule } from './modules/labor-order-workers/labor-order-workers.module';
import { PublicJobsModule } from './modules/public-jobs/public-jobs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

import { JwtAdminAuthGuard } from '@modules/auth/guards/jwtAdminAuth.guard';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UseConfigModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    DatabaseModule,
    RedisModule,
    CacheHelperModule,

    // Auth & admin identity
    AdminUsersModule,
    AuthModule,

    // Core business modules (System 1 - Recruitment / Labor Supply)
    IndustrialZonesModule,
    CompaniesModule,
    CompanyContactsModule,
    JobCategoriesModule,
    LaborOrdersModule,
    LaborOrderRequirementsModule,
    RecruitmentSourcesModule,
    RecruitmentPostsModule,
    CandidatesModule,
    LaborOrderWorkersModule,

    // Public website + admin dashboard
    PublicJobsModule,
    DashboardModule,

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.accessExpiresIn'), // '15m'
        },
      }),
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAdminAuthGuard },
  ],
})
export class AppModule { }
