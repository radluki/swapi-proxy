import { mock, verify, anything, when, instance } from 'ts-mockito';
import { ConcreteCacheService } from './cache-service';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { REDIS_TTL_MS, TIMEOUT_MILLISECONDS } from '../config/config';
import { TestScheduler } from 'rxjs/testing';
import { timer, race, map, firstValueFrom } from 'rxjs';

describe('ConcreteCacheService', () => {
  let sut: ConcreteCacheService;
  let cacheMock: Cache;
  let configServiceMock: ConfigService;
  let testScheduler: TestScheduler;

  const timeout = 1000;
  const key = 'key';
  const value = 'value';

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
    verify(cacheMock.set(key, value, timeout)).once();
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
    const valueOnTimeout$ = timer(timeout - 100).pipe(map(() => value));
    const valuePromise = firstValueFrom(valueOnTimeout$);
    when(cacheMock.get(key)).thenReturn(valuePromise);
    const result = await sut.get(key);
    expect(result).toBe(value);
  });

  it('get should return null on timeout - real timeout', async () => {
    const valueOnTimeout$ = timer(timeout + 100).pipe(map(() => value));
    const valuePromise = firstValueFrom(valueOnTimeout$);
    when(cacheMock.get(key)).thenReturn(valuePromise);
    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  it('get should return value if returned short before timeout', async () => {
    testScheduler.run(async ({ cold }) => {
      const cacheManagerObservable = cold('900ms c|', { c: value });
      when(cacheMock.get(key)).thenReturn(<any>cacheManagerObservable);

      const result = await sut.get(key);
      expect(result).toBe(value);
    });
  });

  it('get should return null on timeout', async () => {
    testScheduler.run(async ({ cold }) => {
      const cacheManagerObservable = cold('2000ms c|', { c: value });
      when(cacheMock.get(key)).thenReturn(<any>cacheManagerObservable);

      const result = await sut.get(key);
      expect(result).toBeNull();
    });
  });

  // Experiments - not tests:
  function fetchDataWithTimeout(dataObservable, timeoutMs) {
    return race(dataObservable, timer(timeoutMs).pipe(map(() => 'timed out')));
  }

  it('should emit from the passed observable if it emits first', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dataObservable = cold('10ms a|', { a: 'data' });
      const timeout = 20; // milliseconds
      const expectedMarble = '10ms a|';

      const result = fetchDataWithTimeout(dataObservable, timeout);
      expectObservable(result).toBe(expectedMarble, { a: 'data' });
    });
  });

  it('should emit "timed out" if the timer emits first', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const dataObservable = cold('50ms a|', { a: 'data' });
      const timeout = 30; // milliseconds
      const expectedMarble = '30ms (b|)';

      const result = fetchDataWithTimeout(dataObservable, timeout);
      expectObservable(result).toBe(expectedMarble, { b: 'timed out' });
    });
  });

  it('cold races with timer', async () => {
    testScheduler.run(async ({ cold }) => {
      const value = 'expectedValue';
      const cold$ = cold('900ms c|', { c: value });
      const timer$ = timer(1000).pipe(map(() => 'timer'));

      // const res = race(cold$, timer$); // this works
      // const res = race(cold$, firstValueFrom(timer$)); // this works
      const res = race(firstValueFrom(cold$), firstValueFrom(timer$)); // this works

      // const res = race(firstValueFrom(cold$), timer$); // this fails
      const result = await firstValueFrom(res);
      expect(result).toBe(value);
    });
  });

  it('cold races with cold', async () => {
    testScheduler.run(async ({ cold }) => {
      const value = 'expectedValue';
      const cold$ = cold('900ms c|', { c: value });
      const cold2$ = cold('1000ms c|', { c: 'timer' });

      // const res = race(cold$, cold2$); // this works
      // const res = race(cold$, firstValueFrom(cold2$)); // this works
      const res = race(firstValueFrom(cold$), firstValueFrom(cold2$)); // this works

      // if the winner is converted to promise then it will lose in testScheduler
      // in scheduler it is recommended to mock <any>observable instead of promise
      // const res = race(firstValueFrom(cold$), cold2$); // this fails
      const result = await firstValueFrom(res);
      expect(result).toBe(value);
    });
  });
});
