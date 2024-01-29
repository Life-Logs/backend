import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'abc@abc.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: '이름', example: 'tkim' })
  @IsString()
  name: string;

  @ApiProperty({ description: '패스워드', example: '12341234' })
  @IsString()
  password: string;
}
