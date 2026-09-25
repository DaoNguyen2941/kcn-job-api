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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { CompanyResponseDto } from './dto/res-company.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { Company } from './company.entity';

@ApiTags('Admin - Companies')
@ApiBearerAuth()
@Controller('admin/companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) { }

  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.service.create(dto);
    return plainToInstance(CompanyResponseDto, company);
  }

  @Get()
  async findAll(@Query() query: QueryCompanyDto): Promise<PaginatedResult<Company>> {
    const data = await this.service.findAll(query);
    return plainToInstance(PaginatedResult<Company>, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
