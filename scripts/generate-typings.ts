import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
console.log(process.cwd());
definitionsFactory.generate({
  typePaths: ['./src/schema-first-graphql/types/Author.gql'],
  path: join(process.cwd(), 'src/schema-first-graphql/types/Author.ts'),
  outputAs: 'class',
});
