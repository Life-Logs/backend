import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { TempLoginDto, kakaoLoginDto } from './dto/kakao-login.dto';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userSerivice: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

      //const accessToken = this.generateAccessToken(user);
      const accessToken = this.signToken(user, false);
      const refreshToken = this.signToken(user, true);
      return {
        userid: user.id,
        accessToken,
        refreshToken,
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

  extractTokenFromHeader(header: string) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
      throw new UnauthorizedException('잘못된 토큰입니다');
    }
    const token = splitToken[1];

    return token;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const user = await this.userSerivice.createUser(signupDto);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  signToken(user, isRefreshToken: boolean) {
    const payload = {
      userId: user.id,
      tokenType: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 1800,
    });
  }

  async tempLogin(tempLoginDto: TempLoginDto) {
    const { email, password } = tempLoginDto;
    const user = await this.userSerivice.getUserByEmail(email);

    if (!user) throw new NotFoundException('not found user');

    if (user.password !== password) throw new NotFoundException('not found user');
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);
    return {
      userid: user.id,
      accessToken,
      refreshToken,
    };
  }
}
