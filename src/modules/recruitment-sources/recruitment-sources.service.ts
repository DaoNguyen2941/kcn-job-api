import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruitmentSource } from './recruitment-source.entity';
import { CreateRecruitmentSourceDto } from './dto/create-recruitment-source.dto';
import { UpdateRecruitmentSourceDto } from './dto/update-recruitment-source.dto';
import { QueryRecruitmentSourceDto } from './dto/query-recruitment-source.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RecruitmentSourcesService {
  constructor(
    @InjectRepository(RecruitmentSource)
    private readonly repo: Repository<RecruitmentSource>,
  ) {}

  async create(dto: CreateRecruitmentSourceDto): Promise<RecruitmentSource> {
    const existed = await this.repo.findOne({ where: { code: dto.code } });
    if (existed) throw new ConflictException('Recruitment source code already exists');
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: QueryRecruitmentSourceDto): Promise<PaginatedResult<RecruitmentSource>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('source');
    if (query.status) qb.andWhere('source.status = :status', { status: query.status });
    qb.orderBy(`source.${query.sortBy || 'sortOrder'}`, query.sortOrder || 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<RecruitmentSource> {
    const source = await this.repo.findOne({ where: { id } });
    if (!source) throw new NotFoundException('Recruitment source not found');
    return source;
  }

  async update(id: string, dto: UpdateRecruitmentSourceDto): Promise<RecruitmentSource> {
    const source = await this.findOne(id);
    Object.assign(source, dto);
    return this.repo.save(source);
  }

  async remove(id: string): Promise<void> {
    const source = await this.findOne(id);
    await this.repo.remove(source);
  }
}
