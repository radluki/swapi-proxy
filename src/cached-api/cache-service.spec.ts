import { mock, verify, anything, when, instance, deepEqual } from 'ts-mockito';
import { ConcreteCacheService } from './cache-service';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { REDIS_TTL_MS, TIMEOUT_MILLISECONDS } from '../config/config';
import { TestScheduler } from 'rxjs/testing';
import { timer, map, firstValueFrom } from 'rxjs';

describe('ConcreteCacheService', () => {
  let sut: ConcreteCacheService;
  let cacheMock: Cache;
  let configServiceMock: ConfigService;
  let testScheduler: TestScheduler;

  const timeout = 1000;
  const key = 'key';
  const value = '{"data":"value"}';
  const valueObj = JSON.parse(value);

  beforeEach(async () => {
    cacheMock = mock<Cache>();
    configServiceMock = mock<ConfigService>();
    sut = new ConcreteCacheService(
      instance(cacheMock),
      instance(configServiceMock),
    );
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    when(configServiceMock.get<number>(TIMEOUT_MILLISECONDS)).thenReturn(
      timeout,
    );
  });

  it('set should set cache with proper args', async () => {
    when(configServiceMock.get<number>(REDIS_TTL_MS)).thenReturn(timeout);
    await sut.set(key, value);
    verify(cacheMock.set(key, deepEqual(JSON.parse(value)), timeout)).once();
  });

  it('set should not propagate errors from config', async () => {
    when(configServiceMock.get<number>(REDIS_TTL_MS)).thenThrow(new Error());
    await sut.set(key, value);
  });

  it('set should not propagate errors from cache', async () => {
    when(configServiceMock.get<number>(REDIS_TTL_MS)).thenReturn(timeout);
    when(cacheMock.set(anything(), anything(), anything())).thenThrow(
      new Error(),
    );
    await sut.set(key, value);
  });

  it('get should return value from cache', async () => {
    when(cacheMock.get(key)).thenResolve(value);
    const result = await sut.get(key);
    expect(result).toBe(value);
  });

  it('get should return valueObj stringified from cache', async () => {
    when(cacheMock.get(key)).thenResolve(valueObj);
    const result = await sut.get(key);
    expect(result).toBe(value);
  });

  it('get should return null when cache returns null', async () => {
    when(cacheMock.get(key)).thenResolve(null);
    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  it('get should return null when cache rejects', async () => {
    when(cacheMock.get(key)).thenReject(new Error());
    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  it('get should return value if returned short before timeout - real timeout', async () => {
    const valueOnTimeout$ = timer(timeout - 100).pipe(map(() => valueObj));
    const valuePromise = firstValueFrom(valueOnTimeout$);
    when(cacheMock.get(key)).thenReturn(valuePromise);
    const result = await sut.get(key);
    expect(result).toBe(value);
  });

  it('get should return null on timeout - real timeout', async () => {
    const valueOnTimeout$ = timer(timeout + 100).pipe(map(() => valueObj));
    const valuePromise = firstValueFrom(valueOnTimeout$);
    when(cacheMock.get(key)).thenReturn(valuePromise);
    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  it('get should return value if returned short before timeout', async () => {
    testScheduler.run(async ({ cold }) => {
      const cacheManagerObservable = cold('900ms c|', { c: valueObj });
      when(cacheMock.get(key)).thenReturn(<any>cacheManagerObservable);

      const result = await sut.get(key);
      expect(result).toBe(value);
    });
  });

  it('get should return null on timeout', async () => {
    testScheduler.run(async ({ cold }) => {
      const cacheManagerObservable = cold('2000ms c|', { c: valueObj });
      when(cacheMock.get(key)).thenReturn(<any>cacheManagerObservable);

      const result = await sut.get(key);
      expect(result).toBeNull();
    });
  });
});
