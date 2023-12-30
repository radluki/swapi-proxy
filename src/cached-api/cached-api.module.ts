import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { CachedApiService } from './cached-api.service';
import { HttpRequestSender } from './http-request-sender';
import { CachedApiController } from './cached-api.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConcreteCacheService } from './cache-service';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        ttl: 10 * 1000, // 10 seconds
      }),
    }),
  ],
  providers: [
    {
      provide: 'CacheService',
      useClass: ConcreteCacheService,
    },
    HttpRequestSender,
    CachedApiService,
  ],
  controllers: [CachedApiController],
  exports: [CachedApiService],
})
export class CachedApiModule {}
