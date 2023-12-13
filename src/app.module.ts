import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CachedApiModule } from './cached-api.module';

@Module({
  imports: [CachedApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
