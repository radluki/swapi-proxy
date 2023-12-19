import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { GraphqlService } from './graphql.service';
import { People, Person } from './person.type';
import { createLogger } from './logger-factory';

@Resolver()
export class GraphqlResolver {
  private readonly logger = createLogger(GraphqlResolver.name);

  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => People)
  async people(
    @Args('name', { type: () => String, nullable: true }) name?: string,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
  ) {
    this.logger.log(`people query with name: ${name}, page: ${page}`);
    return this.graphqlService.getPeople(name, page);
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number) {
    this.logger.log(`person query with id: ${id}`);
    return this.graphqlService.getPerson(id);
  }
}
