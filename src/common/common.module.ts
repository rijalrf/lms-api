import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SuccessResponseInterceptor } from './success-response.interceptor';
import { ErrorResponseFilter } from './error-response.filter';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorResponseFilter,
    },
  ],
})
export class CommonModule {}
