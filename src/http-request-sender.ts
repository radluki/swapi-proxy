import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createLogger } from './logger-factory';

@Injectable()
export class HttpRequestSender {
  private readonly logger = createLogger(HttpRequestSender.name);

  async get(url: string): Promise<string> {
    try {
      const configDisablingBodyParsing = {
        transformResponse: [(data) => data],
      };
      const response = await axios.get(url, configDisablingBodyParsing);
      if (response.status === 200) {
        return response.data;
      }
      this.logger.error(
        `Error fetching data from url: ${url}: status: ${response.status}`,
      );
      throw {
        message: `Error fetching data from url: ${url}`,
        status: response.status,
      };
    } catch (err) {
      if (err.response) {
        this.logger.error(
          `Exception caught response.status: ${err.response.status}`,
        );
        throw {
          message: `ErrorForward: ${err.message}`,
          status: err.response.status,
        };
      }
      throw err;
    }
  }
}
