import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createLogger } from '../utils/logger-factory';
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
import { ConfigService } from '@nestjs/config';
import { REDIS_TTL_MS, TIMEOUT_MILLISECONDS } from '../config/config';

export interface CacheService {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
}

@Injectable()
export class ConcreteCacheService implements CacheService {
  private readonly logger = createLogger(ConcreteCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async set(key: string, value: string) {
    try {
      const ttl = this.configService.get<number>(REDIS_TTL_MS);
      await this.cacheManager.set(key, value, ttl);
      this.logger.log(`Key ${key} set successfully`);
    } catch (err) {
      this.logger.error(`Error setting key: ${err}`);
    }
  }

  async get(key: string): Promise<string> {
    const timeoutMs = this.configService.get<number>(TIMEOUT_MILLISECONDS);
    const timeout$ = timer(timeoutMs).pipe(
      map(() => {
        this.logger.debug(`Cache timeout for key ${key}`);
        return null;
      }),
    );

    const cache$ = from(this.cacheManager.get<any>(key)).pipe(
      tap(
        (result) =>
          result && this.logger.debug(`Key ${key} retrieved successfully`),
      ),
      tap((result) => {
        !result && this.logger.debug(`Key ${key} not found`);
      }),
      catchError((error) => {
        this.logger.error(`Error retrieving ${key}: ${error}`);
        return of(null);
      }),
    );

    return firstValueFrom(race(cache$, timeout$));
  }
}
