import * as Joi from 'joi';

export const validationSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'log', 'debug', 'verbose')
    .default('debug'),
  DISABLE_LOGS: Joi.number().valid(0, 1).default(0),
  SWAPI_URL: Joi.string().uri().default('https://swapi.dev'),
  SWAPI_PROXY_URL: Joi.string().uri().required(),
  PORT: Joi.number().required(),
  TIMEOUT_MILLISECONDS: Joi.number().default(500),
  REDIS_TTL_MS_INTERCEPTOR: Joi.number().default(3 * 1000),
  REDIS_TTL_MS: Joi.number().default(24 * 60 * 60 * 1000),
});

export const TIMEOUT_MILLISECONDS = 'TIMEOUT_MILLISECONDS';
export const REDIS_PORT = 'REDIS_PORT';
export const REDIS_HOST = 'REDIS_HOST';
export const PORT = 'PORT';
export const REDIS_TTL_MS_INTERCEPTOR = 'REDIS_TTL_MS_INTERCEPTOR';
export const REDIS_TTL_MS = 'REDIS_TTL_MS';
export const SWAPI_URL = 'SWAPI_URL';
export const SWAPI_PROXY_URL = 'SWAPI_PROXY_URL';
