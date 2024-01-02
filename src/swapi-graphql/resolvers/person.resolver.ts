import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import {
  ISwapiResourceProviderService,
  extractIdFromUrl,
} from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Starship } from '../types/starships.type';

@Resolver(() => Person)
export class PersonResolver {
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
    const urls = planet.starships;

    const data = await Promise.all(
      urls.map(async (url) => {
        if (typeof url === 'string') {
          const id = extractIdFromUrl(url);
          return await this.swapiResourceProvider.getStarship(id);
        }
        return url;
      }),
    );

    return data;
  }
}
