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
import { RecruitmentPostsService } from './recruitment-posts.service';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { UpdateRecruitmentPostDto } from './dto/update-recruitment-post.dto';
import { QueryRecruitmentPostDto } from './dto/query-recruitment-post.dto';

@ApiTags('Admin - Recruitment Posts')
@ApiBearerAuth()
@Controller('admin/recruitment-posts')
export class RecruitmentPostsController {
  constructor(private readonly service: RecruitmentPostsService) {}

  @Post()
  create(@Body() dto: CreateRecruitmentPostDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRecruitmentPostDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecruitmentPostDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
