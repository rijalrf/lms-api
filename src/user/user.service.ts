import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  UserRequestDTO,
  UserResponseDTO,
  UserResponseDTOwithPagination,
  UserAuthDTO,
} from './user.dto';
import { UserRepository } from './user.repo';
import { Pagination } from '../common/dto/pagination.dto';
import { HashService } from '../helper/hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async register(request: UserRequestDTO): Promise<UserResponseDTO> {
    request.password = await this.hashService.hashPassword(request.password);

    try {
      const userEmail = await this.userRepo.findByEmail(request.email);
      if (userEmail) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      const user = await this.userRepo.create(request);
      return UserResponseDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, request: UserRequestDTO): Promise<UserResponseDTO> {
    try {
      if (!request.password || request.password === '') {
        const user = await this.userRepo.updateUserWithoutPassword(id, request);
        return UserResponseDTO.fromEntity(user);
      }
      const hashPassword = await this.hashService.hashPassword(request.password);
      request.password = hashPassword;
      const user = await this.userRepo.update(id, request);
      return UserResponseDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<UserResponseDTOwithPagination> {
    const totalItems = await this.userRepo.count();
    const pagination = new Pagination(page, limit, totalItems);

    try {
      const users = await this.userRepo.findAll(page, limit);
      return UserResponseDTOwithPagination.set(users, pagination);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return UserResponseDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findAuthByEmail(email: string): Promise<UserAuthDTO> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return UserAuthDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: number): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return UserResponseDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async setUserToken(id: number, token: string): Promise<void> {
    try {
      await this.userRepo.updateUserToken(id, token);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByToken(token: string): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepo.findUserByToken(token);
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      return UserResponseDTO.fromEntity(user);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }

  async clearTokenById(id: number): Promise<void> {
    try {
      await this.userRepo.clearTokenById(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(error instanceof Error ? error.message : 'Internal Server Error', HttpStatus.BAD_REQUEST);
    }
  }
}
