import { Test, TestingModule } from '@nestjs/testing';
import { CachedApiController } from './cached-api.controller';
import { CachedApiService } from './cached-api.service';

class CachedApiServiceMock {
  get = jest.fn();
}

describe('CachedApiController', () => {
  let app: TestingModule;

  const cachedApiServiceMock = new CachedApiServiceMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [CachedApiController],
      providers: [
        {
          provide: CachedApiService,
          useValue: cachedApiServiceMock,
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
