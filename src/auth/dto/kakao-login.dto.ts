import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class kakaoLoginDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2NhbGFuZGFyL3YxLyIsInN1YiI6InVzcl8xMjMiLCJpYXQiOjE0NTg3ODU3OTYsImV4cCI6MTQ1ODg3MjE5Nn0.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ',
    description: '엑세스 토큰',
  })
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  //  @ApiProperty({
  //    example: 'kakao',
  //    description: 'OAuth제공사명',
  //  })
  //  @IsNotEmpty()
  //  @IsString()
  //  vendor!: string;
}

export class TempLoginDto {
  @ApiProperty({
    example: 'abc@abc.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '비밀번호', example: '12341234' })
  @IsString()
  password: string;
}
