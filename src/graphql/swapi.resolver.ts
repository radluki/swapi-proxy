import { Resolver, ResolveField, Query } from '@nestjs/graphql';
import { GraphqlService, ResourceType } from './graphql.service';
import { Swapi } from './types/swapi.type';
import { NameArg, PageArg, IdArg } from './query-args';

@Resolver(() => Swapi)
export class SwapiResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => Swapi)
  async swapi2() {
    return {};
  }

  @ResolveField()
  async person(@IdArg() id: number) {
    return await this.graphqlService.getSingleResource(ResourceType.Person, id);
  }

  @ResolveField()
  async planet(@IdArg() id: number) {
    return await this.graphqlService.getSingleResource(ResourceType.Planet, id);
  }

  @ResolveField()
  async starship(@IdArg() id: number) {
    return await this.graphqlService.getSingleResource(
      ResourceType.Starship,
      id,
    );
  }

  @ResolveField()
  async people(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getResources(
      ResourceType.People,
      name,
      page,
    );
  }

  @ResolveField()
  async planets(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getResources(
      ResourceType.Planets,
      name,
      page,
    );
  }

  @ResolveField()
  async starships(@NameArg() name: string, @PageArg() page: number) {
    return await this.graphqlService.getResources(
      ResourceType.Starships,
      name,
      page,
    );
  }
}
