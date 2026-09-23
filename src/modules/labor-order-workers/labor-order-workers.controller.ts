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
import { LaborOrderWorkersService } from './labor-order-workers.service';
import { CreateLaborOrderWorkerDto } from './dto/create-labor-order-worker.dto';
import { UpdateLaborOrderWorkerDto } from './dto/update-labor-order-worker.dto';
import { QueryLaborOrderWorkerDto } from './dto/query-labor-order-worker.dto';

@ApiTags('Admin - Labor Order Workers')
@ApiBearerAuth()
@Controller('admin/labor-order-workers')
export class LaborOrderWorkersController {
  constructor(private readonly service: LaborOrderWorkersService) {}

  @Post()
  create(@Body() dto: CreateLaborOrderWorkerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLaborOrderWorkerDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLaborOrderWorkerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
