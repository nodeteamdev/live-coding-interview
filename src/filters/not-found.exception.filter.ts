import {
  ArgumentsHost, Catch, ExceptionFilter, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export default class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception.status === HttpStatus.NOT_FOUND
    ) {
      response.render('page-not-found');
    }
  }
}
