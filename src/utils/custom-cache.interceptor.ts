import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from './logger-factory';
import { Observable, switchMap, race, timer, map, from, tap } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PORT, TIMEOUT_MILLISECONDS } from '../config/config';
import { getCacheKey } from '../cached-api/cached-api.service';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = createLogger(CustomCacheInterceptor.name);

  constructor(
    cacheManager: any,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const url = decodeURIComponent(request.url);
    const port = this.configService.get<number>(PORT);
    return getCacheKey(url, port);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);

    const timeoutMs = this.configService.get<number>(TIMEOUT_MILLISECONDS);
    const timeout$ = timer(timeoutMs).pipe(
      map(() => {
        this.logger.debug(`Interceptor timeout for key ${key}`);
        return next.handle();
      }),
    );
    const intercept$ = from(super.intercept(context, next)).pipe(
      tap(() => this.logger.debug(`Accessing cache for key ${key}`)),
    );

    return race(intercept$, timeout$).pipe(
      switchMap((result$: Observable<any>) => {
        return result$;
      }),
    );
  }
}
