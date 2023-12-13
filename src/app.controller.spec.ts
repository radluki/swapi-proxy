import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mock, instance, when } from 'ts-mockito';

describe('AppController', () => {
  let app: TestingModule;
  let requestMock: Request;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    requestMock = mock<Request>();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      when(requestMock.url).thenReturn("MY_URL");
      expect(appController.getHello(instance(requestMock))).toBe('Hello World!');
    });
  });
});
