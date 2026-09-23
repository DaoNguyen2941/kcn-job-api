import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborOrder } from './labor-order.entity';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';
import { LaborOrdersService } from './labor-orders.service';
import { LaborOrdersController } from './labor-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaborOrder, LaborOrderWorker])],
  controllers: [LaborOrdersController],
  providers: [LaborOrdersService],
  exports: [LaborOrdersService],
})
export class LaborOrdersModule {}
