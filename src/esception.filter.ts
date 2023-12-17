import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
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
      return exception.getStatus();
    }
    if (exception?.response?.status) {
      return exception.response.status;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
