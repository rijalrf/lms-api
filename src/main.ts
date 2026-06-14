import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  //buatkan api untuk test
  app.getHttpAdapter().get('/api/v1/test', (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'API is working correctly',
    });
  });

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
