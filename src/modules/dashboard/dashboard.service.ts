import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';
import { LaborOrderStatus } from '../../common/enums/labor-order-status.enum';
import { LaborOrderWorkerStatus } from '../../common/enums/labor-order-worker-status.enum';
import { RedisService } from '../../redis/redis.service';
import { CacheKeys } from '../../common/cache/cache-keys';

export interface DashboardStats {
  totalCompanies: number;
  totalLaborOrders: number;
  recruitingLaborOrders: number;
  fulfilledLaborOrders: number;
  understaffedLaborOrders: number;
  totalQuantityRequired: number;
  totalSupplied: number;
  totalStarted: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(LaborOrder)
    private readonly laborOrderRepo: Repository<LaborOrder>,
    @InjectRepository(LaborOrderWorker)
    private readonly workerRepo: Repository<LaborOrderWorker>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const cacheKey = CacheKeys.dashboardStats();
    const cached = await this.redisService.getJson<DashboardStats>(cacheKey);
    if (cached) return cached;

    const [totalCompanies, totalLaborOrders, recruitingLaborOrders, fulfilledLaborOrders] =
      await Promise.all([
        this.companyRepo.count(),
        this.laborOrderRepo.count(),
        this.laborOrderRepo.count({
          where: [
            { status: LaborOrderStatus.RECRUITING },
            { status: LaborOrderStatus.PARTIALLY_FILLED },
          ],
        }),
        this.laborOrderRepo.count({ where: { status: LaborOrderStatus.FULFILLED } }),
      ]);

    const totalQuantityRequiredRaw = await this.laborOrderRepo
      .createQueryBuilder('order')
      .select('SUM(order.quantityRequired)', 'sum')
      .getRawOne<{ sum: string | null }>();
    const totalQuantityRequired = parseInt(totalQuantityRequiredRaw?.sum ?? '0', 10);

    const workerCountsRaw = await this.workerRepo
      .createQueryBuilder('w')
      .select('w.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('w.status')
      .getRawMany<{ status: LaborOrderWorkerStatus; count: string }>();

    let totalSupplied = 0;
    let totalStarted = 0;
    workerCountsRaw.forEach((row) => {
      const count = parseInt(row.count, 10);
      if (row.status === LaborOrderWorkerStatus.SUPPLIED || row.status === LaborOrderWorkerStatus.STARTED) {
        totalSupplied += count;
      }
      if (row.status === LaborOrderWorkerStatus.STARTED) {
        totalStarted += count;
      }
    });

    // Understaffed: RECRUITING / PARTIALLY_FILLED orders whose supplied count < required.
    const activeOrders = await this.laborOrderRepo.find({
      where: [
        { status: LaborOrderStatus.RECRUITING },
        { status: LaborOrderStatus.PARTIALLY_FILLED },
      ],
      select: ['id', 'quantityRequired'],
    });
    let understaffedLaborOrders = 0;
    if (activeOrders.length > 0) {
      const suppliedByOrderRaw = await this.workerRepo
        .createQueryBuilder('w')
        .select('w.laborOrderId', 'laborOrderId')
        .addSelect('COUNT(*)', 'count')
        .where('w.status IN (:...statuses)', {
          statuses: [LaborOrderWorkerStatus.SUPPLIED, LaborOrderWorkerStatus.STARTED],
        })
        .groupBy('w.laborOrderId')
        .getRawMany<{ laborOrderId: string; count: string }>();
      const suppliedMap = new Map(
        suppliedByOrderRaw.map((r) => [r.laborOrderId, parseInt(r.count, 10)]),
      );
      understaffedLaborOrders = activeOrders.filter(
        (o) => (suppliedMap.get(o.id) ?? 0) < o.quantityRequired,
      ).length;
    }

    const stats: DashboardStats = {
      totalCompanies,
      totalLaborOrders,
      recruitingLaborOrders,
      fulfilledLaborOrders,
      understaffedLaborOrders,
      totalQuantityRequired,
      totalSupplied,
      totalStarted,
    };

    await this.redisService.setJson(cacheKey, stats, this.configService.get('cacheTtl.dashboard'));
    return stats;
  }
}
