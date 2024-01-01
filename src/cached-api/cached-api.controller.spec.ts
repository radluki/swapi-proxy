import { Test } from '@nestjs/testing';
import { CachedApiController } from './cached-api.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ApiProxyService } from './api-proxy-service';
import { Cache } from 'cache-manager';

describe('CachedApiController', () => {
  let app: INestApplication;
  const apiServiceMock = {
    get: jest.fn(),
  };
  const response = { field: 22 };
  const configuredPort = 3000;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 1000, // 1 millisecond
        }),
      ],
      controllers: [CachedApiController],
      providers: [
        {
          provide: ApiProxyService,
          useValue: apiServiceMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'PORT':
                  return configuredPort;
                default:
                  return null;
              }
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    app.get(CACHE_MANAGER).reset();
  });

  afterAll(async () => {
    await app.close();
  });

  const setGetMockImpl = (expected_url: string, response: any) => {
    apiServiceMock.get.mockImplementation((url: string) => {
      const responseStr = JSON.stringify(response);
      const responseForUnexpectedUrlStr = JSON.stringify({
        message: 'Response for unexpected url',
      });
      return Promise.resolve(
        decodeURIComponent(url) === decodeURIComponent(expected_url)
          ? responseStr
          : responseForUnexpectedUrlStr,
      );
    });
  };

  describe('caching', () => {
    test.each([
      ['/api/'],
      ['/api'],
      ['/api/films'],
      ['/api/films/66'],
      ['/api/vehicles/?page=1&search="abc"'],
    ])('%s (GET) - test cache', async (url) => {
      setGetMockImpl(url, response);
      const cacheManager = app.get(CACHE_MANAGER) as Cache;
      const key = `:${configuredPort}${url}`;

      const cachedBeforeApiCall = await cacheManager.get(key);
      expect(cachedBeforeApiCall).toBeUndefined();

      await request(app.getHttpServer())
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/);

      const cachedValue = await cacheManager.get(key);
      expect(typeof cachedValue).toEqual('string');
      expect(cachedValue).toEqual(JSON.stringify(response));
    });
  });

  describe('valid paths', () => {
    test.each([
      ['/api/'],
      ['/api'],
      ['/api/films'],
      ['/api/films/?page=1'],
      ['/api/films/1/'],
      ['/api/species'],
      ['/api/species/'],
      ['/api/species?search="Luke"'],
      ['/api/species/4/'],
      ['/api/vehicles'],
      ['/api/vehicles/'],
      ['/api/vehicles/?page=1&search=abc'],
      ['/api/vehicles/44/'],
      ['/api/starships'],
      ['/api/starships/876'],
      ['/api/people/12/'],
      ['/api/people'],
      ['/api/planets'],
    ])('%s (GET)', (url) => {
      setGetMockImpl(url, response);
      return request(app.getHttpServer())
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((resp) => {
          expect(resp.body).toEqual(response);
        });
    });
  });

  describe('not found', () => {
    test.each([
      ['/apix/'],
      ['/unknown'],
      ['/api/filmsx'],
      ['/api/speciesx'],
      ['/api/vehiclesx'],
      ['/api/starshipsx'],
      ['/api/peoplex'],
      ['/api/planetsx'],
      ['/api/planets/xxx/yyy/zz/'],
      ['/api/planets/22/yyy'],
    ])('%s (GET)', (url) => {
      setGetMockImpl(url, response);
      return request(app.getHttpServer())
        .get(url)
        .expect(404)
        .expect('Content-Type', /json/)
        .then((resp) => {
          const expected = {
            error: 'Not Found',
            message: 'Cannot GET ' + url,
            statusCode: 404,
          };
          expect(resp.body).toEqual(expected);
        });
    });
  });

  describe('bad request', () => {
    test.each([
      ['/api/films/xx/'],
      ['/api/people/other-field'],
      ['/api/films/?page="xx"'],
      ['/api/films/?name="xx"'],
      ['/api/films/22/?name="xx"'],
      ['/api/films/22/?search="xx"'],
      ['/api/films/22/?page=1'],
      ['/api/?page=1'],
      ['/api?page=1'],
    ])('%s (GET)', (url) => {
      setGetMockImpl(url, response);
      return request(app.getHttpServer())
        .get(url)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((resp) => {
          const expected = {
            error: 'Bad Request',
            statusCode: 400,
          };
          expect(resp.body.error).toEqual(expected.error);
        });
    });
  });
});
