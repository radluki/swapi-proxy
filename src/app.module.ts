import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { SwapiGraphqlModule } from './swapi-graphql/swapi-graphql.module';
import { ConfigModule } from './config/config.module';
import { SwapiCustomModule } from './swapi-custom/swapi-custom.module';
import { HealthcheckController } from './utils/healthcheck.controller';

@Module({
  imports: [
    SwapiCustomModule,
    CachedApiModule,
    SwapiGraphqlModule,
    ConfigModule,
  ],
  controllers: [HealthcheckController],
  providers: [],
})
export class AppModule {}
