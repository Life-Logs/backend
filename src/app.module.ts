import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true })], //전역 모듈로 설정
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
