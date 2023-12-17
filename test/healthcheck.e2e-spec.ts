import * as request from 'supertest';
import { APP_URL } from './common';

it('GET /api/healthcheck', async () => {
  try {
    await request(APP_URL)
      .get('/api/healthcheck')
      .expect(200)
      .expect('swapi-proxy is up and running');
  } catch (error) {
    throw new Error(
      'HealthCheck Error: Make sure that docker-compose is up and devcontainer is connected to its network',
    );
  }
});
