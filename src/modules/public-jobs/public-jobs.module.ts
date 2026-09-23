import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { JobCategory } from '../job-categories/job-category.entity';
import { IndustrialZone } from '../industrial-zones/industrial-zone.entity';
import { PublicJobsService } from './public-jobs.service';
import { PublicJobsController } from './public-jobs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaborOrder, JobCategory, IndustrialZone])],
  controllers: [PublicJobsController],
  providers: [PublicJobsService],
})
export class PublicJobsModule {}
