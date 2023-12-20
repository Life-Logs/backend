import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userSerivice: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userSerivice.getUserByEmail(email);

    if (!user) {
      //유저가 없으면 검증 실패
      return null;
    }
    const { password: hashedPassword, ...userInfo } = user;
    if (bcrypt.compareSync(password, hashedPassword)) {
      //패스워드가 일치하면 성공
      return userInfo;
    }
    return null;
  }

  async OAuthLogin({ req, res }) {
    //회원 조회
    console.log(req.user);
    let user = await this.userSerivice.getUserByEmail(req.user.email);

    //회원이 없다면 가입
    if (!user) {
      user = await this.userSerivice.createUser(req.user);
    }

    //로그인(accessToken, refreshToken 생성 후 리턴
    //this.setRefreshToken({ user, res });
    res.redirect('http://localhost:3000');
  }
}
