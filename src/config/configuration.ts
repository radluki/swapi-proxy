import * as Joi from 'joi';

export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  logLevel: process.env.LOG_LEVEL,
  disableLogs: process.env.DISABLE_LOGS === '1',
  swapiUrl: process.env.SWAPI_URL,
  swapiProxyUrl: process.env.SWAPI_PROXY_URL,
});

export const envVariablesValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'log', 'debug', 'verbose')
    .default('debug'),
  DISABLE_LOGS: Joi.number().valid(0, 1).default(0),
  SWAPI_URL: Joi.string().uri().default('https://swapi.dev'),
  SWAPI_PROXY_URL: Joi.string().uri().required(),
  PORT: Joi.number().required(),
});
