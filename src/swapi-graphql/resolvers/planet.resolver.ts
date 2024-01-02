import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import {
  ISwapiResourceProviderService,
  extractIdFromUrl,
} from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Planet } from '../types/planets.type';

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
          const residentId = extractIdFromUrl(residentUrl);
          return await this.swapiResourceProvider.getPerson(residentId);
        }
        return residentUrl;
      }),
    );

    return residentsData;
  }
}
