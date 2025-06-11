import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets', 'images'),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: { colorize: true },
            },
            {
              target: '@logtail/pino',
              level: 'debug',
              options: {
                sourceToken: process.env.BETTERSTACK_TOKEN,
                options: {
                  endpoint: `https://${process.env.BETTERSTACK_CONNECTION}`,
                },
              },
            },
          ],
        },
      },
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
