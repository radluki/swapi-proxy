import { Module } from '@nestjs/common';
import { CachedApiModule } from './cached-api/cached-api.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [CachedApiModule, GraphqlModule],
  providers: [],
})
export class AppModule {}
