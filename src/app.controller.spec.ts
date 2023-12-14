import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mock, instance, when } from 'ts-mockito';
import { CachedApiProxyService } from './cached-api-proxy.service';

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
        AppService,
      ],
    }).compile();
  });

  beforeEach(async () => {
    requestMock = mock<Request>();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', async () => {
      const appController = app.get(AppController);
      when(requestMock.url).thenReturn('MY_URL');
      expect(await appController.getHello(instance(requestMock))).toBe(
        'Hello World!',
      );
    });
  });
});
