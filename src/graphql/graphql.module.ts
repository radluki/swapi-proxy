import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { GraphqlResolver } from './graphql.resolver';
import { GraphqlService } from './graphql.service';
import { CachedApiModule } from '../cached-api/cached-api.module';
import { SwapiResolver } from './swapi.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    CachedApiModule,
  ],
  providers: [SwapiResolver, GraphqlResolver, GraphqlService],
})
export class GraphqlModule {}
