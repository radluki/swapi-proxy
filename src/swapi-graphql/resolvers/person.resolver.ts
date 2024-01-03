import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import {
  ISwapiResourceProviderService,
  extractIdFromUrl,
} from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Starship } from '../types/starships.type';
import { getPromiseRejectionHandler } from './utils';
import { createLogger } from '../../utils/logger-factory';

@Resolver(() => Person)
export class PersonResolver {
  private readonly logger = createLogger(PersonResolver.name);

  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => Person)
  async person(@IdArg() id: number) {
    return await this.swapiResourceProvider.getPerson(id);
  }

  @ResolveField('starships', () => [Starship])
  async getStarships(@Parent() planet: Person) {
    const urls = planet.starships as unknown as string[];
    const data = await Promise.all(
      urls
        .map(extractIdFromUrl)
        .map((id) =>
          this.swapiResourceProvider
            .getStarship(id)
            .catch(getPromiseRejectionHandler(this.logger)),
        ),
    );
    return data.filter((x) => !!x);
  }
}
