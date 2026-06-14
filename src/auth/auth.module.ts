import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { HashService } from '../helper/hash/hash.service';
import { SuccessResponseInterceptor } from '../common/success-response.interceptor';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashService, SuccessResponseInterceptor],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/login', 'auth/register')
      .forRoutes('auth', 'users', 'topics', 'materials', 'assignments');
  }
}
