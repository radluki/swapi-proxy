import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [CachedApiModule, GraphqlModule, ConfigModule],
  providers: [],
})
export class AppModule {}
