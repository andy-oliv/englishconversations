import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SlideshowProgressService } from './slideshow-progress.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '@prisma/client';
import { AuthType } from '../common/decorators/authType.decorator';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import GenerateProgressDTO from './dto/generateProgress.dto';
import Return from '../common/types/Return';
import UpdateProgressDTO from './dto/updateProgress.dto';
import { SelfGuard } from '../auth/guards/self/self.guard';

@ApiTags('SlideshowProgress')
@Controller('api/slideshow/progress')
export class SlideshowProgressController {
  constructor(
    private readonly slideshowProgressService: SlideshowProgressService,
  ) {}

  @Post()
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.slideshowProgress.generateProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.slideshowProgress.generateProgressDTO.userId
        .isNotEmpty,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.slideshowProgress.throwIfProgressExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateProgress(@Body() data: GenerateProgressDTO): Promise<Return> {
    return this.slideshowProgressService.generateProgress(data);
  }

  @Get('user/:userId')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshowProgress.fetchProgressesByUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshowProgress.fetchProgressesByUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchProgressesByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.slideshowProgressService.fetchProgressesByUser(userId);
  }

  @Get('id/:progressId')
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshowProgress.fetchProgressById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshowProgress.fetchProgressById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchSlideshowById(
    @Param('progressId', new ParseUUIDPipe()) progressId: string,
  ): Promise<Return> {
    return this.slideshowProgressService.fetchProgressById(progressId);
  }

  @Get('all')
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshowProgress.fetchProgresses.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshowProgress.fetchProgresses.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchProgresses(): Promise<Return> {
    return this.slideshowProgressService.fetchProgresses();
  }

  @Patch(':slideshowId')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshowProgress.updateProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshowProgress.updateProgress.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateProgress(
    @Param('slideshowId', new ParseUUIDPipe()) slideshowId: string,
    @Body() updatedData: UpdateProgressDTO,
  ): Promise<Return> {
    return this.slideshowProgressService.updateProgress(
      slideshowId,
      updatedData,
    );
  }

  @Delete(':slideshowId')
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshowProgress.deleteProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshowProgress.deleteProgress.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteProgress(
    @Param('slideshowId', new ParseUUIDPipe()) slideshowId: string,
  ): Promise<Return> {
    return this.slideshowProgressService.deleteProgress(slideshowId);
  }
}
