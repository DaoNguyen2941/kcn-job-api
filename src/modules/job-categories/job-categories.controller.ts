import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JobCategoriesService } from './job-categories.service';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { QueryJobCategoryDto } from './dto/query-job-category.dto';

@ApiTags('Admin - Job Categories')
@ApiBearerAuth()
@Controller('admin/job-categories')
export class JobCategoriesController {
  constructor(private readonly service: JobCategoriesService) {}

  @Post()
  create(@Body() dto: CreateJobCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryJobCategoryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
