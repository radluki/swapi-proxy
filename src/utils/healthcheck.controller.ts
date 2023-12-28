import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class HealthcheckController {
  @Get('healthcheck')
  async healthcheck(): Promise<string> {
    return 'swapi-proxy is up and running';
  }
}
