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
import { LaborOrderRequirementsService } from './labor-order-requirements.service';
import { CreateLaborOrderRequirementDto } from './dto/create-labor-order-requirement.dto';
import { UpdateLaborOrderRequirementDto } from './dto/update-labor-order-requirement.dto';
import { QueryLaborOrderRequirementDto } from './dto/query-labor-order-requirement.dto';

@ApiTags('Admin - Labor Order Requirements')
@ApiBearerAuth()
@Controller('admin/labor-order-requirements')
export class LaborOrderRequirementsController {
  constructor(private readonly service: LaborOrderRequirementsService) {}

  @Post()
  create(@Body() dto: CreateLaborOrderRequirementDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLaborOrderRequirementDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLaborOrderRequirementDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
