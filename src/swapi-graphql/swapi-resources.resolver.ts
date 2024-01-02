import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ISwapiResourceProviderService } from './swapi-resource-provider.service';
import { NameArg, PageArg, IdArg } from './query-args';
import { Inject } from '@nestjs/common';
import { People, Person } from './types/person.type';
import { Planet, Planets } from './types/planets.type';
import { Starship, Starships } from './types/starships.type';

@Resolver()
export class SwapiResourcesResolver {
  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => Person)
  async person(@IdArg() id: number) {
    return await this.swapiResourceProvider.getPerson(id);
  }

  @Query(() => Starship)
  async starship(@IdArg() id: number) {
    return await this.swapiResourceProvider.getStarship(id);
  }

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
