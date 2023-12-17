import * as request from 'supertest';
import Redis from 'ioredis';
import { APP_URL, createRedisClient, maybeFlushRedis } from './common';

describe('Tests for custom endpoints (e2e)', () => {
  const req = request(APP_URL);
  let redis: Redis;

  beforeAll(async () => {
    redis = createRedisClient();
    maybeFlushRedis(redis);
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('GET /api/films/opening-crawls/word-counts', async () => {
    const response = await req.get('/api/films/opening-crawls/word-counts');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.republic).toBe(6);
    expect(body.battleships).toBe(1);
    expect(body.capital).toBe(2);
  });

  it('GET /api/films/opening-crawls/people/most-appearances', async () => {
    const url = '/api/films/opening-crawls/people/most-appearances';
    const response = await req.get(url);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.length).toBe(2);
    expect(body).toContain('dooku');
    expect(body).toContain('luke skywalker');
  });
});
