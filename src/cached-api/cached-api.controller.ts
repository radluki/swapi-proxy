import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { CachedApiService } from './cached-api.service';
import { Request } from 'express';
import { createLogger } from '../utils/logger-factory';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: CachedApiService) {}

  @Get('/')
  async getRoot(@Req() request: Request) {
    return this.getResponse(request.url);
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)/:id?')
  async proxy(
    @Req() request: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', new ParseIntPipe({ optional: true })) id?: number,
  ) {
    return this.getResponse(request.url);
  }

  private async getResponse(url: string) {
    this.logger.log(`request for ${url}`);
    return JSON.parse(await this.cachedApiService.get(url));
  }
}
