import { Module } from '@nestjs/common';
import { CachedApiService } from './cached-api.service';
import { HttpRequestSender } from './http-request-sender';
import { CachedApiController } from './cached-api.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConcreteCacheService } from './cache-service';
import { REDIS_PORT, REDIS_HOST, REDIS_TTL_MS } from '../config/config';
import { ApiProxyService } from './api-proxy-service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>(REDIS_HOST),
        port: configService.get<number>(REDIS_PORT),
        ttl: configService.get<number>(REDIS_TTL_MS),
      }),
    }),
  ],
  providers: [
    {
      provide: 'CacheService',
      useClass: ConcreteCacheService,
    },
    HttpRequestSender,
    ApiProxyService,
    CachedApiService,
  ],
  controllers: [CachedApiController],
  exports: [CachedApiService],
})
export class CachedApiModule {}
