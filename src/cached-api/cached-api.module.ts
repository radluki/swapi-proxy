import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService } from './redis.service';
import { CachedApiService } from './cached-api.service';
import { HttpRequestSender } from './http-request-sender';
import { OpeningCrawlsService } from './opening-crawl.service';
import { CachedApiController } from './cached-api.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
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
    CachedApiService,
    {
      provide: 'IOpeningCrawlsService',
      useClass: OpeningCrawlsService,
    },
  ],
  controllers: [CachedApiController],
  exports: [CachedApiService, 'IOpeningCrawlsService'],
})
export class CachedApiModule {}
