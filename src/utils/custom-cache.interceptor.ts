import { ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { createLogger } from './logger-factory';
import { Observable, switchMap, race, timer, map } from 'rxjs';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = createLogger(CustomCacheInterceptor.name);
  private readonly timeoutDuration = 1000; // timeout duration in milliseconds

  private getPath(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;
    return path;
  }

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
    const path = this.getPath(context);
    this.logger.debug(`Detected request for ${path}`);

    const timeout$ = timer(this.timeoutDuration).pipe(
      map(() => {
        const key = this.trackBy(context);
        this.logger.debug(`Interceptor timeout for key ${key}`);
        return next.handle();
      }),
    );
    const intercept$ = super.intercept(context, next);

    return race(intercept$, timeout$).pipe(
      switchMap((result$: Observable<any>) => {
        return result$;
      }),
    );
  }
}
