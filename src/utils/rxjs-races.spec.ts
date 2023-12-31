import { TestScheduler } from 'rxjs/testing';
import { timer, race, map, firstValueFrom } from 'rxjs';

describe('Experiments rxjs', () => {
  let testScheduler: TestScheduler;

  beforeEach(async () => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

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
