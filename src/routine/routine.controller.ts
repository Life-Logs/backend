import { Controller, Body, Get, Post, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiParam, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoutineService } from './routine.service';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { RoutineInfoDto } from './dto/routine-info.dto';
import { RoutineDetailDto } from './dto/routine-detail.dto';
import { ToggleActivation } from './dto/routine-activation.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AccessTokenGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/user/decorator/user.decorator';

@ApiTags('routine')
@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '루틴 생성' })
  @ApiOkResponse({ description: '루틴 생성 성공', type: Routine })
  createRoutine(@User('id') id: number, @Body() routine: CreateRoutineDto) {
    return this.routineService.createRoutine(id, routine);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '나의 모든 루틴 조회' })
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ description: '모든 루틴 조회 성공', type: [RoutineInfoDto] })
  getAllRoutines(@User('id') id: number): Promise<RoutineInfoDto[]> {
    return this.routineService.getAllRoutines(id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '루틴 상세 조회' })
  @ApiOkResponse({ description: '루틴 상세 조회 성공', type: RoutineDetailDto })
  @ApiParam({ name: 'id', required: true })
  getRoutine(@User('id') userId: number, @Param('id') id: number) {
    return this.routineService.getRoutine(userId, id);
  }

  @Patch('/:id/toggle-activation')
  @ApiBearerAuth()
  @ApiOperation({ summary: '루틴 활성, 비활성' })
  @UseGuards(AccessTokenGuard)
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '루틴 활성, 비활성 성공', type: Routine })
  toogleActivation(@User('id') userId: number, @Param('id') id: number, @Body() toggleActivation: ToggleActivation) {
    return this.routineService.toggleActivation(userId, id, toggleActivation);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '루틴 업데이트' })
  @UseGuards(AccessTokenGuard)
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: '루틴 업데이트 성공', type: Routine })
  updateRoutine(@User('id') userId: number, @Param('id') id: number, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.updateRoutine(userId, id, updateRoutineDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '루틴 삭제' })
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ description: '루틴 삭제 성공', type: RoutineDetailDto })
  @ApiParam({ name: 'id', required: true })
  deleteRoutine(@User('id') userId: number, @Param('id') id: number) {
    return this.routineService.deleteRoutine(userId, id);
  }
}
