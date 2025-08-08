import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginLogService } from './login-log.service';
import Return from '../common/types/Return';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';
import { RoleGuard } from '../auth/guards/role/role.guard';
import httpMessages_EN from '../helper/messages/httpMessages.en';

@ApiTags('LoginLog')
@Controller('api/logs')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Get()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.loginLog.fetchLogs.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.loginLog.fetchLogs.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchLogs(): Promise<Return> {
    return this.loginLogService.fetchLogs();
  }

  @Get('user/:userId')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.loginLog.fetchUserLogs.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.loginLog.fetchUserLogs.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserLogs(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.loginLogService.fetchUserLogs(userId);
  }

  @Get('month')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.loginLog.fetchMonthlyLogs.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.loginLog.fetchMonthlyLogs.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchMonthlyLogs(): Promise<Return> {
    return this.loginLogService.fetchMonthlyLogs();
  }

  @Get('today')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.loginLog.fetchTodayLogs.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.loginLog.fetchTodayLogs.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchTodayLogs(): Promise<Return> {
    return this.loginLogService.fetchTodayLogs();
  }
}
