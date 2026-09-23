import * as crypto from 'crypto';

/**
 * Central place for all Redis cache key patterns so invalidation logic
 * stays consistent across modules.
 */
export const CacheKeys = {
  jobList: (queryHash: string) => `jobs:list:${queryHash}`,
  jobListPattern: () => 'jobs:list:*',
  jobDetail: (slug: string) => `job:${slug}`,
  jobDetailPattern: () => 'job:*',
  jobCategoriesList: () => 'job-categories:list',
  industrialZonesList: () => 'industrial-zones:list',
  dashboardStats: () => 'dashboard:stats',

  hashQuery(query: Record<string, unknown>): string {
    const normalized = JSON.stringify(
      Object.keys(query)
        .sort()
        .reduce((acc, key) => {
          acc[key] = query[key];
          return acc;
        }, {} as Record<string, unknown>),
    );
    return crypto.createHash('md5').update(normalized).digest('hex');
  },
};
