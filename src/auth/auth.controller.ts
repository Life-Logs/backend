import { Body, Controller, Get, Header, Post, Query, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiParam, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginGuard, AuthenticatedGuard, LocalAuthGuard, GoogleAuthGuard } from './auth.guard';
import { Response as ExpressRes } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { kakaoLoginDto } from './dto/kakao-login.dto';

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

  @UseGuards(AuthenticatedGuard)
  @Get('cookie-validation')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '쿠키 유효성 체크' })
  testGuardWithSession(@Request() req) {
    return req.user;
  }

  //@ApiOperation({ summary: '카카오 토큰 받아오기' })
  //@Post('/login-test')
  //async login(@Body() body: any, @Response() res): Promise<any> {
  //  try {
  //    // 카카오 토큰 조회 후 계정 정보 가져오기

  //    const { code, domain } = body;
  //    if (!code || !domain) {
  //      //throw new BadRequestException('카카오 정보가 없습니다.');
  //      throw new Error('not found');
  //    }
  //    const kakao = await this.authService.kakaoLogin({ code, domain });

  //    console.log(`kakaoUserInfo : ${JSON.stringify(kakao)}`);
  //    if (!kakao.id) {
  //      //throw new BadRequestException('카카오 정보가 없습니다.');
  //      throw new Error('not found');
  //    }

  //    res.send({
  //      user: kakao,
  //      message: 'success',
  //    });
  //  } catch (e) {
  //    console.log(e);
  //    //throw new UnauthorizedException();
  //    throw new Error('401');
  //  }
  //}

  @ApiOperation({ summary: '카카오 테스트 코드받아오기' })
  @Get('/tkim')
  async tkim(@Req() req: ExpressRes, @Res() res: ExpressRes) {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}`;
    return res.redirect(url);
  }

  @ApiOperation({ summary: '카카오 토큰으로 로그인' })
  @Post('/login')
  async kakaoLogin(@Body() kakaoLoginDto: kakaoLoginDto): Promise<any> {
    return this.authService.kakaoLogin(kakaoLoginDto);
  }
}
