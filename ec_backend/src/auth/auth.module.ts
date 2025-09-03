import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { S3Module } from '../s3/s3.module';
import { WebsocketGuard } from './guards/websocket/websocket.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    PrismaModule,
    UserModule,
    EmailModule,
    S3Module,
  ],
  controllers: [AuthController],
  providers: [AuthService, WebsocketGuard],
  exports: [AuthService, WebsocketGuard],
})
export class AuthModule {}
