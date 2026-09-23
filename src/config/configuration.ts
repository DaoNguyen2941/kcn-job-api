export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigin: (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim()),

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || 'kcnjob',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '900', 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800', 10) ,
  },

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10),

  cacheTtl: {
    jobList: parseInt(process.env.CACHE_TTL_JOB_LIST ?? '60', 10),
    jobDetail: parseInt(process.env.CACHE_TTL_JOB_DETAIL ?? '120', 10),
    categoryList: parseInt(process.env.CACHE_TTL_CATEGORY_LIST ?? '300', 10),
    zoneList: parseInt(process.env.CACHE_TTL_ZONE_LIST ?? '300', 10),
    dashboard: parseInt(process.env.CACHE_TTL_DASHBOARD ?? '30', 10),
  },

  throttleLogin: {
    ttl: parseInt(process.env.THROTTLE_LOGIN_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LOGIN_LIMIT ?? '5', 10),
  },

  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeMe123!',
});
