import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from './person.type';

const StringArrayField = Field(() => [String]);

@ObjectType()
export class Planet {
  @Field()
  name: string;

  @Field()
  rotation_period: string;

  @Field()
  orbital_period: string;

  @Field()
  diameter: string;

  @Field()
  climate: string;

  @Field()
  gravity: string;

  @Field()
  terrain: string;

  @Field()
  surface_water: string;

  @Field()
  population: string;

  @Field(() => [Person])
  residents: Person[];

  @StringArrayField
  films: [string];

  @Field()
  url: string;

  @Field()
  created: string;

  @Field()
  edited: string;
}

@ObjectType()
export class Planets {
  @Field()
  count: number;

  @Field({ nullable: true })
  next: string;

  @Field({ nullable: true })
  previous: string;

  @Field(() => [Planet])
  results: Planet[];
}
