import { Injectable } from '@nestjs/common';
import axios from 'axios';

// TODO forwarding of count, previous, next
@Injectable()
export class GraphqlService {
  async getPeople(name?: string, page?: string): Promise<any> {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    const queryStr = queries.length ? `?${queries.join('&')}` : '';
    const url = `http://localhost:3000/api/people/${queryStr}`;
    const response = await axios.get(url);
    return response.data.results;
  }
}
