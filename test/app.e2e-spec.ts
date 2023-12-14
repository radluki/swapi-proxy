import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Redis } from 'ioredis';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let redisClient: Redis;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    redisClient = app.get<Redis>('REDIS_CLIENT');
    await app.init();
  });

  afterAll(async () => {
    // close redis connection and allows the test to exit, but generates open handle warning
    await redisClient.quit();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/dummy')
      .expect(200)
      .expect('Hello World!');
  });
});
