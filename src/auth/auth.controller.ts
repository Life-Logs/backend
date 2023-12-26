import { Body, Controller, Get, Header, Post, Query, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiParam, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginGuard, AuthenticatedGuard, LocalAuthGuard, GoogleAuthGuard } from './auth.guard';
import { Response as ExpressRes } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    password: string;
  };
}
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login') //구글로그인으로 이동
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '구글 OAuth 로그인' })
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google') //구글 로그인 후 콜백함수
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '구글 로그인 후 콜백함수' })
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;
    return res.send(user);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: ExpressRes & IOAuthUser, @Res() res: ExpressRes) {
    console.log(req);
    const { accessToken, refreshToken } = await this.authService.OAuthLogin({ req, res });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    return res.redirect('http://localhost:3000');
  }

  //@UseGuards(LoginGuard) //LoginGuard 사용
  //@Post('login')
  //@ApiOperation({ summary: '로그인' })
  //async login2(@Request() req, @Response() res) {
  //  //쿠키 정보는 없지만 request에 user 정보가 있다면 응답값에 쿠키 정보 추가
  //  if (!req.cookies['login'] && req.user) {
  //    // 응답에 쿠키 정보 추가
  //    res.cookie('login', JSON.stringify(req.user), {
  //      httpOnly: true,
  //      // maxAge: 1000 * 60 * 60 * 24 * 7, // 1day
  //      maxAge: 1000 * 10 * 60, //로그인 테스트를 고려해 10초로 설정
  //    });
  //  }
  //  return res.send({ message: 'login success' });
  //}

  @UseGuards(AuthenticatedGuard)
  @Get('cookie-validation')
  @ApiOperation({ summary: '쿠키 유효성 체크' })
  testGuardWithSession(@Request() req) {
    return req.user;
  }
}
