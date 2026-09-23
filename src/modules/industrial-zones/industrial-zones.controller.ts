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
import { IndustrialZonesService } from './industrial-zones.service';
import { CreateIndustrialZoneDto } from './dto/create-industrial-zone.dto';
import { UpdateIndustrialZoneDto } from './dto/update-industrial-zone.dto';
import { QueryIndustrialZoneDto } from './dto/query-industrial-zone.dto';

@ApiTags('Admin - Industrial Zones')
@ApiBearerAuth()
@Controller('admin/industrial-zones')
export class IndustrialZonesController {
  constructor(private readonly service: IndustrialZonesService) {}

  @Post()
  create(@Body() dto: CreateIndustrialZoneDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryIndustrialZoneDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIndustrialZoneDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
