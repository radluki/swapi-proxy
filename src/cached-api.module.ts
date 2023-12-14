import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService, CacheService } from './redis.service';
import { ApiProxyService } from './api-proxy.service';
import { CachedApiProxyService } from './cached-api-proxy.service';

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
    ApiProxyService,
    CachedApiProxyService,
  ],
  exports: [CachedApiProxyService],
})
export class CachedApiModule {}
