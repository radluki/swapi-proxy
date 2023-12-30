import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createLogger } from '../utils/logger-factory';
import { CacheService } from './redis.service';
import {
  tap,
  race,
  from,
  timer,
  map,
  catchError,
  firstValueFrom,
  of,
} from 'rxjs';

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
    return firstValueFrom(
      race(
        from(this.cacheManager.get<any>(key)).pipe(
          tap((result) => {
            if (result) this.logger.log(`Key ${key} retrieved successfully`);
          }),
        ),
        timer(timeout).pipe(
          map(() => {
            throw new Error('Cache request timed out');
          }),
        ),
      ).pipe(
        catchError((error) => {
          this.logger.error(`Error retrieving ${key}: ${error}`);
          return of(null);
        }),
      ),
    );
  }
}
