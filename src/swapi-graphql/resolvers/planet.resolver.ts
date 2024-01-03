import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import {
  ISwapiResourceProviderService,
  extractIdFromUrl,
} from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Planet } from '../types/planets.type';
import { getPromiseRejectionHandler } from './utils';
import { createLogger } from 'src/utils/logger-factory';

@Resolver(() => Planet)
export class PlanetResolver {
  private readonly logger = createLogger(PlanetResolver.name);

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
    const urls = planet.residents as unknown as string[];
    const data = await Promise.all(
      urls
        .map(extractIdFromUrl)
        .map((id: number) =>
          this.swapiResourceProvider
            .getPerson(id)
            .catch(getPromiseRejectionHandler(this.logger)),
        ),
    );
    return data.filter((x) => !!x);
  }
}
