import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { SwapiGraphqlModule } from './swapi-graphql/swapi-graphql.module';
import { ConfigModule } from './config/config.module';
import { SwapiCustomModule } from './swapi-custom/swapi-custom.module';

@Module({
  imports: [
    SwapiCustomModule,
    CachedApiModule,
    SwapiGraphqlModule,
    ConfigModule,
  ],
  providers: [],
})
export class AppModule {}
