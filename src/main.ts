import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupSwagger(app);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.info(`server running on ${await app.getUrl()}`);
}
bootstrap();
