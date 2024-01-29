import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { Routine } from 'src/entities/routine.entity';
import { Tag } from 'src/entities/tag.entity';
import { RoutineTag } from 'src/entities/routine-tag.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Routine, Tag, RoutineTag]), AuthModule, UserModule],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService], // UserService를 외부 모듈에서 사용하도록 설정
})
export class RoutineModule {}
