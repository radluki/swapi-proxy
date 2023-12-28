import { Controller, Get, Req } from '@nestjs/common';
import { CachedApiService } from './cached-api.service';
import { Request } from 'express';
import { createLogger } from '../utils/logger-factory';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: CachedApiService) {}

  @Get('healthcheck')
  async healthcheck(): Promise<string> {
    return 'swapi-proxy is up and running';
  }

  @Get('/')
  async getRoot() {
    return await this.cachedApiService.get('/api/');
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)*')
  async proxy(@Req() request: Request) {
    this.logger.log(`proxying ${request.url}`);
    return await this.cachedApiService.get(request.url);
  }
}
