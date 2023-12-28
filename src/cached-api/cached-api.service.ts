import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from './redis.service';
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

  getApiRoot(): any {
    return {
      people: `http://localhost:${this.port}/api/people/`,
      planets: `http://localhost:${this.port}/api/planets/`,
      films: `http://localhost:${this.port}/api/films/`,
      species: `http://localhost:${this.port}/api/species/`,
      vehicles: `http://localhost:${this.port}/api/vehicles/`,
      starships: `http://localhost:${this.port}/api/starships/`,
    };
  }

  async get(relativeUrl: string): Promise<string> {
    const cachedValue = await this.getFromCache(this.getKey(relativeUrl));
    return cachedValue || this.getFromSwapi(relativeUrl);
  }

  private getKey(relativeUrl: string): string {
    return `:${this.port}${relativeUrl}`;
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
    this.cacheService.set(this.getKey(relativeUrl), dataWithOverridenDomain);
    this.logger.debug(
      `Fetched data for "${relativeUrl}": ${dataWithOverridenDomain}`,
    );
    return dataWithOverridenDomain;
  }
}
