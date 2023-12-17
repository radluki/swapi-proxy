import { instance, mock, when, verify, anything, reset } from 'ts-mockito';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { CacheService } from './redis.service';
import { HttpRequestSender } from './http-request-sender';

describe('CachedApiProxyService', () => {
  let sut: CachedApiProxyService;
  let cacheServiceMock: CacheService;
  let httpRequestSenderMock: HttpRequestSender;

  const key = '/api/people/1/';
  const value = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
  };
  const valueStr = JSON.stringify(value);
  const swapiUrl = 'https://swapi.dev';
  const fullUrlWithKey = `${swapiUrl}${key}`;

  beforeAll(async () => {
    cacheServiceMock = mock<CacheService>();
    httpRequestSenderMock = mock<HttpRequestSender>();
  });

  beforeEach(async () => {
    reset(httpRequestSenderMock);
    reset(cacheServiceMock);
    sut = new CachedApiProxyService(
      swapiUrl,
      instance(httpRequestSenderMock),
      instance(cacheServiceMock),
    );
  });

  describe('get', () => {
    it('should not access api when cache available', async () => {
      when(cacheServiceMock.get(key)).thenResolve(JSON.stringify(value));

      const resultStr = await sut.get(key);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(anything())).never();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should access api and set cache when cache returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(fullUrlWithKey)).thenResolve(valueStr);

      const resultStr = await sut.get(key);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(key, resultStr)).once();
    });

    it('should not set cache when api returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(fullUrlWithKey)).thenResolve(null);

      const result = await sut.get(key);
      expect(result).toBeNull();

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should propagate exception when api rejects', async () => {
      const err = new Error('ERROR667');
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(fullUrlWithKey)).thenReject(err);

      await expect(sut.get(key)).rejects.toEqual(err);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });
  });
});
