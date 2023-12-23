import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createLogger } from './logger-factory';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  private readonly logger = createLogger(AnyExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = this.getStatus(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception?.message || 'Internal server error',
    });
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      this.logger.warn(`HttpException: ${exception.message}`);
      return exception.getStatus();
    }
    if (exception?.response?.status) {
      const status = exception.response.status;
      this.logger.warn(
        `AxiosException: message: "${exception.message}", status: ${status}`,
      );
      return status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
