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

@Resolver(() => Planet)
export class PlanetResolver {
  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => Planet)
  async planet(@IdArg() id: number) {
    return await this.swapiResourceProvider.getPlanet(id);
  }

  @ResolveField('residents', () => [Person])
  async getResidents(@Parent() planet: Planet) {
    const residentUrls = planet.residents;

    const residentsData = await Promise.all(
      residentUrls.map(async (residentUrl) => {
        if (typeof residentUrl === 'string') {
          const residentId = this.extractIdFromUrl(residentUrl);
          return await this.swapiResourceProvider.getPerson(residentId);
        }
        return residentUrl;
      }),
    );

    return residentsData;
  }

  private extractIdFromUrl(url: string) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }
}
