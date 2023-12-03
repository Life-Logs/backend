import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoutineType } from '../enum/routine-type.enum';

export class CreateRoutineDto {
  //@ApiProperty({ description: '유저 id', example: 1 })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ description: '루틴 제목', example: '약먹기' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '루틴 타입: count, percent, checkbox',
    enum: RoutineType,
  })
  @IsOptional()
  @IsString()
  type?: RoutineType;

  @ApiProperty({
    description: '날짜 및 시간 JSON으로',
    example: {
      monday: {
        start: '09:00',
        end: '18:00',
      },
    },
  })
  @IsObject()
  datetime: object;
  //json으로
  //{
  //  "monday": {
  //    "start": "09:00",
  //    "end": "18:00"
  //  },
  //  "tuesday": {
  //    "start": "09:00",
  //    "end": "18:00"
  //  },
  //  "wednesday": {
  //    "start": "09:00",
  //    "end": "18:00"
  //  },
  //  "thursday": {
  //    "start": "09:00",
  //    "end": "18:00"
  //  },
  //  "friday": {
  //    "start": "09:00",
  //    "end": "18:00"
  //  }
  //}

  @ApiProperty({ description: '루틴 활성여부 default true', example: true })
  @IsOptional()
  @IsBoolean()
  isActived?: boolean;

  @ApiProperty({
    description: '타입이 count or percent일 경우 목표',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  goal?: number;

  @ApiProperty({
    description: '루틴 태그들(배열로)',
    example: ['취미', '커피'],
  })
  @IsOptional()
  @IsArray()
  routineTags?: string[];
  //비워두면 루틴이름으로 태그 생성

  @ApiProperty({
    description: '해당 루틴 시작 시간',
    example: new Date(),
  })
  @IsDateString()
  activedAt: Date;

  @ApiProperty({
    description: '해당 루틴 종료 시간',
    example: new Date(),
  })
  @IsDateString()
  inactivedAt: Date;
}
