import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';
import { createLogger } from './logger-factory';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = createLogger(CustomCacheInterceptor.name);

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;
    const port = request.socket.localPort;
    const key = `${port}:${path}`;
    this.logger.debug(`Key ${key}`);
    return key;
  }
}
