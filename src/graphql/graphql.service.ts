import { Injectable, Res } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';
import { CachedApiProxyService } from '../cached-api/cached-api-proxy.service';

export const enum ResourceType {
  People = 'people',
  Person = 'person',
  Planets = 'planets',
  Planet = 'planet',
  Starships = 'starships',
  Starship = 'starship',
}

function getApiResourceType(resourceType: ResourceType): string {
  switch (resourceType) {
    case ResourceType.People:
    case ResourceType.Person:
      return 'people';
    case ResourceType.Planets:
    case ResourceType.Planet:
      return 'planets';
    case ResourceType.Starships:
    case ResourceType.Starship:
      return 'starships';
  }
}

@Injectable()
export class GraphqlService {
  private logger = createLogger(GraphqlService.name);
  constructor(private cachedApiService: CachedApiProxyService) {}

  async getResources(
    resourceTyoe: ResourceType,
    name?: string,
    page?: number,
  ): Promise<any> {
    const queries: string[] = [];
    name && queries.push(`search=${name}`);
    page && queries.push(`page=${page}`);
    const queryStr = queries.length ? `?${queries.join('&')}` : '';
    const url = `/api/${getApiResourceType(resourceTyoe)}/${queryStr}`;
    this.logger.debug(`resource url: ${url}`);
    const response = JSON.parse(await this.cachedApiService.get(url));
    this.logger.debug(`resource response: ${JSON.stringify(response)}`);
    return response;
  }

  async getSingleResource(
    resourceType: ResourceType,
    id: number,
  ): Promise<any> {
    const url = `/api/${getApiResourceType(resourceType)}/${id}`;
    this.logger.debug(`resource url: ${url}`);
    const serilizedResp = await this.cachedApiService.get(url);
    const response = JSON.parse(serilizedResp);
    this.logger.debug(`resource response: ${JSON.stringify(response)}`);
    return response;
  }

  isSingularResource(resourceType: ResourceType): boolean {
    return [
      ResourceType.Person,
      ResourceType.Planet,
      ResourceType.Starship,
    ].includes(resourceType);
  }
}
