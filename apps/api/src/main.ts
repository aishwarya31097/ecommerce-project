import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Browser requests from the Next.js app (different origin/port) need CORS for
  // POST/PATCH/DELETE cart calls. Server-side `fetch` from Next does not.
  const corsOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin:
      corsOrigins && corsOrigins.length > 0
        ? corsOrigins
        : ['http://localhost:3000', 'http://127.0.0.1:3000',"https://ecommerce-project-web.vercel.app"],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
