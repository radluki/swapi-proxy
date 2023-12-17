import { mock, instance, when, verify, reset } from 'ts-mockito';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

describe('RedisService', () => {
  let sut: RedisService;
  let redisMock: Redis;

  const key = 'KEY';
  const value = 'VALUE';

  beforeAll(async () => {
    redisMock = mock<Redis>();
    sut = new RedisService(instance(redisMock));
  });

  beforeEach(async () => {
    reset(redisMock);
  });

  describe('get', () => {
    it('should return null when key does not exist', async () => {
      when(redisMock.exists(key)).thenResolve(0);
      expect(await sut.get(key)).toBe(null);
    });

    it('should return value when key exists', async () => {
      when(redisMock.exists(key)).thenResolve(1);
      when(redisMock.get(key)).thenResolve(value);
      expect(await sut.get(key)).toBe(value);
    });

    it('should return null when redis throws an error', async () => {
      when(redisMock.exists(key)).thenResolve(1);
      when(redisMock.get(key)).thenReject(new Error('ERROR'));
      expect(await sut.get(key)).toBe(null);
    });
  });

  describe('set', () => {
    it('should set key', async () => {
      when(redisMock.set(key, value, 'EX', 86400)).thenResolve('OK');
      expect(await sut.set(key, value)).toBe(undefined);
      verify(redisMock.set(key, value, 'EX', 86400)).once();
    });

    it('should not propagate error when redis throws an error', async () => {
      when(redisMock.set(key, value, 'EX', 86400)).thenReject(
        new Error('ERROR'),
      );
      expect(await sut.set(key, value)).toBe(undefined);
      verify(redisMock.set(key, value, 'EX', 86400)).once();
    });
  });
});
