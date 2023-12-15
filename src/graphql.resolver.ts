import { Resolver, Query, Args } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { People, Person } from './person.type';

@Resolver((of) => People)
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => People)
  async people(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('page', { type: () => String, nullable: true }) page?: string,
  ) {
    return this.graphqlService.getPeople(name, page);
  }
}
