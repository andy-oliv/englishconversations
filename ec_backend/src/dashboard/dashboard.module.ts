import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [DashboardService, PrismaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
