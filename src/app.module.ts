import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { SwapiGraphqlModule } from './swapi-graphql/swapi-graphql.module';
import { ConfigModule } from './config/config.module';
import { SwapiCustomModule } from './swapi-custom/swapi-custom.module';
import { HealthcheckController } from './utils/healthcheck.controller';
import { LoggingInterceptor } from './utils/interceptors/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    SwapiCustomModule,
    CachedApiModule,
    SwapiGraphqlModule,
    ConfigModule,
  ],
  controllers: [HealthcheckController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
