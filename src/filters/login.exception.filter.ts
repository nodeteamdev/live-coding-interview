import {
  ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export default class LoginExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (
      exception instanceof NotFoundException
    ) {
      request.flash('emailError', 'Email does not exist');
      response.redirect('/auth/login');
    } else if (
      exception instanceof UnauthorizedException
    ) {
      request.flash('passwordError', 'Wrong email or password');
      response.redirect('/auth/login');
    }
  }
}
