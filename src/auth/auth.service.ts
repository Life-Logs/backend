import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userSerivice: UserService) {}

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
}
