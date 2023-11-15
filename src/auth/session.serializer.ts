import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    // 세션에 user.email만 저장
    done(null, user.email);
  }

  //세션에서 정보를 꺼내올 때 사용
  async deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): Promise<any> {
    // 세션에 저장된 user.id를 통해 사용자 정보 조회
    //payload는 세션에 저장된 user.email
    const user = await this.userService.getUserByEmail(payload);

    if (!user) {
      done(new Error('user not found'), null);
      return;
    }
    const { password, ...userInfo } = user;

    //유저 정보가 있다면 유저 정보 반환
    done(null, JSON.stringify(userInfo));
  }
}
