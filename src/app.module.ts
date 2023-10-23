import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }), UsersModule, AuthModule], //전역 모듈로 설정
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
