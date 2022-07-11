import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import ServerErrorResponse from '@responses/server-error.response';
import ConflictResponse from '@responses/conflict.response';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const mongodbCodes = {
      bulkWriteError: 11000,
    };

    if (exception.code === mongodbCodes.bulkWriteError) {
      return res.status(HttpStatus.CONFLICT).json(new ConflictResponse());
    }

    if (
      exception instanceof NotFoundException
            || exception instanceof UnauthorizedException
    ) {
      this.logger.error(exception);
      return res.redirect('/auth/sign-up'); // here you can specify rendering your page
    }

    if (
      exception instanceof BadRequestException
            || exception.code === 'ValidationException'
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json(new BadRequestException(exception));
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ServerErrorResponse(exception));
  }
}
