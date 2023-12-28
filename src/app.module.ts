import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { SwapiGraphqlModule } from './graphql/swapi-graphql.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [CachedApiModule, SwapiGraphqlModule, ConfigModule],
  providers: [],
})
export class AppModule {}
