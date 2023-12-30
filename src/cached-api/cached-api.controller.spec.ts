import { Test } from '@nestjs/testing';
import { CachedApiController } from './cached-api.controller';
import { INestApplication } from '@nestjs/common';
import { CachedApiService } from './cached-api.service';
import * as request from 'supertest';
import { CacheModule } from '@nestjs/cache-manager';

describe('CachedApiController', () => {
  let app: INestApplication;
  const cachedApiService = {
    get: jest.fn(),
  };
  const response = { field: 22 };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          ttl: 1, // 1 millisecond
        }),
      ],
      controllers: [CachedApiController],
      providers: [
        {
          provide: CachedApiService,
          useValue: cachedApiService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const setGetMockImpl = (expected_url: string, response: any) => {
    cachedApiService.get.mockImplementation((url: string) => {
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

  describe('valid paths', () => {
    test.each([
      ['/api/'],
      ['/api'],
      ['/api/films'],
      ['/api/films/?page=1'],
      ['/api/films/1/'],
      ['/api/species'],
      ['/api/species/'],
      ['/api/species?name="Luke"'],
      ['/api/species/4/'],
      ['/api/vehicles'],
      ['/api/vehicles/'],
      ['/api/vehicles/?page=1&name="abc"'],
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

  describe('invalid paths', () => {
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

    describe('string in place of id', () => {
      test.each([['/api/films/xx/'], ['/api/people/other-field']])(
        '%s (GET)',
        (url) => {
          setGetMockImpl(url, response);
          return request(app.getHttpServer())
            .get(url)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((resp) => {
              const expected = {
                error: 'Bad Request',
                message: 'Validation failed (numeric string is expected)',
                statusCode: 400,
              };
              expect(resp.body).toEqual(expected);
            });
        },
      );
    });
  });
});
