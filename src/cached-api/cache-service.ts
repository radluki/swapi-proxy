import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createLogger } from '../utils/logger-factory';
import { CacheService } from './redis.service';

const MILLISECONDS_IN_24H = 86400 * 1000;
const timeout = 1000;

@Injectable()
export class ConcreteCacheService implements CacheService {
  private readonly logger = createLogger(ConcreteCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: string) {
    try {
      await this.cacheManager.set(key, value, MILLISECONDS_IN_24H);
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

      this.cacheManager
        .get(key)
        .then((result: any) => {
          clearTimeout(timeoutHandle);
          if (result) this.logger.log(`Key ${key} retrieved successfully`);
          resolve(JSON.stringify(result));
        })
        .catch((error) => {
          clearTimeout(timeoutHandle);
          this.logger.error(`Error retrieving ${key}: ${error}`);
          reject(error);
        });
    }).catch((error) => {
      this.logger.error(`Get ${key} from cache failed: ${error}`);
      return null;
    });
  }
}
