import Redis from 'ioredis';

export const APP_DOMAIN = process.env.DOCKER === '1' ? 'app' : 'localhost';
export const REDIS_DOMAIN = process.env.DOCKER === '1' ? 'redis' : 'localhost';
export const APP_URL = `http://${APP_DOMAIN}:3000`;

export function createRedisClient() {
  return new Redis({
    host: REDIS_DOMAIN,
    port: 6379,
  });
}

export function maybeFlushRedis(redis: Redis) {
  if (process.env.FLUSHDB === '1') {
    redis.flushdb().then(() => {
      console.log('All keys in the current database have been deleted');
    });
  }
}