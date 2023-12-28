import { Resolver, Query, Args, Int, Info } from '@nestjs/graphql';
import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { GraphqlService, ResourceType } from './graphql.service';
import { People, Person } from './types/person.type';
import { Planet, Planets } from './types/planets.type';
import { createLogger } from '../utils/logger-factory';
import { Starship, Starships } from './types/starships.type';
import { ResourceUnion } from './types/resource.type';
import { Swapi } from './types/swapi.type';

function NameArg() {
  return Args('name', { type: () => String, nullable: true });
}

function PageArg() {
  return Args('page', { type: () => Int, nullable: true });
}

function IdArg(name = 'id') {
  return Args(name, { type: () => Int, defaultValue: 1 });
}

@Resolver()
export class GraphqlResolver {
  private readonly logger = createLogger(GraphqlResolver.name);

  constructor(private readonly graphqlService: GraphqlService) {}

  private logQuery(method: string, args: any) {
    this.logger.log(`${method} query with args: ${JSON.stringify(args)}`);
  }

  @Query(() => People)
  async people(@NameArg() name?: string, @PageArg() page?: number) {
    this.logQuery('people', { name, page });
    return this.graphqlService.getResources(ResourceType.People, name, page);
  }

  @Query(() => Person)
  async person(@IdArg() id: number) {
    this.logQuery('person', { id });
    return this.graphqlService.getSingleResource(ResourceType.People, id);
  }

  @Query(() => Planets)
  async planets(@NameArg() name?: string, @PageArg() page?: number) {
    this.logQuery('planets', { name, page });
    return this.graphqlService.getResources(ResourceType.Planets, name, page);
  }

  @Query(() => Planet)
  async planet(@IdArg() id: number) {
    this.logQuery('planet', { id });
    return this.graphqlService.getSingleResource(ResourceType.Planets, id);
  }

  @Query(() => Starships)
  async starships(@NameArg() name?: string, @PageArg() page?: number) {
    this.logQuery('starships', { name, page });
    return this.graphqlService.getResources(ResourceType.Starships, name, page);
  }

  @Query(() => Starship)
  async starship(@IdArg() id: number) {
    this.logQuery('starship', { id });
    return this.graphqlService.getSingleResource(ResourceType.Starships, id);
  }

  @Query(() => ResourceUnion)
  async resource(
    @Args('type', { type: () => String })
    type: ResourceType,
    @IdArg() id: number,
  ) {
    this.logQuery(type, { id });
    return this.graphqlService.getSingleResource(type, id);
  }

  @Query(() => Swapi)
  async swapi(
    @IdArg('personId') personId: number,
    @IdArg('planetId') planetId: number,
    @IdArg('starshipId') starshipId: number,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Swapi> {
    const requestedFields = info.fieldNodes[0].selectionSet.selections
      .filter((selection): selection is FieldNode => selection.kind === 'Field')
      .map((field) => field.name.value);

    const person = requestedFields.includes('person')
      ? await this.graphqlService.getSingleResource(
          ResourceType.People,
          personId,
        )
      : [];
    const planet = requestedFields.includes('planet')
      ? await this.graphqlService.getSingleResource(
          ResourceType.Planets,
          planetId,
        )
      : [];
    const starship = requestedFields.includes('starship')
      ? await this.graphqlService.getSingleResource(
          ResourceType.Starships,
          starshipId,
        )
      : [];

    return { person, planet, starship };
  }
}
