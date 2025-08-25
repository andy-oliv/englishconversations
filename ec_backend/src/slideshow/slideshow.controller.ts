import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SlideshowService } from './slideshow.service';
import Return from '../common/types/Return';
import { UserRoles } from '@prisma/client';
import { AuthType } from '../common/decorators/authType.decorator';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import GenerateSlideShowDTO from './dto/generateSlideshow.dto';
import { RoleGuard } from 'src/auth/guards/role/role.guard';

@ApiTags('Slideshow')
@Controller('api/slideshow')
export class SlideshowController {
  constructor(private readonly slideshowService: SlideshowService) {}

  @Post()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.slideshow.generateSlideshow.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateSlideshow(
    @Body() slideshowData: GenerateSlideShowDTO,
  ): Promise<Return> {
    return this.slideshowService.generateSlideshow(slideshowData);
  }

  @Get(':slideshowId')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshow.fetchSlideshowById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshow.fetchSlideshowById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchSlideshowById(
    @Param('slideshowId', new ParseUUIDPipe()) slideshowId: string,
  ): Promise<Return> {
    return this.slideshowService.fetchSlideshowById(slideshowId);
  }

  @Get()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshow.fetchSlideshows.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshow.fetchSlideshows.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchSlideshows(): Promise<Return> {
    return this.slideshowService.fetchSlideshows();
  }

  @Delete(':slideshowId')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slideshow.deleteSlideshow.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slideshow.deleteSlideshow.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteSlideshow(
    @Param('slideshowId', new ParseUUIDPipe()) slideshowId: string,
  ): Promise<Return> {
    return this.slideshowService.deleteSlideshow(slideshowId);
  }
}
