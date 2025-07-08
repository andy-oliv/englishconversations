import { Controller, Get, UseGuards } from '@nestjs/common';
import Return from '../common/types/Return';
import { DashboardService } from './dashboard.service';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '../../generated/prisma';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('api/dashboard')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async fetchInfo(): Promise<Return> {
    return this.dashboardService.fetchInfo();
  }
}
