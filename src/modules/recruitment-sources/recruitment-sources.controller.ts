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
import { RecruitmentSourcesService } from './recruitment-sources.service';
import { CreateRecruitmentSourceDto } from './dto/create-recruitment-source.dto';
import { UpdateRecruitmentSourceDto } from './dto/update-recruitment-source.dto';
import { QueryRecruitmentSourceDto } from './dto/query-recruitment-source.dto';

@ApiTags('Admin - Recruitment Sources')
@ApiBearerAuth()
@Controller('admin/recruitment-sources')
export class RecruitmentSourcesController {
  constructor(private readonly service: RecruitmentSourcesService) {}

  @Post()
  create(@Body() dto: CreateRecruitmentSourceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRecruitmentSourceDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecruitmentSourceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
