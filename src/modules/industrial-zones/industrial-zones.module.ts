import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrialZone } from './industrial-zone.entity';
import { IndustrialZonesService } from './industrial-zones.service';
import { IndustrialZonesController } from './industrial-zones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndustrialZone])],
  controllers: [IndustrialZonesController],
  providers: [IndustrialZonesService],
  exports: [IndustrialZonesService],
})
export class IndustrialZonesModule {}
