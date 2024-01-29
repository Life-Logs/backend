import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다! ');
    }

    const token = this.authService.extractTokenFromHeader(rawToken);

    const result = await this.authService.verifyToken(token);

    const data = await this.userService.getUser(result.userId);

    const user = {
      data,
      token,
      tokenType: result.tokenType,
    };
    req.user = user;
    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.user.tokenType !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다');
    }
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.user.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다');
    }
    return true;
  }
}
