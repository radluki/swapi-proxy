import { Resolver, Query, Args, Int, Info } from '@nestjs/graphql';
import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { GraphqlService, ResourceType } from './graphql.service';
import { createLogger } from '../utils/logger-factory';
import { Swapi } from './types/swapi.type';

function NameArg(name = 'name') {
  return Args(name, { type: () => String, nullable: true });
}

function PageArg(name = 'page') {
  return Args(name, { type: () => Int, nullable: true });
}

function IdArg(name = 'id') {
  return Args(name, { type: () => Int, defaultValue: 1 });
}

@Resolver()
export class GraphqlResolver {
  private readonly logger = createLogger(GraphqlResolver.name);

  constructor(private readonly graphqlService: GraphqlService) {}

  @Query(() => Swapi)
  async swapi(
    @IdArg('personId') personId: number,
    @IdArg('planetId') planetId: number,
    @IdArg('starshipId') starshipId: number,
    @Info() info: GraphQLResolveInfo,
    @NameArg('peopleName') peopleName?: string,
    @PageArg('peoplePage') peoplePage?: number,
    @NameArg('planetsName') planetsName?: string,
    @PageArg('planetsPage') planetsPage?: number,
    @NameArg('starshipName') starshipName?: string,
    @PageArg('starshipPage') starshipPage?: number,
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
    const people = requestedFields.includes('people')
      ? await this.graphqlService.getResources(
          ResourceType.People,
          peopleName,
          peoplePage,
        )
      : [];
    const planets = requestedFields.includes('planets')
      ? await this.graphqlService.getResources(
          ResourceType.Planets,
          planetsName,
          planetsPage,
        )
      : [];

    const starships = requestedFields.includes('starships')
      ? await this.graphqlService.getResources(
          ResourceType.Starships,
          starshipName,
          starshipPage,
        )
      : [];

    return { person, planet, starship, people, planets, starships };
  }
}
