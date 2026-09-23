import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaborOrderRequirement } from './labor-order-requirement.entity';
import { LaborOrderRequirementsService } from './labor-order-requirements.service';
import { LaborOrderRequirementsController } from './labor-order-requirements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaborOrderRequirement])],
  controllers: [LaborOrderRequirementsController],
  providers: [LaborOrderRequirementsService],
})
export class LaborOrderRequirementsModule {}
