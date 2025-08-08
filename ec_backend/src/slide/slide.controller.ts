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
import { SlideService } from './slide.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoles } from '../../generated/prisma';
import { AuthType } from '../common/decorators/authType.decorator';
import { SelfGuard } from '../auth/guards/self/self.guard';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import Return from '../common/types/Return';
import GenerateSlideDTO from './dto/generateSlide.dto';
import UpdateSlideDTO from './dto/updateSlide.dto';

@ApiTags('Slide')
@Controller('api/slideshow/slides')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.slide.generateSlide.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.Slide.generateSlideDTO.slideshowId.isUUID,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateSlide(@Body() data: GenerateSlideDTO): Promise<Return> {
    return this.slideService.generateSlide(data);
  }

  @Patch(':slideId')
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slide.updateSlide.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slide.updateSlide.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateSlide(
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
    @Body() updatedData: UpdateSlideDTO,
  ): Promise<Return> {
    return this.slideService.updateSlide(slideId, updatedData);
  }

  @Delete(':slideId')
  @AuthType(UserRoles.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.slide.deleteSlide.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: httpMessages_EN.slide.deleteSlide.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteSlide(
    @Param('slideId', new ParseUUIDPipe()) slideId: string,
  ): Promise<Return> {
    return this.slideService.deleteSlide(slideId);
  }
}
