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
import { HttpCacheConectionRobustInterceptor } from '../utils/interceptors/custom-cache.interceptor';
import { ApiProxyService } from './api-proxy-service';
import { JsonParseInterceptor } from '../utils/interceptors/json-parse.interceptor';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: ApiProxyService) {}

  @Get(['/', ':resource(films|species|vehicles|starships|people|planets)/:id?'])
  @UseInterceptors(HttpCacheConectionRobustInterceptor)
  @UseInterceptors(JsonParseInterceptor)
  async proxy(
    @Req() request: Request,
    @Param('id', new ParseIntPipe({ optional: true })) id?: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return this.cachedApiService.get(request.url);
  }
}
