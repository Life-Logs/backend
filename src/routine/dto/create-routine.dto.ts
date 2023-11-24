import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateRoutineDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;
  //카운트, 퍼센트, 체크박스

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

  @IsOptional()
  @IsBoolean()
  isActived?: boolean;

  @IsOptional()
  @IsNumber()
  goal?: number;

  @IsOptional()
  @IsArray()
  routineTags?: string[];
  //비워두면 루틴이름으로 태그 생성

  @IsDateString()
  activedAt: Date;

  @IsDateString()
  inactivedAt: Date;
}
