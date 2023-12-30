import {
  instance,
  mock,
  when,
  verify,
  anything,
  reset,
  deepEqual,
} from 'ts-mockito';
import { CachedApiService } from './cached-api.service';
import { CacheService } from './cache-service';
import { HttpRequestSender } from './http-request-sender';
import { ConfigService } from '@nestjs/config';
import { PORT, SWAPI_PROXY_URL, SWAPI_URL } from '../config/config';

describe('CachedApiService', () => {
  let sut: CachedApiService;
  let cacheServiceMock: CacheService;
  let httpRequestSenderMock: HttpRequestSender;
  let configServiceMock: ConfigService;

  const relativeUrl = '/api/people/1/';
  const key = ':3000/api/people/1/';
  const value = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
  };
  const valueStr = JSON.stringify(value);
  const swapiUrl = 'https://swapi.dev';
  const swapiProxyDomain = 'http://swapi-proxy.dev';
  const fullUrlWithKey = `${swapiUrl}${relativeUrl}`;

  beforeAll(async () => {
    cacheServiceMock = mock<CacheService>();
    httpRequestSenderMock = mock<HttpRequestSender>();
    configServiceMock = mock<ConfigService>();

    when(configServiceMock.get<string>(SWAPI_PROXY_URL)).thenReturn(
      swapiProxyDomain,
    );
    when(configServiceMock.get<string>(SWAPI_URL)).thenReturn(swapiUrl);
    when(configServiceMock.get<number>(PORT)).thenReturn(3000);
  });

  beforeEach(async () => {
    reset(httpRequestSenderMock);
    reset(cacheServiceMock);
    sut = new CachedApiService(
      instance(httpRequestSenderMock),
      instance(cacheServiceMock),
      instance(configServiceMock),
    );
  });

  describe('get', () => {
    it('should not access api when cache available', async () => {
      when(cacheServiceMock.get(key)).thenResolve(JSON.stringify(value));

      const resultStr = await sut.get(relativeUrl);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(anything())).never();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should access api and set cache when cache returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(deepEqual(fullUrlWithKey))).thenResolve(
        valueStr,
      );

      const resultStr = await sut.get(relativeUrl);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(key, resultStr)).once();
    });

    it('should not set cache when api returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(fullUrlWithKey)).thenResolve(null);

      const result = await sut.get(relativeUrl);
      expect(result).toBeNull();

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should propagate exception when api rejects', async () => {
      const err = new Error('ERROR667');
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(httpRequestSenderMock.get(fullUrlWithKey)).thenReject(err);

      await expect(sut.get(relativeUrl)).rejects.toEqual(err);

      verify(cacheServiceMock.get(key)).once();
      verify(httpRequestSenderMock.get(fullUrlWithKey)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });
  });
});
