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

export async function testHealthcheck(req: any) {
  try {
    await req
      .get('/api/healthcheck')
      .expect(200)
      .expect('<h1>HealthCheck</h1><h3>server is alive</h3>');
  } catch (error) {
    throw new Error(
      'HealthCheck Error: Make sure that docker-compose is up and devcontainer is connected to its network',
    );
  }
}
