import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from '../utils/logger-factory';
import { CustomCacheInterceptor } from '../utils/custom-cache.interceptor';
import { ApiProxyService } from './api-proxy-service';
import { JsonParseInterceptor } from '../utils/json-parse.interceptor';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: ApiProxyService) {}

  @Get('/')
  @UseInterceptors(CustomCacheInterceptor)
  @UseInterceptors(JsonParseInterceptor)
  async getRoot(@Req() request: Request) {
    return this.cachedApiService.get(request.url);
  }

  @Get(':resource(films|species|vehicles|starships|people|planets)/:id?')
  @UseInterceptors(CustomCacheInterceptor)
  @UseInterceptors(JsonParseInterceptor)
  async proxy(
    @Req() request: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('id', new ParseIntPipe({ optional: true })) id?: number,
  ) {
    return this.cachedApiService.get(request.url);
  }
}
