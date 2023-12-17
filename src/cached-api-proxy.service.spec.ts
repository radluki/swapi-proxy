import { instance, mock, when, verify, anything, reset } from 'ts-mockito';
import { ApiProxyService } from './api-proxy.service';
import { CachedApiProxyService } from './cached-api-proxy.service';
import { CacheService } from './redis.service';

describe('CachedApiProxyService', () => {
  let sut: CachedApiProxyService;
  let apiProxyServiceMock: ApiProxyService;
  let cacheServiceMock: CacheService;

  const key = 'people/1/';
  const value = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
  };
  const valueStr = JSON.stringify(value);

  beforeAll(async () => {
    apiProxyServiceMock = mock<ApiProxyService>();
    cacheServiceMock = mock<CacheService>();
  });

  beforeEach(async () => {
    reset(apiProxyServiceMock);
    reset(cacheServiceMock);
    sut = new CachedApiProxyService(
      instance(apiProxyServiceMock),
      instance(cacheServiceMock),
    );
  });

  describe('get', () => {
    it('should not access api when cache available', async () => {
      when(cacheServiceMock.get(key)).thenResolve(JSON.stringify(value));

      const resultStr = await sut.get(key);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(apiProxyServiceMock.get(anything())).never();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should access api and set cache when cache returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(apiProxyServiceMock.get(key)).thenResolve(valueStr);

      const resultStr = await sut.get(key);
      expect(resultStr).toBe(valueStr);

      verify(cacheServiceMock.get(key)).once();
      verify(apiProxyServiceMock.get(key)).once();
      verify(cacheServiceMock.set(key, resultStr)).once();
    });

    it('should not set cache when api returns null', async () => {
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(apiProxyServiceMock.get(key)).thenResolve(null);

      const result = await sut.get(key);
      expect(result).toBeNull();

      verify(cacheServiceMock.get(key)).once();
      verify(apiProxyServiceMock.get(key)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });

    it('should propagate exception when api rejects', async () => {
      const err = new Error('ERROR667');
      when(cacheServiceMock.get(key)).thenResolve(null);
      when(apiProxyServiceMock.get(key)).thenReject(err);

      await expect(sut.get(key)).rejects.toEqual(err);

      verify(cacheServiceMock.get(key)).once();
      verify(apiProxyServiceMock.get(key)).once();
      verify(cacheServiceMock.set(anything(), anything())).never();
    });
  });
});
