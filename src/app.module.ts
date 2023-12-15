import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CachedApiModule } from './cached-api.module';
import { GraphqlModule } from './graphql.module';

@Module({
  imports: [CachedApiModule, GraphqlModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
