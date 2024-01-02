import { Resolver, Query } from '@nestjs/graphql';
import { ISwapiResourceProviderService } from './swapi-resource-provider.service';
import { NameArg, PageArg } from './query-args';
import { Inject } from '@nestjs/common';
import { People } from './types/person.type';
import { Planets } from './types/planets.type';
import { Starships } from './types/starships.type';

@Resolver()
export class SwapiResourcesResolver {
  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => People)
  async people(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getPeople(name, page);
  }

  @Query(() => Planets)
  async planets(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getPlanets(name, page);
  }

  @Query(() => Starships)
  async starships(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getStarships(name, page);
  }
}
