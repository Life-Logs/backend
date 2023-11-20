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

  @IsObject()
  datetime: object;

  @IsOptional()
  @IsBoolean()
  isActived?: boolean;

  @IsOptional()
  @IsNumber()
  goal?: number;

  @IsOptional()
  @IsArray()
  routineTags?: string[];

  @IsDateString()
  activedAt: Date;

  @IsDateString()
  inactivedAt: Date;
}
