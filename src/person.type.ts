import { Field, ObjectType } from '@nestjs/graphql';

const StringArrayField = Field(() => [String]);

@ObjectType()
export class Person {
  @Field()
  name: string;

  @Field()
  height: string;

  @Field()
  mass: string;

  @Field()
  hair_color: string;

  @Field()
  skin_color: string;

  @Field()
  eye_color: string;

  @Field()
  birth_year: string;

  @Field()
  gender: string;

  @Field()
  homeworld: string;

  @StringArrayField
  films: string[];

  @StringArrayField
  species: [string];

  @StringArrayField
  vehicles: [string];

  @StringArrayField
  starships: [string];

  @Field()
  url: string;

  @Field()
  created: string;

  @Field()
  edited: string;
}

@ObjectType()
export class People {
  @Field()
  count: number;

  @Field({ nullable: true })
  next: string;

  @Field({ nullable: true })
  previous: string;

  @Field(() => [Person])
  results: Person[];
}
