import { Resolver, Query, Args } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { People } from './person.type';

@Resolver()
export class GraphqlResolver {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => People)
  async people(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('page', { type: () => Number, nullable: true }) page?: string,
  ) {
    return this.graphqlService.getPeople(name, page);
  }
}
