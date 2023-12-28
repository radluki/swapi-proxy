import { Injectable } from '@nestjs/common';
import { CachedApiService } from '../cached-api/cached-api.service';

const enum SwapiResourceType {
  People = 'people',
  Planets = 'planets',
  Starships = 'starships',
}

export interface ISwapiResourceProviderService {
  getPerson(id: number): Promise<any>;
  getPlanet(id: number): Promise<any>;
  getStarship(id: number): Promise<any>;
  getPeople(name?: string, page?: number): Promise<any>;
  getPlanets(name?: string, page?: number): Promise<any>;
  getStarships(name?: string, page?: number): Promise<any>;
}

@Injectable()
export class SwapiResourceProviderService {
  constructor(private cachedApiService: CachedApiService) {}

  async getPerson(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.People, id);
  }

  async getPlanet(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.Planets, id);
  }

  async getStarship(id: number): Promise<any> {
    return await this.getSingleResource(SwapiResourceType.Starships, id);
  }

  async getPeople(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.People, name, page);
  }

  async getPlanets(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.Planets, name, page);
  }

  async getStarships(name?: string, page?: number): Promise<any> {
    return await this.getResources(SwapiResourceType.Starships, name, page);
  }

  private async getResources(
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

  private async getSingleResource(
    resourceType: SwapiResourceType,
    id: number,
  ): Promise<any> {
    const url = `/api/${resourceType}/${id}`;
    const serilizedResp = await this.cachedApiService.get(url);
    return JSON.parse(serilizedResp);
  }
}
