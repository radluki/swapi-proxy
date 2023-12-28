import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckController } from './healthcheck.controller';

describe('HealthcheckController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [HealthcheckController],
    }).compile();
  });

  describe('healthcheck', () => {
    it('should return proper response', async () => {
      const appController = app.get(HealthcheckController);
      const healthcheckResp = 'swapi-proxy is up and running';

      expect(await appController.healthcheck()).toBe(healthcheckResp);
    });
  });
});
