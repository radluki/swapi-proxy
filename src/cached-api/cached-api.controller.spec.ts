import { Test, TestingModule } from '@nestjs/testing';
import { CachedApiController } from './cached-api.controller';
import { CachedApiService } from './cached-api.service';

class CachedApiServiceMock {
  get = jest.fn();
}

class OpeningCrawlServiceMock {
  countWords = jest.fn();
}

describe('AppController', () => {
  let app: TestingModule;

  const cachedApiServiceMock = new CachedApiServiceMock();
  const openingCrawlsServiceMock = new OpeningCrawlServiceMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [CachedApiController],
      providers: [
        {
          provide: CachedApiService,
          useValue: cachedApiServiceMock,
        },
        {
          provide: 'IOpeningCrawlsService',
          useValue: openingCrawlsServiceMock,
        },
      ],
    }).compile();
  });

  describe('healthcheck', () => {
    it('should return proper response', async () => {
      const appController = app.get(CachedApiController);
      const healthcheckResp = 'swapi-proxy is up and running';

      expect(await appController.healthcheck()).toBe(healthcheckResp);
    });
  });
});
