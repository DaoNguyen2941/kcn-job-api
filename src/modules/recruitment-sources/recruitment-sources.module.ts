import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentSource } from './recruitment-source.entity';
import { RecruitmentSourcesService } from './recruitment-sources.service';
import { RecruitmentSourcesController } from './recruitment-sources.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitmentSource])],
  controllers: [RecruitmentSourcesController],
  providers: [RecruitmentSourcesService],
  exports: [RecruitmentSourcesService],
})
export class RecruitmentSourcesModule {}
