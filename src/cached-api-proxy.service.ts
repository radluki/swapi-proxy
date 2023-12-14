import { Inject, Injectable } from '@nestjs/common';
import { ApiProxyService } from './api-proxy.service';
import { CacheService } from './redis.service';
import { createLogger } from './logger-factory';

@Injectable()
export class CachedApiProxyService {
  private readonly logger = createLogger(CachedApiProxyService.name);

  constructor(
    private readonly apiProxyService: ApiProxyService,
    @Inject("CacheService") private readonly cacheService: CacheService,
  ) { }

  async get(relativeUrl: string): Promise<string | null> {
    return (
      (await this.getFromCache(relativeUrl)) || this.getFromApi(relativeUrl)
    );
  }

  private async getFromCache(key: string): Promise<string | null> {
    try {
      const cachedValue = await this.cacheService.get(key);
      if (cachedValue) {
        this.logger.log(`Cache hit for key "${key}"`);
        return cachedValue;
      }
      this.logger.log(`Cache miss for key "${key}"`);
    } catch (err) {
      this.logger.warn(`Exception during cache check: ${err.message}`);
    }
    return null;
  }

  private async getFromApi(relativeUrl: string): Promise<string | null> {
    this.logger.log(
      `Fetching data directly from api for key "${relativeUrl}"`,
    );
    const responseDataStr = await this.apiProxyService.get(relativeUrl);
    responseDataStr && this.cacheService.set(relativeUrl, responseDataStr);
    return responseDataStr;
  }
}
