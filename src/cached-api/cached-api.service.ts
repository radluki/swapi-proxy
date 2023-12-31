import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './cache-service';
import { createLogger } from '../utils/logger-factory';
import { ConfigService } from '@nestjs/config';
import { PORT } from '../config/config';
import { ApiProxyService } from './api-proxy-service';

export function getCacheKey(relativeUrl: string, port: number): string {
  return `:${port}${relativeUrl}`;
}

@Injectable()
export class CachedApiService {
  private readonly logger = createLogger(CachedApiService.name);

  constructor(
    @Inject('CacheService') private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly apiProxyService: ApiProxyService,
  ) {}

  async get(relativeUrl: string): Promise<string> {
    const port = this.configService.get<number>(PORT);
    const key = getCacheKey(relativeUrl, port);
    const cachedValue = await this.cacheService.get(key);
    if (cachedValue) return cachedValue;

    const fetchedValue = await this.apiProxyService.get(relativeUrl);
    fetchedValue && this.cacheService.set(key, fetchedValue);
    return fetchedValue;
  }
}
