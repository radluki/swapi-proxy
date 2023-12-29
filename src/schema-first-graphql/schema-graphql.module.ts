import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ArticleService } from './article.service';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { ArticleResolver } from './article.resolver';

export function createGraphqlSchemaGeneratorModule() {
  return GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    typePaths: ['./**/*.gql'],
  });
}

@Module({
  imports: [createGraphqlSchemaGeneratorModule()],
  providers: [ArticleService, AuthorService, AuthorResolver, ArticleResolver],
})
export class SchemaGraphqlModule {}
