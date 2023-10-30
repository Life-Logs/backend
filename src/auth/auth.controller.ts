import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import {
  LoginGuard,
  AuthenticatedGuard,
  LocalAuthGuard,
  GoogleAuthGuard,
} from './auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('to-google') //구글로그인으로 이동
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google') //구글 로그인 후 콜백함수
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;
    return res.send(user);
  }

  @Post('/register')
  //class-validator가 자동으로 유효성 검사
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @UseGuards(LoginGuard) //LoginGuard 사용
  @Post('login')
  async login2(@Request() req, @Response() res) {
    //쿠키 정보는 없지만 request에 user 정보가 있다면 응답값에 쿠키 정보 추가
    if (!req.cookies['login'] && req.user) {
      // 응답에 쿠키 정보 추가
      res.cookie('login', JSON.stringify(req.user), {
        httpOnly: true,
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 1day
        maxAge: 1000 * 10 * 60, //로그인 테스트를 고려해 10초로 설정
      });
    }
    return res.send({ message: 'login success' });
  }

  //로그인을 한 때만 실행되는 메서드
  @UseGuards(LoginGuard)
  @Get('test-guard')
  testGuard() {
    return '로그인된 때에만 이 글이 보입니다.';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login3')
  login3(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('test-guard2')
  testGuardWithSession(@Request() req) {
    return req.user;
  }
}
