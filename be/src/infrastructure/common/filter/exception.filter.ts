import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';

interface IError {
  message: string;
  errorCode: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, errorCode: null };

    const responseData = {
      ...{
        code: code,
        timestamp: new Date().toISOString(),
        status: HttpStatus[code]
      },
      ...(typeof message === 'string' ? {} : message)
    };

    this.logMessage(request, message, code, exception);

    response.status(code).json(responseData);
  }

  private logMessage(request: any, message: IError, status: number, exception: any) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} errorCode=${message.errorCode ? message.errorCode : null} message=${
          message.message ? message.message : null
        }`,
        status >= 500 ? exception.stack : ''
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} errorCode=${message.errorCode ? message.errorCode : null} message=${
          message.message ? message.message : null
        }`
      );
    }
  }
}
