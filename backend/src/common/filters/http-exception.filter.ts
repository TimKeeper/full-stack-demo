import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status code (e.g., 400, 401, 404, 500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine the error message
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // If the response is an object (common in NestJS), extract the message
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const msg = (res as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      } else if (typeof res === 'string') {
        message = res;
      }
    }

    // Always return HTTP 200 as requested, but with an error code and success: false
    response.status(HttpStatus.OK).json({
      code: status, // Non-zero code for errors
      message,
      data: null, // "如果响应失败有 message 时就给 undefined 或者 null"
      success: false,
    });
  }
}
