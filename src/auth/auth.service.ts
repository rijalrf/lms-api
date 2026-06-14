import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HashService } from '../helper/hash/hash.service';
import { UserService } from '../user/user.service';
import { LoginRequestDTO, LoginResponseDTO } from './auth.dto';
import { v4 as uuid } from 'uuid';
import { UserRequestDTO, UserResponseDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async login(request: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const user = await this.userService.findAuthByEmail(request.email);
      const isPasswordValid = await this.hashService.comparePassword(
        request.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      const token = uuid();
      await this.userService.setUserToken(user.id, token);
      
      const userResponse = UserResponseDTO.fromEntity(user);
      return LoginResponseDTO.set(userResponse, token);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async logout(user: UserResponseDTO): Promise<void> {
    try {
      await this.userService.clearTokenById(user.id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async register(request: UserRequestDTO): Promise<UserResponseDTO> {
    try {
      const user = await this.userService.register(request);
      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async profile(user: UserResponseDTO): Promise<UserResponseDTO> {
    return user;
  }
}
