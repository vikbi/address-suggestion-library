import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get('ConfigService');
  const port = 3000; // configService.get('app.port');
  await app.listen(port);
  Logger.log(`Server listening on port ${port}`);
}

bootstrap();