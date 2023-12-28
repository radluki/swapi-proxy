import { OpeningCrawlsService } from './opening-crawl.service';
import { CachedApiService } from '../cached-api/cached-api.service';
import { mock, instance, when, reset } from 'ts-mockito';

describe('OpeningCrawlsService', () => {
  let sut: OpeningCrawlsService;
  let cachedApiServiceMock: CachedApiService;

  beforeAll(async () => {
    cachedApiServiceMock = mock<CachedApiService>();
    sut = new OpeningCrawlsService(instance(cachedApiServiceMock));
  });

  beforeEach(async () => {
    reset(cachedApiServiceMock);
  });

  it('countWords', async () => {
    const getResp = {
      results: [
        { opening_crawl: ' one,.,. !@two,!     R2-D2\nthree....' },
        { opening_crawl: '\none\r\ntwo    three,\rthree!\nthree\n' },
      ],
    };
    const serializedGetResp = JSON.stringify(getResp);
    when(cachedApiServiceMock.get('/api/films/')).thenResolve(
      serializedGetResp,
    );

    const serializedObj = await sut.countWords();
    const obj = JSON.parse(serializedObj);

    expect(obj).toEqual({
      one: 2,
      two: 2,
      three: 4,
      r2d2: 1,
    });
  });

  it('getNamesWithTheMostOccurences', async () => {
    const page1 = {
      next: 'https://swapi.dev/api/people/?page=2',
      results: [{ name: 'Luke Skywalker' }, { name: 'Leia Morgana' }],
    };
    const serializedPage1 = JSON.stringify(page1);
    when(cachedApiServiceMock.get('/api/people/')).thenResolve(serializedPage1);

    const page2 = {
      next: null,
      results: [{ name: 'Dooku' }, { name: 'Han Solo' }],
    };
    const serializedPage2 = JSON.stringify(page2);
    when(cachedApiServiceMock.get('/api/people/?page=2')).thenResolve(
      serializedPage2,
    );

    const filmsResp = {
      results: [
        { opening_crawl: ' Luke\r\nSkYwalker, Luke, Dooku, ' },
        {
          opening_crawl:
            '\none\r\ntwo Luke Han  Han Solo Dooku Luke  skywalker ree\n',
        },
      ],
    };
    const serializedFilmsResp = JSON.stringify(filmsResp);
    when(cachedApiServiceMock.get('/api/films/')).thenResolve(
      serializedFilmsResp,
    );

    const serializedObj = await sut.getNamesWithTheMostOccurences();
    const obj = JSON.parse(serializedObj);
    expect(obj.sort()).toEqual(['luke skywalker', 'dooku'].sort());
  });
});
