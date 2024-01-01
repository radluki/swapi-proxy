import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createLogger } from './logger-factory';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = createLogger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    const prefix = getLogPrefix();
    const logMessageBefore = `${prefix}Request received at ${now.toISOString()}`;

    this.logger.debug(logMessageBefore);

    return next.handle().pipe(
      tap(() => {
        const processingTime = new Date().getTime() - now.getTime();
        const logMessageAfter = `${prefix}Processed in ${processingTime}ms`;
        this.logger.debug(logMessageAfter);
      }),
    );

    function getLogPrefix() {
      if (context.getType() === 'http') {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        return `${method} ${url} - `;
      }
      return `${context.getType()} - ${context.getClass().name} - `;
    }
  }
}
