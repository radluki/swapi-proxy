import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { SwapiGraphqlModule } from './swapi-graphql/swapi-graphql.module';
import { ConfigModule } from './config/config.module';
import { SwapiCustomModule } from './swapi-custom/swapi-custom.module';
import { HealthcheckController } from './utils/healthcheck.controller';
import { SchemaGraphqlModule } from './schema-first-graphql/schema-graphql.module';

@Module({
  imports: [
    SwapiCustomModule,
    CachedApiModule,
    SwapiGraphqlModule,
    ConfigModule,
    SchemaGraphqlModule,
  ],
  controllers: [HealthcheckController],
  providers: [],
})
export class AppModule {}
