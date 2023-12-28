import * as request from 'supertest';
import Redis from 'ioredis';
import { APP_URL, createRedisClient, PORT } from './common';

describe('REST proxy api (e2e)', () => {
  const req = request(APP_URL);
  let redis: Redis;

  beforeAll(async () => {
    redis = createRedisClient();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('GET /api/films/1/', async () => {
    const response = await req.get('/api/films/1/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.title).toBe('A New Hope');
  });

  it('GET /api/species/1/', async () => {
    const response = await req.get('/api/species/1/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('Human');
  });

  it('GET /api/vehicles/4/', async () => {
    const response = await req.get('/api/vehicles/4/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('Sand Crawler');
    expect(body.model).toBe('Digger Crawler');
    expect(body.url).toBe(APP_URL + '/api/vehicles/4/');
  });

  it('GET /api/starships/2/', async () => {
    const response = await req.get('/api/starships/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('CR90 corvette');
    expect(body.model).toBe('CR90 corvette');
    expect(body.url).toBe(APP_URL + '/api/starships/2/');
  });

  it('GET /api/people/2/', async () => {
    const response = await req.get('/api/people/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('C-3PO');
    expect(body.height).toBe('167');
    expect(body.url).toBe(APP_URL + '/api/people/2/');
  });

  it('GET /api/planets/2/', async () => {
    const response = await req.get('/api/planets/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('Alderaan');
    expect(body.rotation_period).toBe('24');
    expect(body.url).toBe(APP_URL + '/api/planets/2/');
  });

  it('GET /api/planets', async () => {
    const response = await req.get('/api/planets');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.count).toBe(60);
    expect(body.next).toBe(APP_URL + '/api/planets/?page=2');
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBe('Tatooine');
  });

  function getKey(relativeUrl: string): string {
    return `:${PORT}${relativeUrl}`;
  }

  //skipped because it takes too long
  it.skip('GET /api/planets?page=3 - clears cache', async () => {
    const relative_url = '/api/planets/?page=3';
    const key = getKey(relative_url);
    await redis.del(key);

    const response = await req.get(relative_url);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.count).toBe(60);
    expect(body.next).toBe(APP_URL + '/api/planets/?page=4');
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBe('Eriadu');
  });

  it('GET /api/planets?page=4 - test caching', async () => {
    const relative_url = '/api/planets/?page=4';
    const key = getKey(relative_url);
    const dummyObj = { dummy: 'my dummy data' };
    await redis.set(key, JSON.stringify(dummyObj));

    const response = await req.get(relative_url);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body).toStrictEqual(dummyObj);
  });

  //skipped because it takes too long
  it.skip('GET /api/films/1000/ - test error forwarding', async () => {
    const response = await req.get('/api/films/1000/');
    expect(response.statusCode).toBe(404);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toBe('Request failed with status code 404');
  });
});
