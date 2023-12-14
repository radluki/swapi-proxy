import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { mock, instance, when } from 'ts-mockito';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { Request } from 'express';

class CachedApiProxyServiceMock {
  get = jest.fn();
}

describe('AppController', () => {
  let app: TestingModule;
  let requestMock: Request;

  const cachedApiProxyServiceMockMock = new CachedApiProxyServiceMock();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [
        {
          provide: CachedApiProxyService,
          useValue: cachedApiProxyServiceMockMock,
        },
      ],
    }).compile();
  });

  beforeEach(async () => {
    requestMock = mock<Request>();
  });

  describe('healthcheck', () => {
    it('should return proper response', async () => {
      const appController = app.get(AppController);
      when(requestMock.url).thenReturn('MY_URL');
      const healthcheckResp = "<h1>HealthCheck</h1><h3>server is alive</h3>";

      expect(await appController.healthcheck(instance(requestMock))).toBe(
        healthcheckResp,
      );
    });
  });
});
