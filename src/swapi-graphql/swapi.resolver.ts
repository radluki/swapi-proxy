import { Resolver, ResolveField, Query } from '@nestjs/graphql';
import { ISwapiResourceProviderService } from './swapi-resource-provider.service';
import { Swapi } from './types/swapi.type';
import { NameArg, PageArg, IdArg } from './query-args';
import { Inject } from '@nestjs/common';

@Resolver(() => Swapi)
export class SwapiResolver {
  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => Swapi)
  async swapi() {
    return {};
  }

  @ResolveField()
  async person(@IdArg() id: number) {
    return await this.swapiResourceProvider.getPerson(id);
  }

  @ResolveField()
  async planet(@IdArg() id: number) {
    return await this.swapiResourceProvider.getPlanet(id);
  }

  @ResolveField()
  async starship(@IdArg() id: number) {
    return await this.swapiResourceProvider.getStarship(id);
  }

  @ResolveField()
  async people(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getPeople(name, page);
  }

  @ResolveField()
  async planets(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getPlanets(name, page);
  }

  @ResolveField()
  async starships(@NameArg() name: string, @PageArg() page: number) {
    return await this.swapiResourceProvider.getStarships(name, page);
  }
}
