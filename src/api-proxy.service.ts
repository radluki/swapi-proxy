import { Injectable, Inject } from '@nestjs/common';
import { createLogger } from './logger-factory';
import { HttpRequestSender } from './http-request-sender';

@Injectable()
export class ApiProxyService {
  private readonly logger = createLogger(ApiProxyService.name);

  constructor(
    @Inject('API_URL') private readonly apiUrl: string,
    private readonly httpReqSender: HttpRequestSender,
  ) {}

  async get(relativeUrl: string): Promise<string | null> {
    const fullUrl = `${this.apiUrl}${relativeUrl}`;
    this.logger.log(`Fetching data from url: ${fullUrl}`);
    const responseData = await this.httpReqSender.get(`${fullUrl}`);
    this.logger.debug(`Fetched data: ${responseData}`);
    return responseData || null;
  }
}
