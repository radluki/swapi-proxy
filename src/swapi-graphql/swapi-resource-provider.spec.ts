import { CachedApiService } from '../cached-api/cached-api.service';
import {
  SwapiResourceProvider,
  SwapiResourceType,
} from './swapi-resource-provider';
import { mock, instance, verify } from 'ts-mockito';

describe('SwapiResourceProvider', () => {
  let cachedApiService: CachedApiService;
  let sut: SwapiResourceProvider;

  beforeEach(() => {
    cachedApiService = mock(CachedApiService);
    sut = new SwapiResourceProvider(instance(cachedApiService));
  });

  describe('getResources', () => {
    test.each([
      ['people', SwapiResourceType.People, 'Luke', 11],
      ['planets', SwapiResourceType.Planets, 'Tatooine', 1],
      ['starships', SwapiResourceType.Starships, 'Death Star', 2],
    ])(
      'getResources should call cachedApiService.get with correct %s url',
      async (resourceType, enumResourceType, name, page) => {
        const url = `/api/${resourceType}/?search=${name}&page=${page}`;
        await sut.getResources(enumResourceType, name, page);
        verify(cachedApiService.get(url)).once();
      },
    );

    test.each([
      ['people', SwapiResourceType.People, 22],
      ['planets', SwapiResourceType.Planets, 12],
      ['starships', SwapiResourceType.Starships, 3],
    ])(
      'getSingleResource should call cachedApiService.get with correct %s url',
      async (resourceType, enumResourceType, id) => {
        const url = `/api/${resourceType}/${id}`;
        await sut.getSingleResource(enumResourceType, id);
        verify(cachedApiService.get(url)).once();
      },
    );
  });
});
