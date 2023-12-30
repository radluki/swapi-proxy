import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CachedApiService } from './cached-api.service';
import { Request } from 'express';
import { createLogger } from '../utils/logger-factory';
import { CustomCacheInterceptor } from '../utils/custom-cache.interceptor';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: CachedApiService) {}

  @Get('/')
  async getRoot(@Req() request: Request) {
    return this.getResponse(request.url);
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)/:id?')
  @UseInterceptors(CustomCacheInterceptor)
  async proxy(
    @Req() request: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', new ParseIntPipe({ optional: true })) id?: number,
  ) {
    return this.getResponse(request.url);
  }

  private async getResponse(url: string) {
    this.logger.log(`request for ${url}`);
    const resultStr = await this.cachedApiService.get(url);
    return JSON.parse(resultStr);
  }
}
