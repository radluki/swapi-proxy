import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './cache-service';
import { createLogger } from '../utils/logger-factory';
import { HttpRequestSender } from './http-request-sender';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CachedApiService {
  private readonly logger = createLogger(CachedApiService.name);
  private readonly swapiProxyDomain: string;
  private readonly swapiUrl: string;
  private readonly port: number;

  constructor(
    private readonly httpReqSender: HttpRequestSender,
    @Inject('CacheService') private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    this.swapiProxyDomain = configService.get<string>('swapiProxyUrl');
    this.swapiUrl = configService.get<string>('swapiUrl');
    this.port = configService.get<number>('PORT');
    this.logger.debug(`swapiProxyDomain: ${this.swapiProxyDomain}`);
    this.logger.debug(`swapiUrl: ${this.swapiUrl}`);
  }

  async get(relativeUrl: string): Promise<string> {
    const key = `:${this.port}${relativeUrl}`;
    const cachedValue = await this.cacheService.get(key);
    if (cachedValue) return cachedValue;

    const fetchedValue = await this.getFromSwapi(relativeUrl);
    this.logger.log(`Fetched data for "${relativeUrl}"`);
    this.logger.debug(`Data fetched for "${relativeUrl}": ${fetchedValue}`);
    if (fetchedValue) this.cacheService.set(key, fetchedValue);
    return fetchedValue;
  }

  private async getFromSwapi(relativeUrl: string): Promise<string> {
    this.logger.log(`Fetching data directly from api for "${relativeUrl}"`);
    const fullUrl = `${this.swapiUrl}${relativeUrl}`;
    const responseDataStr = await this.httpReqSender.get(`${fullUrl}`);

    if (!responseDataStr) return responseDataStr;
    return responseDataStr.replaceAll(this.swapiUrl, this.swapiProxyDomain);
  }
}
