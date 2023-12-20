import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';
import { JwtKakaoStrategy } from './jwt-social-kakao.strategy';
@Module({
  //providers: [AuthService, GoogleStrategy],
  imports: [UserModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer, GoogleStrategy, JwtKakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
