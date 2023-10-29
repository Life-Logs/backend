import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    return result;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  //CanActivate 인터페이스 구현
  constructor(private authService: AuthService) {} //authService를 주입받음

  async canActivate(context: any): Promise<boolean> {
    //CanActivate 인터페이스의 메서드
    //컨텍스트에서 리퀘스트 정보를 가져옴
    const request = context.switchToHttp().getRequest();

    //쿠키가 있으면 인증된 것
    if (request.cookies['login']) {
      return true;
    }

    //쿠키가 없으면 request의 body 정보 확인
    if (!request.body.email || !request.body.password) {
      return false;
    }

    //인증 로직은 기존의 authService.validateUser를 사용한다.
    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    // 유저 정보가 없으면 false를 반환
    if (!user) {
      return false;
    }
    //있으면 request에 user 정보를 추가하고 true를 반환
    request.user = user;
    return true;
  }
}
