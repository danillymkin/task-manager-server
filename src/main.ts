import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // create app
  const app = await NestFactory.create(AppModule);

  // get configService
  const config = app.get(ConfigService);

  // api prefix
  const globalPrefix = config.get<string>('API_PREFIX');
  app.setGlobalPrefix(globalPrefix);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  // cookies
  app.use(cookieParser());

  // get port
  const port = config.get<number>('API_PORT') || 3333;

  // run app
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
