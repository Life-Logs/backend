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

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails } = profile;
    console.log(accessToken, refreshToken, profile);

    const providerId = id;
    const email = emails[0].value;

    console.log(providerId, email, name);

    return profile;
    //const { id, name, emails, photos } = profile;
    //const user: Partial<User> = {
    //	googleId: id,
    //	firstName: name.givenName,
    //	lastName: name.familyName,
    //	email: emails[0].value,
    //	profilePhoto: photos[0].value,
    //};
    //const payload = { user, accessToken };
    //return this.usersService.loginOrSignUp(payload);
  }
}
