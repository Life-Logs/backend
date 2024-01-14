import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private userSerivice: UserService, private readonly jwtService: JwtService) {}

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

  //kakao login
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
    //cookie -> AT, RT
    //res.redirect('http://localhost:3000'); //FE URL

    const accessToken = this.generateAccessToken(user);
    const refreshToken = {};
    //const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async getJWT(kakaoId: number) {
    //const user = aw;
  }

  generateAccessToken(user) {
    const payload = {
      userId: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async kakaoLogin(options: { code: string; domain: string }): Promise<any> {
    const { code, domain } = options;
    const kakaoKey = process.env.KAKAO_CLIENT_ID;
    const kakaoSecret = process.env.KAKAO_CLIENT_SECRET;
    const kakaoTokenUrl = process.env.KAKAO_TOKEN_URL;
    const kakaoUserInfoUrl = process.env.KAKAO_USER_INFO_URL;
    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      client_secret: kakaoSecret,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: kakaoTokenUrl,
        timeout: 30000,
        headers,
        data: body,
      });
      if (response.status === 200) {
        console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
        // Token 을 가져왔을 경우 사용자 정보 조회
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };
        console.log(`url : ${kakaoTokenUrl}`);
        console.log(`headers : ${JSON.stringify(headerUserInfo)}`);
        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });
        console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
        if (responseUserInfo.status === 200) {
          console.log(`kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`);
          //회원가입 로직 추가
          //kakao_account
          const email = responseUserInfo.data.kakao_account.email;
          const password = responseUserInfo.data.id;
          const name = responseUserInfo.data.kakao_account.profile.nickname;
          let user = await this.userSerivice.getUserByEmail(email);

          //회원이 없다면 가입
          if (!user) {
            const data = {
              email,
              password,
              name,
            };
            user = await this.userSerivice.createUser(data);
          }

          return user;
        } else {
          //throw new UnauthorizedException();
          throw new Error('401');
        }
      } else {
        //throw new UnauthorizedException();
        throw new Error('401');
      }
    } catch (error) {
      console.log(error);
      //throw new UnauthorizedException();
      throw new Error('401');
    }
  }
}
