import { createUnionType } from '@nestjs/graphql';
import { Starship } from './starships.type';
import { Person } from './person.type';
import { Planet } from './planets.type';

export const ResourceUnion = createUnionType({
  name: 'Resource',
  types: () => [Starship, Person, Planet],
  resolveType(value) {
    if ('manufacturer' in value) {
      console.log('Starship');
      return 'Starship';
    }
    if ('hair_color' in value) {
      console.log('Person');
      return 'Person';
    }
    if ('terrain' in value) {
      console.log('Planet');
      return 'Planet';
    }
    return null;
  },
});
