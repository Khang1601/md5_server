import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});

  /* Version API */
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1", "2"]
  });

  /* Global Validate */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));


  await app.listen(3000);
}
bootstrap();
