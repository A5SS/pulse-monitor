import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Check environment variables.');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.use(helmet());

  const webUrl = process.env.WEB_URL || 'http://localhost:3000';
  app.enableCors({
    origin: webUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API server running on port ${port}`);
  console.log(`CORS enabled for: ${webUrl}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
