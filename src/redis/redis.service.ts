import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

/**
 * Thin wrapper around ioredis used both for:
 *  - Auth: refresh token session storage (auth:refresh:{adminId}:{tokenId})
 *  - Cache: public read-heavy data (jobs:list:*, job:*, job-categories:list, industrial-zones:list)
 *  - Dashboard statistics cache
 *
 * Redis is never the source of truth for business data - only a cache / session store.
 */
@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    if (keys.length === 0) return;
    await this.client.del(...keys);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  /** Delete every key matching a pattern (used for cache invalidation on write). */
  async delByPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    const keysToDelete: string[] = [];
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (keys: string[]) => keysToDelete.push(...keys));
      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });
    if (keysToDelete.length > 0) {
      await this.client.del(...keysToDelete);
    }
  }
}
