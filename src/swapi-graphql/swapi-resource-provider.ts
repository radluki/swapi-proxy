import { Injectable } from '@nestjs/common';
import { CachedApiService } from '../cached-api/cached-api.service';

export const enum SwapiResourceType {
  People = 'people',
  Planets = 'planets',
  Starships = 'starships',
}

@Injectable()
export class SwapiResourceProvider {
  constructor(private readonly cachedApiService: CachedApiService) {}

  async getResources(
    resourceType: SwapiResourceType,
    name?: string,
    page?: number,
  ): Promise<any> {
    const queryStr = this.getQueryStr(name, page);
    const url = `/api/${resourceType}/${queryStr}`;
    const serilizedResp = await this.cachedApiService.get(url);
    return JSON.parse(serilizedResp);
  }

  private getQueryStr(name?: string, page?: number): string {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    return queries.length ? `?${queries.join('&')}` : '';
  }

  async getSingleResource(
    resourceType: SwapiResourceType,
    id: number,
  ): Promise<any> {
    const url = `/api/${resourceType}/${id}`;
    const serilizedResp = await this.cachedApiService.get(url);
    return JSON.parse(serilizedResp);
  }
}
