import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createLogger } from './logger-factory';
import { AxiosError } from 'axios';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  private readonly logger = createLogger(AnyExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = this.getStatus(exception);

    this.logger.error(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception?.message || 'Internal server error',
    });
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if (exception instanceof AxiosError && exception?.response) {
      return exception.response.status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
