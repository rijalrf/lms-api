import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../prisma/generated-client/client.js';
import { ZodError } from 'zod';

@Catch(
  ZodError,
  HttpException,
  Error,
  Prisma.PrismaClientKnownRequestError,
  UnauthorizedException,
)
export class ErrorResponseFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof ZodError) {
      Logger.error(exception, 'Validation Error')
      response.status(400).json({
        success: false,
        code: 400,
        message: 'Validation erors',
        errors: exception.issues.map((issue) => ({
          field: issue.path.join('.'),
          error: issue.message,
        })),
        exception: 'ZodError',
      });
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      
      if (exception.code === 'P2003') {
        Logger.error('Foreign key constraint failed on the field', 'PrismaClientKnownRequestError')
        response.status(409).json({
          success: false,
          code: 409,
          message:
            'Gagal menghapus atau memperbarui data karena terdapat data terkait lainnya.',
          exception: 'PrismaClientKnownRequestError',
        });
      } else if (exception.code === 'P2025') {
        Logger.error('Record to operate does not exist.', 'PrismaClientKnownRequestError')
        response.status(404).json({
          success: false,
          code: 404,
          message: 'Record to operate does not exist.',
          exception: 'PrismaClientKnownRequestError',
        });
      } else {
        Logger.error('Database error occurred.', 'PrismaClientKnownRequestError')
        response.status(500).json({
          success: false,
          code: 500,
          message: 'Database error occurred.',
          exception: 'PrismaClientKnownRequestError',
        });
      }
    } else if (exception instanceof UnauthorizedException) {
      Logger.error(exception.message, 'Unauthorized Error')
      response.status(exception.getStatus()).json({
        success: false,
        code: exception.getStatus(),
        message: exception.message,
        exceptions: 'UnauthorizedException',
      });
    } else if (exception instanceof HttpException) {
      Logger.error(exception.message, 'Http Error')
      response.status(exception.getStatus()).json({
        success: false,
        code: exception.getStatus(),
        message: exception.message,
        exceptions: 'HttpException',
      });
    } else {
      Logger.error(exception, 'Internal Server Error')
      response.status(500).json({
        success: false,
        code: 500,
        message: 'Internal server error',
        errors: exception,
        exception: 'Error',
      });
    }
  }
}
