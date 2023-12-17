import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createLogger } from './logger-factory';

@Injectable()
export class HttpRequestSender {
  private readonly logger = createLogger(HttpRequestSender.name);

  async get(url: string): Promise<string> {
    const disableBodyParsingConfig = {
      transformResponse: [(data) => data],
    };
    const response = await axios.get(url, disableBodyParsingConfig);
    if (response.status !== 200) {
      this.logger.warn(`Unexpected successful status 2xx: ${response.status}`);
    }
    return response.data;
  }
}
