import Redis from 'ioredis';

export const APP_DOMAIN = process.env.DOCKER === '1' ? 'app' : 'localhost';
export const REDIS_DOMAIN = process.env.DOCKER === '1' ? 'redis' : 'localhost';
export const PORT = process.env.PORT || 3000;
export const APP_URL = `http://${APP_DOMAIN}:${PORT}`;

export function createRedisClient() {
  return new Redis({
    host: REDIS_DOMAIN,
    port: 6379,
  });
}
