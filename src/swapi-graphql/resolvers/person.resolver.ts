import { Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ISwapiResourceProviderService, extractIdFromUrl } from '../swapi-resource-provider.service';
import { IdArg } from '../query-args';
import { Inject } from '@nestjs/common';
import { Person } from '../types/person.type';
import { Planet } from '../types/planets.type';

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
}
