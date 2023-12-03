import { ApiProperty } from '@nestjs/swagger';
import { RoutineType } from '../enum/routine-type.enum';
import { Routine } from 'src/entities/routine.entity';

export class RoutineInfoDto {
  @ApiProperty({ description: '루틴 고유 id', example: 1 })
  id: number;

  @ApiProperty({ description: '루틴 이름', example: '첫번째 루틴' })
  name: string;

  @ApiProperty({ enum: RoutineType, description: '루틴 타입', example: 'count' })
  //count, checkbox, percent
  type: RoutineType;

  @ApiProperty({
    description: '날짜 및 시간',
    example: {
      monday: {
        start: '09:00',
        end: '18:00',
      },
    },
  })
  datetime: object;

  @ApiProperty({ description: '루틴 활성 여부', example: true })
  isActived: boolean;

  @ApiProperty({ description: '태그들', example: ['취미', '운동'] })
  routineTags: string[];

  @ApiProperty({ description: '루틴 활성시간', example: new Date() })
  activedAt: Date;

  @ApiProperty({ description: '루틴 비활성시간', example: new Date() })
  inactivedAt: Date;

  static from(routineEntity: Routine) {
    const { goal, createdAt, updatedAt, deletedAt, routineTags, ...others } = routineEntity;
    const routineInfoDto: RoutineInfoDto = { ...others, routineTags: routineTags.map((e) => e.tag.name) };
    return routineInfoDto;
  }
}
