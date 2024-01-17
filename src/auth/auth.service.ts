import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { kakaoLoginDto } from './dto/kakao-login.dto';

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

  async kakaoLogin(kakaoLoginDto: kakaoLoginDto): Promise<any> {
    try {
      const user = await this.getUserByKakaoAccessToken(kakaoLoginDto.accessToken);

      if (!user) {
        throw new UnauthorizedException();
      }

      const accessToken = this.generateAccessToken(user);

      return {
        userid: user.id,
        accessToken,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByKakaoAccessToken(accessToken: string) {
    //카카오 토큰으로 유저 조회
    const kakaoUserInfoUrl = process.env.KAKAO_USER_INFO_URL;
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + accessToken,
    };
    const responseUserInfo = await axios({
      method: 'GET',
      url: kakaoUserInfoUrl,
      timeout: 30000,
      headers: headerUserInfo,
    });

    if (!responseUserInfo) throw new UnauthorizedException();

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
  }
}
