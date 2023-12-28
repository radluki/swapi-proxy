import { Field, ObjectType } from '@nestjs/graphql';
import { Person, People } from './person.type';
import { Planet, Planets } from './planets.type';
import { Starship, Starships } from './starships.type';

function NullableField() {
  return Field({ nullable: true });
}

@ObjectType()
export class Swapi {
  @NullableField()
  person: Person;

  @NullableField()
  planet: Planet;

  @NullableField()
  starship: Starship;

  @NullableField()
  people: People;

  @NullableField()
  planets: Planets;

  @NullableField()
  starships: Starships;
}
