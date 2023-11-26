import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { RoutineService } from './routine.service';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';

@ApiTags('routine')
@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  @ApiOperation({ summary: '루틴 생성' })
  @ApiOkResponse({ description: '루틴 생성 성공', type: Routine })
  createRoutine(@Body() routine: CreateRoutineDto) {
    return this.routineService.createRoutine(routine);
  }

  @Get()
  @ApiOperation({ summary: '모든 루틴 조회' })
  @ApiOkResponse({ description: '모든 루틴 조회 성공', type: [Routine] })
  getAllRoutines() {
    return this.routineService.getAllRoutines();
  }

  @Get('/:id')
  @ApiOperation({ summary: '루틴 조회' })
  @ApiParam({ name: 'id', required: true })
  getRoutine(@Param('id') id: number) {
    return this.routineService.getRoutine(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: '루틴 업데이트' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '루틴 업데이트 성공', type: Routine })
  updateRoutine(@Param('id') id: number, @Body() routine: Routine) {
    return this.routineService.updateRoutine(id, routine);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '루틴 삭제' })
  @ApiParam({ name: 'id', required: true })
  deleteRoutine(@Param('id') id: number) {
    return this.routineService.deleteRoutine(id);
  }
}
