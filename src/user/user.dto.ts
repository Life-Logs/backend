import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '유저 이름' })
  @IsString()
  username: string;
}

export class UserDto {
  @ApiProperty({ description: '유저 고유 id' })
  id: number;

  @ApiProperty({ description: '유저 이메일' })
  email: string;

  @ApiProperty({ description: '유저 providerId' })
  providerId: string;

  @ApiProperty({ description: '유저 이름' })
  username: string;

  @ApiProperty({ description: '생성된 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정된 시간' })
  updatedAt: Date;
}
