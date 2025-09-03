import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));

  const config = new DocumentBuilder()
    .setTitle('English Conversations API')
    .setDescription(
      "REST API for managing English Conversations' data and processes.",
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    customSiteTitle: 'English Conversations API Docs',
    customfavIcon: '/logo.ico',
    customCss: `
    .swagger-ui .topbar { background-color: #000000; }
    #logo_small_svg__SW_TM-logo-on-dark { display: none; }
    .swagger-ui .topbar .topbar-wrapper::before {
      content: '';
      background-image: url('/logo.png'); 
      background-repeat: no-repeat;
      background-size: contain;
      height: 80px; 
      width: 170px;
      display: inline-block;
      margin-right: 10px;
    }
  `,
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);

  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  await app.listen(3000);
}
bootstrap();
