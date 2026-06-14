import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repo';
import { HashService } from '../helper/hash/hash.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, HashService],
  exports: [UserService],
})
export class UserModule {}
