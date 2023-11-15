import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  //OAuth2.0 인증 후 실행되는 함수
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails } = profile;
    console.log(accessToken, refreshToken, profile);

    const providerId = id;
    const email = emails[0].value;

    //유저 정보 저장 or 조회
    const user: User = await this.usersService.findByEmailOrSave(
      email,
      name.givenName + name.givenName,
      providerId,
    );
    console.log(providerId, email, name);

    return user;
  }
}
