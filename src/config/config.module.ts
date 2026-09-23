import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration'

export const UseConfigModule = ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    load: [configuration],
    validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().required().default(3002),
        API_PREFIX: Joi.string().required(),
        CORS_ORIGIN: Joi.string().required(),

        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

        BCRYPT_ROUNDS: Joi.number().required(),

        CACHE_TTL_JOB_LIST: Joi.number().required(),
        CACHE_TTL_JOB_DETAIL: Joi.number().required(),
        CACHE_TTL_CATEGORY_LIST: Joi.number().required(),
        CACHE_TTL_ZONE_LIST: Joi.number().required(),
        CACHE_TTL_DASHBOARD: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required().default(6379),
        REDIS_PASSWORD: Joi.string().options,

        THROTTLE_LOGIN_TTL: Joi.number(),
        THROTTLE_LOGIN_LIMIT: Joi.number(),

        DEFAULT_ADMIN_PASSWORD: Joi.string().required(),
    })

})