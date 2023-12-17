import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { OpeningCrawlService } from './opening-crawl.service';

class CachedApiProxyServiceMock {
  get = jest.fn();
}

class OpeningCrawlServiceMock {
  countWords = jest.fn();
}

describe('AppController', () => {
  let app: TestingModule;

  const cachedApiProxyServiceMockMock = new CachedApiProxyServiceMock();
  const openingCrawlServiceMock = new OpeningCrawlServiceMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [
        {
          provide: CachedApiProxyService,
          useValue: cachedApiProxyServiceMockMock,
        },
        {
          provide: OpeningCrawlService,
          useValue: openingCrawlServiceMock,
        },
      ],
    }).compile();
  });

  describe('healthcheck', () => {
    it('should return proper response', async () => {
      const appController = app.get(AppController);
      const healthcheckResp = '<h1>HealthCheck</h1><h3>server is alive</h3>';

      expect(await appController.healthcheck()).toBe(healthcheckResp);
    });
  });
});
