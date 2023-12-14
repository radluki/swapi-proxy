import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CachedApiModule } from './cached-api.module';

@Module({
  imports: [CachedApiModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
