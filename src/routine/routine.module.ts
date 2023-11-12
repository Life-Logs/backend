import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { Routine } from 'src/entities/routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine])],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService], // UserService를 외부 모듈에서 사용하도록 설정
})
export class RoutineModule {}
