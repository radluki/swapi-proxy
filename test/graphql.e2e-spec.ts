import * as request from 'supertest';
import Redis from 'ioredis';
import { APP_URL, createRedisClient } from './common';

describe('GraphQl api (e2e)', () => {
  const req = request(APP_URL);
  let redis: Redis;

  beforeAll(async () => {
    redis = createRedisClient();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it('people simple', async () => {
    const QUERY = '{ swapi { people { count next results { name } } } }';
    const resp = await req.post('/graphql').send({
      query: QUERY,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.data).toBeDefined();
    const data = resp.body.data.swapi;
    expect(data).toBeDefined();
    expect(data.people).toBeDefined();
    expect(data.people.count).toBe(82);
    expect(data.people.results).toBeDefined();
    expect(data.people.next).toBeDefined();
    expect(data.people.next).toBe(`${APP_URL}/api/people/?page=2`);
    expect(data.people.results.length).toBe(10);
    const firstPerson = data.people.results[0];
    expect(firstPerson).toStrictEqual({ name: 'Luke Skywalker' });
  });

  it('people second page', async () => {
    const QUERY =
      '{ swapi { people(page: 2) { count next results { name } } } }';
    const resp = await req.post('/graphql').send({
      query: QUERY,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.data).toBeDefined();
    const data = resp.body.data.swapi;
    expect(data).toBeDefined();
    expect(data.people).toBeDefined();
    expect(data.people.count).toBe(82);
    expect(data.people.results).toBeDefined();
    expect(data.people.next).toBeDefined();
    expect(data.people.next).toBe(`${APP_URL}/api/people/?page=3`);
    expect(data.people.results.length).toBe(10);
    const firstPerson = data.people.results[0];
    expect(firstPerson).toStrictEqual({ name: 'Anakin Skywalker' });
  });

  it('people query name', async () => {
    const QUERY =
      '{ swapi { people(name: "Skywalker") { count next results { name } } } }';
    const resp = await req.post('/graphql').send({
      query: QUERY,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.data).toBeDefined();
    const data = resp.body.data.swapi;
    expect(data).toBeDefined();
    expect(data.people).toBeDefined();
    expect(data.people.count).toBe(3);
    expect(data.people.results).toBeDefined();
    expect(data.people.next).toBeDefined();
    expect(data.people.next).toBe(null);
    expect(data.people.results.length).toBe(3);
    const firstPerson = data.people.results[0];
    const secondPerson = data.people.results[1];
    expect(firstPerson).toStrictEqual({ name: 'Luke Skywalker' });
    expect(secondPerson).toStrictEqual({ name: 'Anakin Skywalker' });
  });

  it('person id', async () => {
    const QUERY = '{ swapi { person(id: 2) { name } } }';
    const resp = await req.post('/graphql').send({
      query: QUERY,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.data.swapi).toBeDefined();
    const person = resp.body.data.swapi.person;
    expect(person).toBeDefined();
    expect(person).toStrictEqual({ name: 'C-3PO' });
    expect(person.name).toBe('C-3PO');
  });

  it('person check subarrays', async () => {
    const QUERY = '{ swapi { person(id: 2) { name films } } }';
    const resp = await req.post('/graphql').send({
      query: QUERY,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.data.swapi).toBeDefined();
    const person = resp.body.data.swapi.person;
    expect(person).toBeDefined();
    expect(person.name).toBe('C-3PO');
    expect(person.films).toBeDefined();
    expect(person.films).toBeInstanceOf(Array);
    expect(person.films.length).toBe(6);
    expect(person.films[3]).toStrictEqual(`${APP_URL}/api/films/4/`);
  });
});
