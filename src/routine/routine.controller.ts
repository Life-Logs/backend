import { Controller, Body, Get, Post, Param, Put, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { RoutineService } from './routine.service';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { RoutineInfoDto } from './dto/routine-info.dto';
import { RoutineDetailDto } from './dto/routine-detail.dto';
import { ToggleActivation } from './dto/routine-activation.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

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
  @ApiOkResponse({ description: '모든 루틴 조회 성공', type: [RoutineInfoDto] })
  getAllRoutines(): Promise<RoutineInfoDto[]> {
    return this.routineService.getAllRoutines();
  }

  @Get('/:id')
  @ApiOperation({ summary: '루틴 상세 조회' })
  @ApiOkResponse({ description: '루틴 상세 조회 성공', type: RoutineDetailDto })
  @ApiParam({ name: 'id', required: true })
  getRoutine(@Param('id') id: number) {
    return this.routineService.getRoutine(id);
  }

  @Patch('/:id/toggle-activation')
  @ApiOperation({ summary: '루틴 활성, 비활성' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '루틴 활성, 비활성 성공', type: Routine })
  toogleActivation(@Param('id') id: number, @Body() toggleActivation: ToggleActivation) {
    return this.routineService.toggleActivation(id, toggleActivation);
  }

  @Put('/:id')
  @ApiOperation({ summary: '루틴 업데이트' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '루틴 업데이트 성공', type: Routine })
  updateRoutine(@Param('id') id: number, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.updateRoutine(id, updateRoutineDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '루틴 삭제' })
  @ApiOkResponse({ description: '루틴 삭제 성공', type: RoutineDetailDto })
  @ApiParam({ name: 'id', required: true })
  deleteRoutine(@Param('id') id: number) {
    return this.routineService.deleteRoutine(id);
  }
}
