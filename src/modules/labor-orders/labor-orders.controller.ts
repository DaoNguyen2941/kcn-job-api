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
import { LaborOrdersService } from './labor-orders.service';
import { CreateLaborOrderDto } from './dto/create-labor-order.dto';
import { UpdateLaborOrderDto } from './dto/update-labor-order.dto';
import { QueryLaborOrderDto } from './dto/query-labor-order.dto';
import { LaborOrderStatusActionDto } from './labor-order-status-action.dto';

@ApiTags('Admin - Labor Orders')
@ApiBearerAuth()
@Controller('admin/labor-orders')
export class LaborOrdersController {
  constructor(private readonly service: LaborOrdersService) {}

  @Post()
  create(@Body() dto: CreateLaborOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLaborOrderDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/progress')
  getProgress(@Param('id') id: string) {
    return this.service.getProgress(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLaborOrderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.confirm(id, dto.note);
  }

  @Post(':id/start-recruiting')
  startRecruiting(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.startRecruiting(id, dto.note);
  }

  @Post(':id/pause')
  pause(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.pause(id, dto.note);
  }

  @Post(':id/resume')
  resume(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.resume(id, dto.note);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.close(id, dto.note);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: LaborOrderStatusActionDto) {
    return this.service.cancel(id, dto.note);
  }
}
