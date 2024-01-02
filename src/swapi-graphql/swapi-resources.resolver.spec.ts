import { Test, TestingModule } from '@nestjs/testing';
import { SwapiResourcesResolver } from './swapi-resources.resolver';
import { PlanetResolver } from './resolvers/planet.resolver';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createGraphqlSchemaGeneratorModule } from './swapi-graphql.module';
import { PersonResolver } from './resolvers/person.resolver';
import { StarshipResolver } from './resolvers/starship.resolver';

const serviceMock = {
  getPerson: jest.fn(),
  getPlanet: jest.fn(),
  getStarship: jest.fn(),
  getPeople: jest.fn(),
  getPlanets: jest.fn(),
  getStarships: jest.fn(),
};

describe('SwapiResourcesResolver', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let resolver: SwapiResourcesResolver;
  let planetResolver: PlanetResolver;
  let personResolver: PersonResolver;
  let starshipResolver: StarshipResolver;

  const name = 'Luke';
  const page = 3;
  const id = 2;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [createGraphqlSchemaGeneratorModule('test-schema.gql')],
      providers: [
        SwapiResourcesResolver,
        PlanetResolver,
        PersonResolver,
        StarshipResolver,
        {
          provide: 'ISwapiResourceProviderService',
          useValue: serviceMock,
        },
      ],
    }).compile();

    resolver = moduleFixture.get(SwapiResourcesResolver);
    planetResolver = moduleFixture.get(PlanetResolver);
    personResolver = moduleFixture.get(PersonResolver);
    starshipResolver = moduleFixture.get(StarshipResolver);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  function mockPerson(person) {
    serviceMock.getPerson.mockImplementation(() => {
      return Promise.resolve(person);
    });
  }

  function mockPeople(people) {
    serviceMock.getPeople.mockImplementation(() => {
      return Promise.resolve(people);
    });
  }

  it('query with a field not in schema should cause bad request', async () => {
    const person = { name: 'NAME', eye_color: 'blue', xx: 'xx' };
    mockPerson(person);
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ person { name xx } }',
      })
      .expect(400);
  });

  it('person calls getPerosn', async () => {
    personResolver.person(id);
    expect(serviceMock.getPerson).toHaveBeenCalledTimes(1);
    expect(serviceMock.getPerson).toHaveBeenCalledWith(id);
  });

  it('planet calls getPlanet', async () => {
    planetResolver.planet(id);
    expect(serviceMock.getPlanet).toHaveBeenCalledTimes(1);
    expect(serviceMock.getPlanet).toHaveBeenCalledWith(id);
  });

  it('starship calls getStarship', async () => {
    starshipResolver.starship(id);
    expect(serviceMock.getStarship).toHaveBeenCalledTimes(1);
    expect(serviceMock.getStarship).toHaveBeenCalledWith(id);
  });

  it('people calls getPeople', async () => {
    resolver.people(name, page);
    expect(serviceMock.getPeople).toHaveBeenCalledTimes(1);
    expect(serviceMock.getPeople).toHaveBeenCalledWith(name, page);
  });

  it('planets calls getPlanets', async () => {
    resolver.planets(name, page);
    expect(serviceMock.getPlanets).toHaveBeenCalledTimes(1);
    expect(serviceMock.getPlanets).toHaveBeenCalledWith(name, page);
  });

  it('starships calls getStarships', async () => {
    resolver.starships(name, page);
    expect(serviceMock.getStarships).toHaveBeenCalledTimes(1);
    expect(serviceMock.getStarships).toHaveBeenCalledWith(name, page);
  });

  describe('valid queries', () => {
    test.each([
      ['person', 1],
      ['person(id: 2)', 2],
    ])('%s', (query, id) => {
      const person = {
        eye_color: 'green',
        name: 'Luke Skaywalker',
        invalid: 'invalid',
      };
      const filteredPerson = { name: person.name };
      mockPerson(person);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ ${query} { name } }`,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual({
            person: filteredPerson,
          });
          const getPersonMock = serviceMock.getPerson;
          expect(getPersonMock).toHaveBeenCalledTimes(1);
          expect(getPersonMock).toHaveBeenCalledWith(id);
        });
    });

    test.each([
      ['people', undefined, undefined],
      ['people(name: "Luke")', 'Luke', undefined],
      ['people(name: "Luke", page: 3)', 'Luke', 3],
      ['people(page: 3)', undefined, 3],
    ])('%s', (query, name, page) => {
      const people = {
        results: [
          {
            name: 'Luke Skaywalker',
            eye_color: 'green',
            invalid: 'invalid',
          },
        ],
      };
      const filteredPeople = {
        results: people.results.map((p) => ({ name: p.name })),
      };
      mockPeople(people);
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ ${query} { results { name } } }`,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual({
            people: filteredPeople,
          });
          const getPeopleMock = serviceMock.getPeople;
          expect(getPeopleMock).toHaveBeenCalledTimes(1);
          expect(getPeopleMock).toHaveBeenCalledWith(name, page);
        });
    });
  });
});
