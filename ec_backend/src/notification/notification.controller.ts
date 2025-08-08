import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import Return from '../common/types/Return';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import GenerateNotificationDTO from './dto/generateNotification.dto';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import UpdateNotificationDTO from './dto/updateNotification.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';

@ApiTags('Notifications')
@Controller('api/notifications')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.notification.generateNotification.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.notification.type.isIn,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateNotification(
    @Body() data: GenerateNotificationDTO,
  ): Promise<Return> {
    return this.notificationService.generateNotification(data);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.notification.fetchNotificationById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.notification.fetchNotificationById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchNotificationById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.notificationService.fetchNotificationById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.notification.fetchNotifications.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.notification.fetchNotifications.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchNotifications(): Promise<Return> {
    return this.notificationService.fetchNotifications();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.notification.updateNotification.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.notification.updateNotification.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateNotification(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateNotificationDTO,
  ): Promise<Return> {
    return this.notificationService.updateNotification(id, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.notification.deleteNotification.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.notification.deleteNotification.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteNotification(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.notificationService.deleteNotification(id);
  }
}
