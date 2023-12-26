import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      console.log('accessToken' + accessToken);
      console.log('refreshToken' + refreshToken);
      console.log(profile);
      console.log(profile._json.kakao_account.email);
      const user = {
        name: profile.displayName,
        email: profile._json.kakao_account.email,
        password: profile.id,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
