import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborOrderWorker } from './labor-order-worker.entity';
import { LaborOrderWorkersService } from './labor-order-workers.service';
import { LaborOrderWorkersController } from './labor-order-workers.controller';
import { LaborOrdersModule } from '../labor-orders/labor-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([LaborOrderWorker]), LaborOrdersModule],
  controllers: [LaborOrderWorkersController],
  providers: [LaborOrderWorkersService],
})
export class LaborOrderWorkersModule {}
