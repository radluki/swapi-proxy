import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => [Article], { nullable: 'itemsAndList' })
  articles?: Nullable<Article>[];
}

@ObjectType()
export class Article {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field((type) => [Author], { nullable: 'itemsAndList' })
  authors?: Nullable<Author>[];
}

type Nullable<T> = T | null;
