import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { CacheKeys } from './cache-keys';

/**
 * Domain-level cache invalidation helper. Called by admin write actions on
 * labor-orders / job-categories / industrial-zones / recruitment-posts so
 * public read endpoints never serve stale data for longer than its TTL.
 */
@Injectable()
export class CacheHelperService {
  constructor(private readonly redis: RedisService) {}

  async invalidateJobsList(): Promise<void> {
    await this.redis.delByPattern(CacheKeys.jobListPattern());
  }

  async invalidateJobDetail(slug?: string): Promise<void> {
    if (slug) {
      await this.redis.del(CacheKeys.jobDetail(slug));
    } else {
      await this.redis.delByPattern(CacheKeys.jobDetailPattern());
    }
  }

  async invalidateJobCategoriesList(): Promise<void> {
    await this.redis.del(CacheKeys.jobCategoriesList());
  }

  async invalidateIndustrialZonesList(): Promise<void> {
    await this.redis.del(CacheKeys.industrialZonesList());
  }

  async invalidateDashboard(): Promise<void> {
    await this.redis.del(CacheKeys.dashboardStats());
  }

  /** Called whenever a labor order changes (created/updated/status/deleted). */
  async invalidateOnLaborOrderChange(slug?: string): Promise<void> {
    await Promise.all([
      this.invalidateJobsList(),
      this.invalidateJobDetail(slug),
      this.invalidateDashboard(),
    ]);
  }
}
