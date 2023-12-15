import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { People, Person } from './person.type';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => People)
  async people(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
  ) {
    return this.graphqlService.getPeople(name, page);
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number) {
    return this.graphqlService.getPerson(id);
  }
}
