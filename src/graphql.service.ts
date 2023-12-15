import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createLogger } from './logger-factory';

@Injectable()
export class GraphqlService {
  private logger = createLogger(GraphqlService.name);

  async getPeople(name?: string, page?: string): Promise<any> {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    const queryStr = queries.length ? `?${queries.join('&')}` : '';
    const url = `http://localhost:3000/api/people/${queryStr}`;
    const response = await axios.get(url);
    this.logger.debug(`response.data: ${JSON.stringify(response.data)}`);
    return response.data;
  }
}
