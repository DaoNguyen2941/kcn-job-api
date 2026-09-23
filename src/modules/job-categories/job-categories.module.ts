import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './job-category.entity';
import { JobCategoriesService } from './job-categories.service';
import { JobCategoriesController } from './job-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService],
  exports: [JobCategoriesService],
})
export class JobCategoriesModule {}
