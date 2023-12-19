import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './redis.service';
import { createLogger } from './logger-factory';
import { HttpRequestSender } from './http-request-sender';

@Injectable()
export class CachedApiProxyService {
  private readonly logger = createLogger(CachedApiProxyService.name);

  constructor(
    @Inject('SwapiUrl') private readonly swapiUrl: string,
    @Inject('SwapiProxyDomain') private readonly swapiProxyDomain: string,
    private readonly httpReqSender: HttpRequestSender,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) {}

  async get(relativeUrl: string): Promise<string> {
    const cachedValue = await this.getFromCache(relativeUrl);
    return cachedValue || this.getFromSwapi(relativeUrl);
  }

  private async getFromCache(key: string): Promise<string> {
    try {
      const cachedValue = await this.cacheService.get(key);
      if (cachedValue) {
        this.logger.debug(`Cache hit for key "${key}"`);
        return cachedValue;
      }
      this.logger.debug(`Cache miss for key "${key}"`);
    } catch (err) {
      this.logger.warn(`Exception during cache check: ${err.message}`);
    }
    return null;
  }

  private async getFromSwapi(relativeUrl: string): Promise<string> {
    this.logger.log(`Fetching data directly from api for "${relativeUrl}"`);
    const fullUrl = `${this.swapiUrl}${relativeUrl}`;
    const responseDataStr = await this.httpReqSender.get(`${fullUrl}`);

    if (!responseDataStr) {
      return responseDataStr;
    }
    const dataWithOverridenDomain = responseDataStr.replaceAll(
      this.swapiUrl,
      this.swapiProxyDomain,
    );
    this.cacheService.set(relativeUrl, dataWithOverridenDomain);
    this.logger.debug(
      `Fetched data for "${relativeUrl}": ${dataWithOverridenDomain}`,
    );
    return dataWithOverridenDomain;
  }
}
