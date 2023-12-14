import { Injectable, Inject } from '@nestjs/common';
import { createLogger } from './logger-factory';

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

@Injectable()
export class RedisService {
  private readonly logger = createLogger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClient) {}

  async set(key: string, value: string) {
    try {
      await this.redis.set(key, value, 'EX', SECONDS_IN_24H);
      this.logger.log(`Key set: ${key}`);
    } catch (err) {
      this.logger.error(`Error setting key: ${err}`);
    }
  }

  async get(key: string): Promise<string | null> {
    if ((await this.redis.exists(key)) !== 1) {
      return null;
    }
    try {
      const value = await this.redis.get(key);
      this.logger.log(`Value for "${key}": "${value}"`);
      return value;
    } catch (err) {
      this.logger.error(`Error getting key: ${err}`);
    }
    return null;
  }
}
