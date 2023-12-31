import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './cache-service';
import { createLogger } from '../utils/logger-factory';
import { ConfigService } from '@nestjs/config';
import { PORT } from '../config/config';
import { ApiProxyService } from './api-proxy-service';

@Injectable()
export class CachedApiService {
  private readonly logger = createLogger(CachedApiService.name);
  private readonly port: number;

  constructor(
    @Inject('CacheService') private readonly cacheService: CacheService,
    configService: ConfigService,
    private readonly apiProxyService: ApiProxyService,
  ) {
    this.port = configService.get<number>(PORT);
  }

  async get(relativeUrl: string): Promise<string> {
    const key = `:${this.port}${relativeUrl}`;
    const cachedValue = await this.cacheService.get(key);
    if (cachedValue) return cachedValue;

    const fetchedValue = await this.apiProxyService.get(relativeUrl);
    fetchedValue && this.cacheService.set(key, fetchedValue);
    return fetchedValue;
  }
}
