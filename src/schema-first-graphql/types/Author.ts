/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export abstract class IQuery {
  abstract author(id: string): Nullable<Author> | Promise<Nullable<Author>>;

  abstract article(id: string): Nullable<Article> | Promise<Nullable<Article>>;
}

export class Author {
  id: string;
  name: string;
  articles?: Nullable<Nullable<Article>[]>;
}

export class Article {
  id: string;
  title: string;
  content?: Nullable<string>;
  authors?: Nullable<Nullable<Author>[]>;
}

type Nullable<T> = T | null;
