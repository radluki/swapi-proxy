import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from './logger-factory';
import { catchError, Observable, switchMap, throwError, race, tap } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';

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
    const timeoutObservable = new Observable((subscriber) => {
      timeoutId = setTimeout(() => {
        this.logger.warn('Timeout on CacheInterceptor.intercept');
        subscriber.next(undefined);
        subscriber.complete();
      }, this.timeoutDuration);
    });
    return race(super.intercept(context, next), timeoutObservable).pipe(
      catchError((err) => {
        this.logger.warn(`Race error: ${err.message}`);
        return throwError(() => err);
      }),
      switchMap((result: Observable<any> | undefined) => {
        const key = this.trackBy(context);
        if (result === undefined) {
          this.logger.warn(`Cache operation timed out for key ${key}`);
          return next.handle();
        }
        clearTimeout(timeoutId);
        this.logger.debug(`Attempting to access cache for key ${key}`);
        return result;
      }),
    );
  }
}
