import { Resolver, Query, Info } from '@nestjs/graphql';
import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { GraphqlService, ResourceType } from './graphql.service';
import { createLogger } from '../utils/logger-factory';
import { Swapi } from './types/swapi.type';
import { IdArg, NameArg, PageArg } from './query-args';

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

    const person = await this.getResource(
      ResourceType.Person,
      requestedFields,
      { id: personId },
    );
    const planet = await this.getResource(
      ResourceType.Planet,
      requestedFields,
      { id: planetId },
    );
    const starship = await this.getResource(
      ResourceType.Starship,
      requestedFields,
      { id: starshipId },
    );

    const people = await this.getResource(
      ResourceType.People,
      requestedFields,
      {
        name: peopleName,
        page: peoplePage,
      },
    );
    const planets = await this.getResource(
      ResourceType.Planets,
      requestedFields,
      {
        name: planetsName,
        page: planetsPage,
      },
    );
    const starships = await this.getResource(
      ResourceType.Starships,
      requestedFields,
      {
        name: starshipName,
        page: starshipPage,
      },
    );

    return { person, planet, starship, people, planets, starships };
  }

  private async getResource(
    resourceType: ResourceType,
    requestedFields: string[],
    params: { id?: number; name?: string; page?: number },
  ) {
    if (!requestedFields.includes(resourceType)) return [];

    if (
      this.graphqlService.isSingularResource(resourceType) &&
      params.id !== undefined
    ) {
      return await this.graphqlService.getSingleResource(
        resourceType,
        params.id,
      );
    } else {
      return await this.graphqlService.getResources(
        resourceType,
        params.name,
        params.page,
      );
    }
  }
}
