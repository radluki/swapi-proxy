import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from '../utils/logger-factory';
import { HttpCacheConectionRobustInterceptor } from '../utils/interceptors/http-cache-connection-robust.interceptor';
import { ApiProxyService } from './api-proxy-service';
import { JsonParseInterceptor } from '../utils/interceptors/json-parse.interceptor';
import { EmptyQueryDto, SwapiQueryDto } from './swapi-query.dto';

function WhitelistValidationPipe() {
  return new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
    whitelist: true,
  });
}

const SWAPI_RESOURCE =
  ':resource(films|species|vehicles|starships|people|planets)';

@Controller('api')
export class CachedApiController {
  private readonly logger = createLogger(CachedApiController.name);

  constructor(private readonly cachedApiService: ApiProxyService) {}

  @Get(['/', `${SWAPI_RESOURCE}/:id`])
  @UseInterceptors(HttpCacheConectionRobustInterceptor)
  @UseInterceptors(JsonParseInterceptor)
  async proxy(
    @Req() request: Request,
    @Query(WhitelistValidationPipe()) queryParams: EmptyQueryDto, // eslint-disable-line @typescript-eslint/no-unused-vars
    @Param('id', new ParseIntPipe({ optional: true })) id?: number, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return this.cachedApiService.get(request.url);
  }

  @Get(SWAPI_RESOURCE)
  @UseInterceptors(HttpCacheConectionRobustInterceptor)
  @UseInterceptors(JsonParseInterceptor)
  async resourceList(
    @Req() request: Request,
    @Query(WhitelistValidationPipe()) queryParams: SwapiQueryDto, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return this.cachedApiService.get(request.url);
  }
}
