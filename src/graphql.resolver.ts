import { Resolver, Query, Args } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { Person } from './person.type';

@Resolver((of) => Person)
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => [Person])
  async people(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('page', { type: () => String, nullable: true }) page?: string,
  ) {
    return this.graphqlService.getPeople(name, page);
  }
}
