import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisClient, RedisService } from './redis.service';
import { CachedApiService } from './cached-api.service';
import { HttpRequestSender } from './http-request-sender';
import { CachedApiController } from './cached-api.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 10 * 1000, // 10 seconds
    }),
  ],
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
  ],
  controllers: [CachedApiController],
  exports: [CachedApiService],
})
export class CachedApiModule {}
