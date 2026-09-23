import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { JobCategory } from '../job-categories/job-category.entity';
import { IndustrialZone } from '../industrial-zones/industrial-zone.entity';
import { QueryPublicJobDto } from './dto/query-public-job.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { PublicJobResponseDto } from './public-job-response.dto';
import { RedisService } from '../../redis/redis.service';
import { CacheKeys } from '../../common/cache/cache-keys';
import { PUBLIC_VISIBLE_LABOR_ORDER_STATUSES } from '../../common/enums/public-visible-status';
import { CommonStatus } from '../../common/enums/common-status.enum';

@Injectable()
export class PublicJobsService {
  constructor(
    @InjectRepository(LaborOrder)
    private readonly laborOrderRepo: Repository<LaborOrder>,
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepo: Repository<JobCategory>,
    @InjectRepository(IndustrialZone)
    private readonly industrialZoneRepo: Repository<IndustrialZone>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private toPublicDto(order: LaborOrder): PublicJobResponseDto {
    return {
      id: order.id,
      slug: order.slug,
      title: order.title,
      quantityRequired: order.quantityRequired,
      employmentType: order.employmentType,
      salaryMin: order.salaryMin,
      salaryMax: order.salaryMax,
      salaryDescription: order.salaryDescription,
      workLocation: order.workLocation,
      startDate: order.startDate,
      deadline: order.deadline,
      genderRequirement: order.genderRequirement,
      ageMin: order.ageMin,
      ageMax: order.ageMax,
      experienceRequirement: order.experienceRequirement,
      educationRequirement: order.educationRequirement,
      workShift: order.workShift,
      accommodation: order.accommodation,
      mealSupport: order.mealSupport,
      transportSupport: order.transportSupport,
      description: order.description,
      requirementsDescription: order.requirementsDescription,
      status: order.status,
      companyName: order.company?.name ?? null,
      industrialZoneName: order.industrialZone?.name ?? null,
      province: order.industrialZone?.province ?? null,
      district: order.industrialZone?.district ?? null,
      jobCategoryName: order.jobCategory?.name ?? null,
      createdAt: order.createdAt,
    };
  }

  async findAll(query: QueryPublicJobDto): Promise<PaginatedResult<PublicJobResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const cacheKey = CacheKeys.jobList(CacheKeys.hashQuery(query as Record<string, unknown>));
    const cached = await this.redisService.getJson<PaginatedResult<PublicJobResponseDto>>(cacheKey);
    if (cached) return cached;

    const qb = this.laborOrderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.company', 'company')
      .leftJoinAndSelect('order.industrialZone', 'zone')
      .leftJoinAndSelect('order.jobCategory', 'category')
      .where('order.isPublic = :isPublic', { isPublic: true })
      .andWhere('order.status IN (:...statuses)', {
        statuses: PUBLIC_VISIBLE_LABOR_ORDER_STATUSES,
      });

    if (query.keyword) {
      qb.andWhere('(order.title LIKE :kw OR order.description LIKE :kw)', {
        kw: `%${query.keyword}%`,
      });
    }
    if (query.job_category_id) {
      qb.andWhere('order.jobCategoryId = :categoryId', { categoryId: query.job_category_id });
    }
    if (query.industrial_zone_id) {
      qb.andWhere('order.industrialZoneId = :zoneId', { zoneId: query.industrial_zone_id });
    }
    if (query.province) {
      qb.andWhere('zone.province = :province', { province: query.province });
    }
    if (query.district) {
      qb.andWhere('zone.district = :district', { district: query.district });
    }
    if (query.employment_type) {
      qb.andWhere('order.employmentType = :employmentType', {
        employmentType: query.employment_type,
      });
    }
    if (query.work_shift) {
      qb.andWhere('order.workShift = :workShift', { workShift: query.work_shift });
    }
    if (query.gender) {
      qb.andWhere('(order.genderRequirement = :gender OR order.genderRequirement = :any)', {
        gender: query.gender,
        any: 'ANY',
      });
    }
    if (query.salary_min !== undefined) {
      qb.andWhere('(order.salaryMax IS NULL OR order.salaryMax >= :salaryMin)', {
        salaryMin: query.salary_min,
      });
    }
    if (query.salary_max !== undefined) {
      qb.andWhere('(order.salaryMin IS NULL OR order.salaryMin <= :salaryMax)', {
        salaryMax: query.salary_max,
      });
    }

    const sortBy = query.sortBy || 'createdAt';
    qb.orderBy(`order.${sortBy}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const data = rows.map((r) => this.toPublicDto(r));
    const result = new PaginatedResult(data, total, page, limit);

    await this.redisService.setJson(cacheKey, result, this.configService.get('cacheTtl.jobList'));
    return result;
  }

  async findBySlug(slug: string): Promise<PublicJobResponseDto> {
    const cacheKey = CacheKeys.jobDetail(slug);
    const cached = await this.redisService.getJson<PublicJobResponseDto>(cacheKey);
    if (cached) return cached;

    const order = await this.laborOrderRepo.findOne({
      where: { slug },
      relations: ['company', 'industrialZone', 'jobCategory'],
    });

    if (
      !order ||
      !order.isPublic ||
      !PUBLIC_VISIBLE_LABOR_ORDER_STATUSES.includes(order.status)
    ) {
      throw new NotFoundException('Job not found');
    }

    const dto = this.toPublicDto(order);
    await this.redisService.setJson(cacheKey, dto, this.configService.get('cacheTtl.jobDetail'));
    return dto;
  }

  async findJobCategories() {
    const cacheKey = CacheKeys.jobCategoriesList();
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

    const categories = await this.jobCategoryRepo.find({
      where: { status: CommonStatus.ACTIVE },
      order: { sortOrder: 'ASC' },
    });
    const data = categories.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      description: c.description,
    }));

    await this.redisService.setJson(cacheKey, data, this.configService.get('cacheTtl.categoryList'));
    return data;
  }

  async findIndustrialZones() {
    const cacheKey = CacheKeys.industrialZonesList();
    const cached = await this.redisService.getJson(cacheKey);
    if (cached) return cached;

    const zones = await this.industrialZoneRepo.find({
      where: { status: CommonStatus.ACTIVE },
      order: { name: 'ASC' },
    });
    const data = zones.map((z) => ({
      id: z.id,
      name: z.name,
      code: z.code,
      province: z.province,
      district: z.district,
    }));

    await this.redisService.setJson(cacheKey, data, this.configService.get('cacheTtl.zoneList'));
    return data;
  }
}
