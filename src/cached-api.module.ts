import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService } from './redis.service';
import { ApiProxyService } from './api-proxy.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { HttpRequestSender } from './http-request-sender';
import { OpeningCrawlService } from './opening-crawl.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (): RedisClient => {
        return new Redis({
          host: 'redis',
          port: 6379,
        });
      },
    },
    {
      provide: 'API_URL',
      useValue: 'https://swapi.dev',
    },
    {
      provide: "CacheService",
      useClass: RedisService,
    },
    HttpRequestSender,
    ApiProxyService,
    CachedApiProxyService,
    OpeningCrawlService
  ],
  exports: [CachedApiProxyService, OpeningCrawlService],
})
export class CachedApiModule {}
