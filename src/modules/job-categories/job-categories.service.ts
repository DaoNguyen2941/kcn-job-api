import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategory } from './job-category.entity';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { QueryJobCategoryDto } from './dto/query-job-category.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { CacheHelperService } from '../../common/cache/cache-helper.service';

@Injectable()
export class JobCategoriesService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly repo: Repository<JobCategory>,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async create(dto: CreateJobCategoryDto): Promise<JobCategory> {
    const existed = await this.repo.findOne({ where: { code: dto.code } });
    if (existed) throw new ConflictException('Job category code already exists');
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    await this.cacheHelper.invalidateJobCategoriesList();
    return saved;
  }

  async findAll(query: QueryJobCategoryDto): Promise<PaginatedResult<JobCategory>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('category');

    if (query.keyword) {
      qb.andWhere('(category.name LIKE :kw OR category.code LIKE :kw)', {
        kw: `%${query.keyword}%`,
      });
    }
    if (query.status) {
      qb.andWhere('category.status = :status', { status: query.status });
    }

    qb.orderBy(`category.${query.sortBy || 'sortOrder'}`, query.sortOrder || 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<JobCategory> {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Job category not found');
    return category;
  }

  async update(id: string, dto: UpdateJobCategoryDto): Promise<JobCategory> {
    const category = await this.findOne(id);
    if (dto.code && dto.code !== category.code) {
      const existed = await this.repo.findOne({ where: { code: dto.code } });
      if (existed) throw new ConflictException('Job category code already exists');
    }
    Object.assign(category, dto);
    const saved = await this.repo.save(category);
    await this.cacheHelper.invalidateJobCategoriesList();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    const ordersCount = await this.repo.manager
      .getRepository('LaborOrder')
      .count({ where: { jobCategoryId: id } });
    if (ordersCount > 0) {
      throw new BadRequestException('Cannot delete job category already used by labor orders');
    }
    await this.repo.remove(category);
    await this.cacheHelper.invalidateJobCategoriesList();
  }
}
