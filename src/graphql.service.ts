import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GraphqlService {
  async getPeople(name?: string): Promise<any> {
    const queryStr = name ? `?search=${name}` : '';
    const url = `https://swapi.dev/api/people/${queryStr}`;
    const response = await axios.get(url);
    return response.data.results;
  }
}
