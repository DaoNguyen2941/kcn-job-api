import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../companies/company.entity';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company, LaborOrder, LaborOrderWorker])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
