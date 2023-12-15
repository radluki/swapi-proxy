import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';

// GraphQL schema
const schema = buildSchema(`
  type Query {
    people(name: String): [Person]
  }
  type Person {
    name: String
    height: String
    mass: String
    gender: String
    homeworld: String
  }
`);

// Resolver function to get people from SWAPI
const getPeople = async (args: { name?: string }) => {
  const queryStr = args.name ? '?search=' + args.name : '';
  const url = `https://swapi.dev/api/people/${queryStr}`;
  const response = await axios.get(url);
  return response.data.results;
};

// Root resolver
const root = {
  people: getPeople,
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000, () =>
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql'),
);


// curl -X POST -H "Content-Type: application/json" --data '{ "query": "{ people(name: \"Luke\") { name height gender homeworld } }" }' http://localhost:4000/graphql