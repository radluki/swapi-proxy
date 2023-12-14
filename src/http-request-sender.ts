import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpRequestSender {
  async get(url: string): Promise<any | undefined> {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      }
      throw {
        message: `Error fetching data from url: ${url}`,
        status: response.status,
      };
    } catch (err) {
      if (err.response) {
        throw {
          message: `ErrorForward: ${err.message}`,
          status: err.response.status,
        };
      }
      throw err;
    }
  }
}
