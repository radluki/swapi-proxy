import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from './person.type';

const StringArrayField = Field(() => [String]);

@ObjectType()
export class Starship {
  @Field()
  name: string;

  @Field()
  model: string;

  @Field()
  manufacturer: string;

  @Field()
  cost_in_credits: string;

  @Field()
  length: string;

  @Field()
  max_atmosphering_speed: string;

  @Field()
  crew: string;

  @Field()
  passengers: string;

  @Field()
  cargo_capacity: string;

  @Field()
  consumables: string;

  @Field()
  hyperdrive_rating: string;

  @Field()
  MGLT: string;

  @Field()
  starship_class: string;

  @Field(() => [Person])
  pilots: [Person];

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
export class Starships {
  @Field()
  count: number;

  @Field({ nullable: true })
  next: string;

  @Field({ nullable: true })
  previous: string;

  @Field(() => [Starship])
  results: Starship[];
}
