import { Injectable } from '@nestjs/common';
import {
  SwapiResourceProvider,
  SwapiResourceType,
} from './swapi-resource-provider';

export interface ISwapiResourceProviderService {
  getPerson(id: number): Promise<any>;
  getPlanet(id: number): Promise<any>;
  getStarship(id: number): Promise<any>;
  getPeople(name?: string, page?: number): Promise<any>;
  getPlanets(name?: string, page?: number): Promise<any>;
  getStarships(name?: string, page?: number): Promise<any>;
}

export function extractIdFromUrl(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

@Injectable()
export class SwapiResourceProviderAdapter
  implements ISwapiResourceProviderService
{
  constructor(private readonly service: SwapiResourceProvider) {}

  async getPerson(id: number): Promise<any> {
    return await this.service.getSingleResource(SwapiResourceType.People, id);
  }

  async getPlanet(id: number): Promise<any> {
    return await this.service.getSingleResource(SwapiResourceType.Planets, id);
  }

  async getStarship(id: number): Promise<any> {
    return await this.service.getSingleResource(
      SwapiResourceType.Starships,
      id,
    );
  }

  async getPeople(name?: string, page?: number): Promise<any> {
    return await this.service.getResources(
      SwapiResourceType.People,
      name,
      page,
    );
  }

  async getPlanets(name?: string, page?: number): Promise<any> {
    return await this.service.getResources(
      SwapiResourceType.Planets,
      name,
      page,
    );
  }

  async getStarships(name?: string, page?: number): Promise<any> {
    return await this.service.getResources(
      SwapiResourceType.Starships,
      name,
      page,
    );
  }
}
