import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import Return from '../common/types/Return';
import { UserNotificationService } from './user-notification.service';
import generateUserNotificationDTO from './dto/generateUserNotification.dto';

@ApiTags('UserNotifications')
@Controller('api/users/notifications')
export class UserNotificationController {
  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example:
      httpMessages_EN.userNotification.generateUserNotification.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.userNotification.userId.isUUID,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateUserNotification(
    @Body() data: generateUserNotificationDTO,
  ): Promise<Return> {
    return this.userNotificationService.generateUserNotification(data);
  }

  @Get('query')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userNotification.fetchUserNotifications.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userNotification.fetchUserNotifications.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserNotifications(
    @Query('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.userNotificationService.fetchUserNotifications(userId);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userNotification.deleteUserNotification.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Not Found',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userNotification.deleteUserNotification.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUserNotification(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userNotificationService.deleteUserNotification(id);
  }
}
