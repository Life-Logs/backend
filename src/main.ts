import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //전역 파이프 설정
  const configService = app.get(ConfigService);
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
