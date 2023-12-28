import { Resolver, ResolveField, Query } from '@nestjs/graphql';
import { IGraphqlService } from './graphql.service';
import { Swapi } from './types/swapi.type';
import { NameArg, PageArg, IdArg } from './query-args';
import { Inject } from '@nestjs/common';

@Resolver(() => Swapi)
export class SwapiResolver {
  constructor(
    @Inject('IGraphqlService') private readonly graphqlService: IGraphqlService,
  ) {}

  @Query(() => Swapi)
  async swapi() {
    return {};
  }

  @ResolveField()
  async person(@IdArg() id: number) {
    return await this.graphqlService.getPerson(id);
  }

  @ResolveField()
  async planet(@IdArg() id: number) {
    return await this.graphqlService.getPlanet(id);
  }

  @ResolveField()
  async starship(@IdArg() id: number) {
    return await this.graphqlService.getStarship(id);
  }

  @ResolveField()
  async people(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getPeople(name, page);
  }

  @ResolveField()
  async planets(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getPlanets(name, page);
  }

  @ResolveField()
  async starships(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getStarships(name, page);
  }
}
