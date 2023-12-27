import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HttpRequestSender {

  async get(url: string): Promise<string> {
    const response = await axios.get(url, { transformResponse: [(data) => data] });
    return response.data;
  }
}
