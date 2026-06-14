import { Controller, Post, Get, Res, Delete, Req, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRequestDTO, UserResponseDTO } from '../user/user.dto';
import { LoginRequestDTO, LoginResponseDTO } from './auth.dto';
import { AuthUser } from './auth.decorator';
import { Message } from '../common/decorator/message.decorator';
import type { Response } from 'express';
import { ZBody } from '../common/decorator/zod.decorator';
import { AuthValidation } from './auth.validation';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Message('Success register')
  async register(@ZBody(AuthValidation.REGISTER) request: UserRequestDTO) {
    const data = await this.authService.register(request);
    return data;
  }

  @Post('login')
  @Message('Success login')
  async login(
    @ZBody(AuthValidation.LOGIN) request: LoginRequestDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDTO> {
    const data = await this.authService.login(request);
    response.cookie('token', data.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return data;
  }

  @Delete('logout')
  @Message('Success logout')
  async logout(
    @AuthUser() user: UserResponseDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(user);
    response.clearCookie('token');
  }

  @Get('me')
  getProfile(@AuthUser() user: UserResponseDTO) {
    const data = this.authService.profile(user);
    return data;
  }

  @Get('token')
  getToken(@Req() request: any) {
    const token = request.cookies['token'];
    return token;
  }
}
