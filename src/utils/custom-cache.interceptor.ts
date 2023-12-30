import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from './logger-factory';
import { catchError, Observable, switchMap, race, throwError } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';

class InterceptorTimeoutError extends Error {
  constructor() {
    super('Interceptor timeout');
    this.name = 'InterceptorTimeoutError';
  }
}

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = createLogger(CustomCacheInterceptor.name);
  private readonly timeoutDuration = 1000; // timeout duration in milliseconds

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;
    const port = request.socket.localPort;
    const key = `nest-cache:${port}${path}`;
    return key;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let timeoutId: NodeJS.Timeout;
    const key = this.trackBy(context);

    const timeout$ = new Observable((subscriber) => {
      timeoutId = setTimeout(() => {
        subscriber.error(new InterceptorTimeoutError());
        subscriber.complete();
      }, this.timeoutDuration);
    });
    const intercept$ = super.intercept(context, next);

    return race(intercept$, timeout$).pipe(
      switchMap((result$: Observable<any>) => {
        clearTimeout(timeoutId);
        this.logger.debug(`Attempting to access cache for key ${key}`);
        return result$;
      }),
      catchError((err) => {
        if (err instanceof InterceptorTimeoutError) {
          this.logger.error(`${key} cache access failed with: ${err.message}`);
          return next.handle();
        }
        return throwError(() => err);
      }),
    );
  }
}
