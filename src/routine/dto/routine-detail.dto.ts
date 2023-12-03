import { ApiProperty } from '@nestjs/swagger';
import { RoutineInfoDto } from './routine-info.dto';
import { Routine } from 'src/entities/routine.entity';

export class RoutineDetailDto extends RoutineInfoDto {
  @ApiProperty({ description: '루틴 목표 (루틴 타입이 카운트 or 퍼센트일경우' })
  goal?: number;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제 시간' })
  deletedAt: Date;

  @ApiProperty({})
  static from(routineEntity: Routine) {
    const { routineTags, ...others } = routineEntity;
    const routineDetailDto: RoutineDetailDto = { ...others, routineTags: routineTags.map((e) => e.tag.name) };

    return routineDetailDto;
  }
}
