import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import Return from '../common/types/Return';
import { UserNotificationService } from './user-notification.service';
import generateUserNotificationDTO from './dto/generateUserNotification.dto';
import { SelfGuard } from '../auth/guards/self/self.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';
import UpdateUserNotificationDTO from './dto/updateuUserNotification.dto';

@ApiTags('UserNotifications')
@Controller('api/users/notifications')
export class UserNotificationController {
  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}

  @Post()
  @UseGuards(SelfGuard)
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
  @UseGuards(SelfGuard)
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

  @Patch('update')
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userNotification.updateUserNotification.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userNotification.updateUserNotification.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateUserNotification(
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @Query('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateUserNotificationDTO,
  ): Promise<Return> {
    return this.userNotificationService.updateUserNotification(
      userId,
      id,
      data,
    );
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
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
