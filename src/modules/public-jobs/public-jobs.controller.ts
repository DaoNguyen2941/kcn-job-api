import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicJobsService } from './public-jobs.service';
import { QueryPublicJobDto } from './dto/query-public-job.dto';

@ApiTags('Public - Jobs')
@Controller()
export class PublicJobsController {
  constructor(private readonly service: PublicJobsService) {}

  @Get('jobs')
  findAll(@Query() query: QueryPublicJobDto) {
    return this.service.findAll(query);
  }

  @Get('jobs/:slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get('job-categories')
  jobCategories() {
    return this.service.findJobCategories();
  }

  @Get('industrial-zones')
  industrialZones() {
    return this.service.findIndustrialZones();
  }
}
