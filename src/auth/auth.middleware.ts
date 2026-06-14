import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: any, _res: any, next: () => void) {
    const token = req.cookies['token'] as string;
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userService.findUserByToken(token);
    if (user) {
      req.user = user;
    }

    next();
  }
}
