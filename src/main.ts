import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //전역 파이프 설정
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, //쿠키 유효시간 1시간
    }),
  );
  //passport 초기화 및 세션 저장소 초기화
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
