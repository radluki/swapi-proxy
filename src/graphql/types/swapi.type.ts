import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from './person.type';
import { Planet } from './planets.type';
import { Starship } from './starships.type';

@ObjectType()
export class Swapi {
  @Field({ nullable: true })
  person: Person;

  @Field({ nullable: true })
  planet: Planet;

  @Field({ nullable: true })
  starship: Starship;
}
