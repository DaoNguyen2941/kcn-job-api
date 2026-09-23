import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);
  app.use(cookieParser());

  app.use(helmet());

  app.enableCors({
    origin: config.get<string[]>('corsOrigin'),
    credentials: true,
  });

  app.setGlobalPrefix(config.get<string>('apiPrefix') || 'api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('KCN JOB API')
    .setDescription(
      'System 1 - Recruitment / Labor Supply. ' +
        'Public API is used by the job-search website; Admin API manages the whole recruitment pipeline.',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addTag('Admin Auth')
    .addTag('Public - Jobs')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('port') || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`KCN JOB backend listening on port ${port} (prefix: /${config.get('apiPrefix')})`);
  console.log(`Swagger docs available at /docs`);
}
bootstrap();
