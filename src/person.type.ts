import { Field, ObjectType } from '@nestjs/graphql';

const ArrayField = Field(() => [String], { nullable: true });

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

  @ArrayField
  films: string[];

  @ArrayField
  species: [string];

  @ArrayField
  vehicles: [string];

  @ArrayField
  starships: [string];

  @Field()
  url: string;

  @Field()
  created: string;

  @Field()
  edited: string;
}
