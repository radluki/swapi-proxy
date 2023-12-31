import { Injectable } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';
import { HttpRequestSender } from './http-request-sender';
import { ConfigService } from '@nestjs/config';
import { SWAPI_URL, SWAPI_PROXY_URL } from '../config/config';

@Injectable()
export class ApiProxyService {
  private readonly logger = createLogger(ApiProxyService.name);

  constructor(
    private readonly httpReqSender: HttpRequestSender,
    private readonly configService: ConfigService,
  ) {}

  async get(relativeUrl: string): Promise<string> {
    const fetchedValue = await this.getFromSwapi(relativeUrl);
    this.logger.log(`Fetched data for "${relativeUrl}"`);
    this.logger.debug(`Data fetched for "${relativeUrl}": ${fetchedValue}`);
    return fetchedValue;
  }

  private async getFromSwapi(relativeUrl: string): Promise<string> {
    const swapiUrl = this.configService.get<string>(SWAPI_URL);
    this.logger.log(`Fetching data directly from api for "${relativeUrl}"`);
    const fullUrl = `${swapiUrl}${relativeUrl}`;
    const responseDataStr = await this.httpReqSender.get(fullUrl);

    if (!responseDataStr) return responseDataStr;
    const swapiProxyDomain = this.configService.get<string>(SWAPI_PROXY_URL);
    return responseDataStr.replaceAll(swapiUrl, swapiProxyDomain);
  }
}
