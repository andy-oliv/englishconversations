import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Return from '../common/types/Return';
import { UserProgressService } from './user-progress.service';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';
import { SelfGuard } from '../auth/guards/self/self.guard';
import httpMessages_EN from '../helper/messages/httpMessages.en';

@ApiTags('UserProgress')
@Controller('api/user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get(':userId')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userProgress.fetchProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchProgress(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.userProgressService.fetchProgress(userId);
  }
}
