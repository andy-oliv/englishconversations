import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import { ExerciseModule } from './exercise/exercise.module';
import { QuizModule } from './quiz/quiz.module';
import { AnsweredExerciseModule } from './answered-exercise/answered-exercise.module';
import { AnsweredQuizModule } from './answered-quiz/answered-quiz.module';
import { UnitModule } from './unit/unit.module';
import { TagModule } from './tag/tag.module';
import { VideoModule } from './video/video.module';
import { FileModule } from './file/file.module';
import { ChapterModule } from './chapter/chapter.module';
import { UserModule } from './user/user.module';
import { UserChapterModule } from './user-chapter/user-chapter.module';
import { NotificationModule } from './notification/notification.module';
import { UserNotificationModule } from './user-notification/user-notification.module';
import { UserUnitModule } from './user-unit/user-unit.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth/auth.guard';
import { S3Module } from './s3/s3.module';
import { EmailModule } from './email/email.module';
import { EmailValidationGuard } from './auth/guards/email-validation/email-validation.guard';
import { VideoProgressModule } from './video-progress/video-progress.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets', 'images'),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: 'debug',
          transport: {
            targets: [
              {
                target: 'pino-pretty',
                level: 'debug',
                redact: ['password'],
                options: { colorize: true },
              },
              {
                target: '@logtail/pino',
                level: 'debug',
                redact: ['password'],
                options: {
                  sourceToken: configService.get<string>('BETTERSTACK_TOKEN'),
                  options: {
                    endpoint: `https://${configService.get<string>('BETTERSTACK_CONNECTION')}`,
                  },
                },
              },
            ],
          },
        },
      }),
    }),
    PrismaModule,
    ExerciseModule,
    QuizModule,
    AnsweredExerciseModule,
    AnsweredQuizModule,
    UnitModule,
    TagModule,
    VideoModule,
    FileModule,
    ChapterModule,
    UserModule,
    UserChapterModule,
    NotificationModule,
    UserNotificationModule,
    UserUnitModule,
    AuthModule,
    S3Module,
    EmailModule,
    VideoProgressModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EmailValidationGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
