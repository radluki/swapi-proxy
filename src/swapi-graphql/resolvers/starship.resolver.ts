import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import {
  ISwapiResourceProviderService,
  extractIdFromUrl,
} from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Starship } from '../types/starships.type';

@Resolver(() => Starship)
export class StarshipResolver {
  constructor(
    @Inject('ISwapiResourceProviderService')
    private readonly swapiResourceProvider: ISwapiResourceProviderService,
  ) {}

  @Query(() => Starship)
  async starship(@IdArg() id: number) {
    return await this.swapiResourceProvider.getStarship(id);
  }

  @ResolveField('pilots', () => [Person])
  async getPilots(@Parent() planet: Starship) {
    const urls = planet.pilots as unknown as string[];
    const data = await Promise.all(
      urls
        .map(extractIdFromUrl)
        .map((id: number) => this.swapiResourceProvider.getPerson(id)),
    );
    return data;
  }
}
