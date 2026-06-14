import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../prisma/generated-client/client.js';
import { UserEntity, userSelects } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaService) {}

  async create(request: UserEntity): Promise<UserEntity> {
    const user = await this.db.user.create({
      data: request,
      select: userSelects,
    });
    return user;
  }

  async update(id: number, request: UserEntity): Promise<UserEntity> {
    const user = await this.db.user.update({
      data: request,
      where: {
        id: id,
      },
      select: userSelects,
    });
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.db.user.delete({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.db.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  async findAll(page: number = 1, limit: number): Promise<UserEntity[]> {
    const skip = (page - 1) * limit;
    const users: User[] = await this.db.user.findMany({
      take: limit,
      skip: skip,
    });
    return users;
  }

  async count(): Promise<number> {
    const count = await this.db.user.count();
    return count;
  }

  async updateUserToken(id: number, token: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: id,
      },
      data: {
        token: token,
      },
    });
  }

  async findUserByToken(token: string): Promise<UserEntity | null> {
    const user = await this.db.user.findFirst({
      where: {
        token: token,
      },
    });
    return user;
  }

  async clearTokenById(id: number): Promise<void> {
    await this.db.user.update({
      where: {
        id: id,
      },
      data: {
        token: null,
      },
    });
  }

  async updateUserWithoutPassword(
    id: number,
    request: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.db.user.update({
      where: {
        id: id,
      },
      data: request,
    });
    return user;
  }
}
