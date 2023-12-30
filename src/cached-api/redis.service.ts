import { Injectable, Inject } from '@nestjs/common';
import { createLogger } from '../utils/logger-factory';

const SECONDS_IN_24H = 86400;
const timeout = 1000;

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
    return new Promise<string>((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error('Cache request timed out'));
      }, timeout);

      this.redis
        .get(key)
        .then((result) => {
          clearTimeout(timeoutHandle);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutHandle);
          reject(error);
        });
    }).catch((error) => {
      this.logger.error(`Cache operation failed: ${error}`);
      return null;
    });
  }
}
