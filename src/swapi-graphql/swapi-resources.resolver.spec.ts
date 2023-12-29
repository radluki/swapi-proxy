import { Test } from '@nestjs/testing';
import { SwapiResourcesResolver } from './swapi-resources.resolver';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createGraphqlSchemaGeneratorModule } from './swapi-graphql.module';

const mockSwapiResourceProviderService = {
  getPerson: jest.fn(),
  getPlanet: jest.fn(),
  getStarship: jest.fn(),
  getPeople: jest.fn(),
  getPlanets: jest.fn(),
  getStarships: jest.fn(),
};

describe('SwapiResourcesResolver', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [createGraphqlSchemaGeneratorModule('test-schema.gql')],
      providers: [
        SwapiResourcesResolver,
        {
          provide: 'ISwapiResourceProviderService',
          useValue: mockSwapiResourceProviderService,
        },
      ],
    }).compile();

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
    mockSwapiResourceProviderService.getPerson.mockImplementation(() => {
      return Promise.resolve(person);
    });
  }

  function mockPeople(people) {
    mockSwapiResourceProviderService.getPeople.mockImplementation(() => {
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
      mockPerson(person);

      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ ${query} { name } }`,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual({
            person: { name: person.name },
          });
          const getPersonMock = mockSwapiResourceProviderService.getPerson;
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
      mockPeople(people);
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ ${query} { results { name } } }`,
        })
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual({
            people: {
              results: people.results.map((p) => ({ name: p.name })),
            },
          });
          const getPeopleMock = mockSwapiResourceProviderService.getPeople;
          expect(getPeopleMock).toHaveBeenCalledTimes(1);
          expect(getPeopleMock).toHaveBeenCalledWith(name, page);
        });
    });
  });
});
