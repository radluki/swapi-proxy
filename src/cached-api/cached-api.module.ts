import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService } from './redis.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { HttpRequestSender } from './http-request-sender';
import { OpeningCrawlsService } from './opening-crawl.service';
import { CachedApiController } from './cached-api.controller';

@Module({
  providers: [
    {
      provide: 'RedisClient',
      useFactory: (): RedisClient => {
        return new Redis({
          host: 'redis',
          port: 6379,
        });
      },
    },
    {
      provide: 'SwapiUrl',
      useValue: 'https://swapi.dev',
    },
    {
      provide: 'SwapiProxyDomain',
      useValue: 'http://localhost:3000',
    },
    {
      provide: 'CacheService',
      useClass: RedisService,
    },
    HttpRequestSender,
    CachedApiProxyService,
    {
      provide: 'IOpeningCrawlsService',
      useClass: OpeningCrawlsService,
    },
  ],
  controllers: [CachedApiController],
  exports: [CachedApiProxyService, 'IOpeningCrawlsService'],
})
export class CachedApiModule {}
