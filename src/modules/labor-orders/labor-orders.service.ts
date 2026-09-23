import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaborOrder } from './labor-order.entity';
import { CreateLaborOrderDto } from './dto/create-labor-order.dto';
import { UpdateLaborOrderDto } from './dto/update-labor-order.dto';
import { QueryLaborOrderDto } from './dto/query-labor-order.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { CacheHelperService } from '../../common/cache/cache-helper.service';
import { buildLaborOrderCode, buildSlug } from '../../common/utils/slug.util';
import {
  LABOR_ORDER_TRANSITIONS,
  LaborOrderStatus,
} from '../../common/enums/labor-order-status.enum';
import { LaborOrderWorkerStatus } from '../../common/enums/labor-order-worker-status.enum';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';

export interface LaborOrderProgress {
  quantityRequired: number;
  supplied: number;
  started: number;
  cancelled: number;
  noShow: number;
  remaining: number;
}

@Injectable()
export class LaborOrdersService {
  constructor(
    @InjectRepository(LaborOrder)
    private readonly repo: Repository<LaborOrder>,
    @InjectRepository(LaborOrderWorker)
    private readonly workerRepo: Repository<LaborOrderWorker>,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async create(dto: CreateLaborOrderDto): Promise<LaborOrder> {
    let code = dto.code;
    if (code) {
      const existed = await this.repo.findOne({ where: { code } });
      if (existed) throw new ConflictException('Labor order code already exists');
    } else {
      code = buildLaborOrderCode();
    }

    const entity = this.repo.create({
      ...dto,
      code,
      slug: buildSlug(dto.title),
      salaryMin: dto.salaryMin !== undefined ? String(dto.salaryMin) : null,
      salaryMax: dto.salaryMax !== undefined ? String(dto.salaryMax) : null,
      status: LaborOrderStatus.DRAFT,
    } as Partial<LaborOrder>);

    const saved = await this.repo.save(entity);
    await this.cacheHelper.invalidateOnLaborOrderChange();
    return saved;
  }

  async findAll(query: QueryLaborOrderDto): Promise<PaginatedResult<LaborOrder>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.company', 'company')
      .leftJoinAndSelect('order.industrialZone', 'zone')
      .leftJoinAndSelect('order.jobCategory', 'category');

    if (query.keyword) {
      qb.andWhere('(order.title LIKE :kw OR order.code LIKE :kw)', { kw: `%${query.keyword}%` });
    }
    if (query.companyId) qb.andWhere('order.companyId = :companyId', { companyId: query.companyId });
    if (query.industrialZoneId)
      qb.andWhere('order.industrialZoneId = :zoneId', { zoneId: query.industrialZoneId });
    if (query.jobCategoryId)
      qb.andWhere('order.jobCategoryId = :categoryId', { categoryId: query.jobCategoryId });
    if (query.status) qb.andWhere('order.status = :status', { status: query.status });
    if (query.employmentType)
      qb.andWhere('order.employmentType = :employmentType', { employmentType: query.employmentType });
    if (query.workShift) qb.andWhere('order.workShift = :workShift', { workShift: query.workShift });
    if (query.gender) qb.andWhere('order.genderRequirement = :gender', { gender: query.gender });
    if (query.salaryMin !== undefined)
      qb.andWhere('order.salaryMax >= :salaryMin', { salaryMin: query.salaryMin });
    if (query.salaryMax !== undefined)
      qb.andWhere('order.salaryMin <= :salaryMax', { salaryMax: query.salaryMax });
    if (query.isPublic !== undefined)
      qb.andWhere('order.isPublic = :isPublic', { isPublic: query.isPublic === 'true' });

    qb.orderBy(`order.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<LaborOrder> {
    const order = await this.repo.findOne({
      where: { id },
      relations: ['company', 'industrialZone', 'jobCategory', 'requirements'],
    });
    if (!order) throw new NotFoundException('Labor order not found');
    return order;
  }

  async update(id: string, dto: UpdateLaborOrderDto): Promise<LaborOrder> {
    const order = await this.findOne(id);
    if (dto.code && dto.code !== order.code) {
      const existed = await this.repo.findOne({ where: { code: dto.code } });
      if (existed) throw new ConflictException('Labor order code already exists');
    }
    const { salaryMin, salaryMax, title, ...rest } = dto;
    Object.assign(order, rest);
    if (salaryMin !== undefined) order.salaryMin = String(salaryMin);
    if (salaryMax !== undefined) order.salaryMax = String(salaryMax);
    if (title && title !== order.title) {
      order.title = title;
      order.slug = buildSlug(title);
    }
    const saved = await this.repo.save(order);
    await this.cacheHelper.invalidateOnLaborOrderChange(saved.slug);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    const workersCount = await this.workerRepo.count({ where: { laborOrderId: id } });
    if (workersCount > 0) {
      throw new BadRequestException('Cannot delete labor order that already has supplied workers');
    }
    await this.repo.remove(order);
    await this.cacheHelper.invalidateOnLaborOrderChange(order.slug);
  }

  async getProgress(id: string): Promise<LaborOrderProgress> {
    const order = await this.findOne(id);
    const rows = await this.workerRepo
      .createQueryBuilder('w')
      .select('w.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('w.laborOrderId = :id', { id })
      .groupBy('w.status')
      .getRawMany<{ status: LaborOrderWorkerStatus; count: string }>();

    const counts: Record<LaborOrderWorkerStatus, number> = {
      [LaborOrderWorkerStatus.SUPPLIED]: 0,
      [LaborOrderWorkerStatus.STARTED]: 0,
      [LaborOrderWorkerStatus.CANCELLED]: 0,
      [LaborOrderWorkerStatus.NO_SHOW]: 0,
    };
    rows.forEach((r) => (counts[r.status] = parseInt(r.count, 10)));

    const activeSupplied = counts.SUPPLIED + counts.STARTED;
    return {
      quantityRequired: order.quantityRequired,
      supplied: activeSupplied,
      started: counts.STARTED,
      cancelled: counts.CANCELLED,
      noShow: counts.NO_SHOW,
      remaining: Math.max(order.quantityRequired - activeSupplied, 0),
    };
  }

  /** Generic guarded status transition, shared by all action endpoints. */
  private async transition(
    id: string,
    target: LaborOrderStatus,
    note?: string,
  ): Promise<LaborOrder> {
    const order = await this.findOne(id);
    const allowed = LABOR_ORDER_TRANSITIONS[order.status];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `Cannot move labor order from ${order.status} to ${target}`,
      );
    }
    order.status = target;
    if (note) order.note = note;
    if (target === LaborOrderStatus.CLOSED) order.closedAt = new Date();
    const saved = await this.repo.save(order);
    await this.cacheHelper.invalidateOnLaborOrderChange(saved.slug);
    return saved;
  }

  confirm(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.CONFIRMED, note);
  }

  startRecruiting(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.RECRUITING, note);
  }

  pause(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.PAUSED, note);
  }

  resume(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.RECRUITING, note);
  }

  close(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.CLOSED, note);
  }

  cancel(id: string, note?: string) {
    return this.transition(id, LaborOrderStatus.CANCELLED, note);
  }

  /**
   * Recomputes and auto-syncs status between RECRUITING / PARTIALLY_FILLED /
   * FULFILLED based on current worker counts. Called after labor_order_workers
   * change (see LaborOrderWorkersService).
   */
  async syncStatusFromProgress(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (
      ![
        LaborOrderStatus.RECRUITING,
        LaborOrderStatus.PARTIALLY_FILLED,
        LaborOrderStatus.FULFILLED,
      ].includes(order.status)
    ) {
      return;
    }
    const progress = await this.getProgress(id);
    let nextStatus = order.status;
    if (progress.supplied === 0) nextStatus = LaborOrderStatus.RECRUITING;
    else if (progress.supplied < progress.quantityRequired) nextStatus = LaborOrderStatus.PARTIALLY_FILLED;
    else nextStatus = LaborOrderStatus.FULFILLED;

    if (nextStatus !== order.status) {
      order.status = nextStatus;
      await this.repo.save(order);
      await this.cacheHelper.invalidateOnLaborOrderChange(order.slug);
    }
  }
}
