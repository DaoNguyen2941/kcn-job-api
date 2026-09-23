import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { LaborOrderWorker } from './labor-order-worker.entity';
import { CreateLaborOrderWorkerDto } from './dto/create-labor-order-worker.dto';
import { UpdateLaborOrderWorkerDto } from './dto/update-labor-order-worker.dto';
import { QueryLaborOrderWorkerDto } from './dto/query-labor-order-worker.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { LaborOrderWorkerStatus } from '../../common/enums/labor-order-worker-status.enum';
import { LaborOrdersService } from '../labor-orders/labor-orders.service';

@Injectable()
export class LaborOrderWorkersService {
  constructor(
    @InjectRepository(LaborOrderWorker)
    private readonly repo: Repository<LaborOrderWorker>,
    private readonly laborOrdersService: LaborOrdersService,
  ) {}

  async create(dto: CreateLaborOrderWorkerDto): Promise<LaborOrderWorker> {
    const existed = await this.repo.findOne({
      where: { laborOrderId: dto.laborOrderId, candidateId: dto.candidateId },
    });
    if (existed) {
      throw new ConflictException(
        'This candidate has already been recorded for this labor order',
      );
    }

    const entity = this.repo.create({
      ...dto,
      status: dto.status ?? LaborOrderWorkerStatus.SUPPLIED,
      suppliedAt: dto.suppliedAt ? new Date(dto.suppliedAt) : new Date(),
      startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
    });

    try {
      const saved = await this.repo.save(entity);
      await this.laborOrdersService.syncStatusFromProgress(dto.laborOrderId);
      return saved;
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'This candidate has already been recorded for this labor order',
        );
      }
      throw err;
    }
  }

  async findAll(query: QueryLaborOrderWorkerDto): Promise<PaginatedResult<LaborOrderWorker>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.candidate', 'candidate')
      .leftJoinAndSelect('w.laborOrder', 'order');

    if (query.laborOrderId) qb.andWhere('w.laborOrderId = :id', { id: query.laborOrderId });
    if (query.candidateId) qb.andWhere('w.candidateId = :cid', { cid: query.candidateId });
    if (query.status) qb.andWhere('w.status = :status', { status: query.status });

    qb.orderBy(`w.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<LaborOrderWorker> {
    const worker = await this.repo.findOne({
      where: { id },
      relations: ['candidate', 'laborOrder'],
    });
    if (!worker) throw new NotFoundException('Labor order worker record not found');
    return worker;
  }

  async update(id: string, dto: UpdateLaborOrderWorkerDto): Promise<LaborOrderWorker> {
    const worker = await this.findOne(id);
    if (dto.status) worker.status = dto.status;
    if (dto.suppliedAt !== undefined) worker.suppliedAt = new Date(dto.suppliedAt);
    if (dto.startedAt !== undefined) worker.startedAt = new Date(dto.startedAt);
    if (dto.note !== undefined) worker.note = dto.note;

    // Auto-stamp startedAt when moving to STARTED if not explicitly provided.
    if (dto.status === LaborOrderWorkerStatus.STARTED && !worker.startedAt) {
      worker.startedAt = new Date();
    }

    const saved = await this.repo.save(worker);
    await this.laborOrdersService.syncStatusFromProgress(worker.laborOrderId);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const worker = await this.findOne(id);
    const laborOrderId = worker.laborOrderId;
    await this.repo.remove(worker);
    await this.laborOrdersService.syncStatusFromProgress(laborOrderId);
  }
}
