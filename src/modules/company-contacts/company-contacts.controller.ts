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
import { CompanyContactsService } from './company-contacts.service';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';
import { QueryCompanyContactDto } from './dto/query-company-contact.dto';

@ApiTags('Admin - Company Contacts')
@ApiBearerAuth()
@Controller('admin/company-contacts')
export class CompanyContactsController {
  constructor(private readonly service: CompanyContactsService) {}

  @Post()
  create(@Body() dto: CreateCompanyContactDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryCompanyContactDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyContactDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
