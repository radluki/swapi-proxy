import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService } from './redis.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { HttpRequestSender } from './http-request-sender';
import { OpeningCrawlsService } from './opening-crawl.service';
import { CachedApiController } from './cached-api.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'RedisClient',
      useFactory: (configService: ConfigService): RedisClient => {
        console.log('configService', configService);
        return new Redis({
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        });
      },
      inject: [ConfigService],
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
