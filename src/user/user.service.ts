import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  //유저 생성
  async createUser(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }
  //모든 유저 조회
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  //유저 한명 찾기
  async getUser(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  //유저 업데이트
  async updateUser(email: string, _user: UpdateUserDto): Promise<any> {
    const user: User = await this.getUser(email);
    console.log(_user);
    user.username = _user.username;
    user.password = _user.password;
    console.log(user);
    return await this.userRepository.save(user);
  }

  //유저 삭제
  async deleteUser(email: string): Promise<any> {
    return await this.userRepository.delete({ email });
  }

  //구글 유저 검색 및 생성
  async findByEmailOrSave(email, username, providerId): Promise<User> {
    const foundUser = await this.getUser(email);
    if (foundUser) {
      return foundUser;
    }

    const newUser = await this.userRepository.save({
      email,
      username,
      providerId,
    });
    return newUser;
  }
}
