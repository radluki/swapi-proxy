import { Module } from '@nestjs/common';
import { OpeningCrawlsService } from './opening-crawl.service';
import { CachedApiModule } from 'src/cached-api/cached-api.module';
import { SwapiCustomController } from './swapi-custom.controller';

@Module({
  imports: [CachedApiModule],
  providers: [
    {
      provide: 'IOpeningCrawlsService',
      useClass: OpeningCrawlsService,
    },
  ],
  controllers: [SwapiCustomController],
})
export class SwapiCustomModule {}
