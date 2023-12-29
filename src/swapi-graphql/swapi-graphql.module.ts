import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { SwapiResourceProviderAdapter } from './swapi-resource-provider.service';
import { SwapiResourceProvider } from './swapi-resource-provider';
import { CachedApiModule } from '../cached-api/cached-api.module';
import { SwapiResolver } from './swapi.resolver';
import { SwapiResourcesResolver } from './swapi-resources.resolver';

export function createGraphqlSchemaGeneratorModule(autoSchemaFile: string) {
  return GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile,
    playground: true,
  });
}

function getSchemaPath() {
  return path.join(process.cwd(), 'schema.gql');
}

@Module({
  imports: [
    createGraphqlSchemaGeneratorModule(getSchemaPath()),
    CachedApiModule,
  ],
  providers: [
    SwapiResourcesResolver,
    SwapiResolver,
    {
      provide: 'ISwapiResourceProviderService',
      useClass: SwapiResourceProviderAdapter,
    },
    SwapiResourceProvider,
  ],
})
export class SwapiGraphqlModule {}
