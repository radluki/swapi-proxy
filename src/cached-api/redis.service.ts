import { Injectable, Inject } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';

const SECONDS_IN_24H = 86400;

export interface RedisClient {
  set(
    key: string,
    value: string,
    mode: string,
    seconds: number,
  ): Promise<string>;
  get(key: string): Promise<string>;
  exists(key: string): Promise<number>;
}

export interface CacheService {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
}

@Injectable()
export class RedisService implements CacheService {
  private readonly logger = createLogger(RedisService.name);

  constructor(@Inject('RedisClient') private readonly redis: RedisClient) {}

  async set(key: string, value: string) {
    try {
      await this.redis.set(key, value, 'EX', SECONDS_IN_24H);
      this.logger.log(`Key ${key} set successfully`);
    } catch (err) {
      this.logger.error(`Error setting key: ${err}`);
    }
  }

  async get(key: string): Promise<string> {
    if ((await this.redis.exists(key)) !== 1) {
      return null;
    }
    try {
      const value = await this.redis.get(key);
      this.logger.debug(`Value for "${key}": "${value}"`);
      return value;
    } catch (err) {
      this.logger.error(`Error getting key: ${err}`);
    }
    return null;
  }
}
