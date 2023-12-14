import * as request from 'supertest';
import Redis from 'ioredis';

const APP_DOMAIN = process.env.DOCKER === '1' ? 'app' : 'localhost';
const REDIS_DOMAIN = process.env.DOCKER === '1' ? 'redis' : 'localhost';

describe('AppController (e2e)', () => {
  let APP_URL = `http://${APP_DOMAIN}:3000`;
  let req = request(APP_URL);
  let redis: Redis;

  function printInstructions() {
    console.log(
      `APP_URL: ${APP_URL}\nREDIS_DOMAIN: ${REDIS_DOMAIN}\n\n` +
        `[LOCALHOST-INFO] If test run from outside docker the test uses exported ports:\n` +
        `\t- make sure that docker-compose is up\n\n` +
        `[DOCKER-INFO] If test run from inside docker:\n` +
        `\t- pass DOCKER=1\n` +
        `\t- make sure that docker-compose is up and devcontainer is connected to its network\n\n` +
        `[COMMON] Pass FLUSHDB=1 to clean cache before running tests\n` +
        'Some tests clean cache by themselves, but not all just for the sake of execution speed\n',
    );
  }

  beforeAll(async () => {
    printInstructions();

    redis = new Redis({
      host: REDIS_DOMAIN,
      port: 6379,
    });

    if (process.env.FLUSHDB === '1') {
      redis.flushdb().then(() => {
        console.log('All keys in the current database have been deleted');
      });
    }
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('GET /api/healthcheck', async () => {
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
    expect(body.url).toBe('https://swapi.dev/api/vehicles/4/');
  });

  it('GET /api/starships/2/', async () => {
    const response = await req.get('/api/starships/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('CR90 corvette');
    expect(body.model).toBe('CR90 corvette');
    expect(body.url).toBe('https://swapi.dev/api/starships/2/');
  });

  it('GET /api/people/2/', async () => {
    const response = await req.get('/api/people/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('C-3PO');
    expect(body.height).toBe('167');
    expect(body.url).toBe('https://swapi.dev/api/people/2/');
  });

  it('GET /api/planets/2/', async () => {
    const response = await req.get('/api/planets/2/');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.name).toBe('Alderaan');
    expect(body.rotation_period).toBe('24');
    expect(body.url).toBe('https://swapi.dev/api/planets/2/');
  });

  it('GET /api/planets', async () => {
    const response = await req.get('/api/planets');
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.count).toBe(60);
    expect(body.next).toBe('https://swapi.dev/api/planets/?page=2');
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBe('Tatooine');
  });

  it('GET /api/planets?page=3 - clears cache', async () => {
    const relative_url = '/api/planets/?page=3';
    await redis.del(relative_url);

    const response = await req.get(relative_url);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body.count).toBe(60);
    expect(body.next).toBe('https://swapi.dev/api/planets/?page=4');
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].name).toBe('Eriadu');
  });

  it('GET /api/planets?page=4 - test caching', async () => {
    const relative_url = '/api/planets/?page=3';
    const dummyObj = { dummy: 'my dummy data' };
    await redis.set(relative_url, JSON.stringify(dummyObj));

    const response = await req.get(relative_url);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.text);
    expect(body).toStrictEqual(dummyObj);
  });

  it('GET /api/films/1000/ - test error forwarding', async () => {
    const response = await req.get('/api/films/1000/');
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe(
      'ErrorForward: Request failed with status code 404',
    );
  });
});
