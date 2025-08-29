import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnsweredExerciseService } from './answered-exercise.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Return from '../common/types/Return';
import SaveAnswerDTO from './dto/saveAnswer.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import UpdateFeedbackDTO from './dto/updateAnsweredExercise.dto';
import { SelfGuard } from '../auth/guards/self/self.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';
import CreateBatchExercisesDTO from './dto/createBatchExercises.dto';
import { CreateBatchExercisesArrayDTO } from './dto/createBatchExercisesArray.dto';

@ApiTags('AnsweredExercise')
@Controller('api/answers/e')
export class AnsweredExerciseController {
  constructor(
    private readonly answeredExerciseService: AnsweredExerciseService,
  ) {}

  @Post()
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.saveAnswer.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.answeredExercise.saveAnswerDTO.answeredQuizId
        .isUUID,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async saveAnswer(@Body() data: SaveAnswerDTO): Promise<Return> {
    return this.answeredExerciseService.saveAnswer(data);
  }

  @Get('query')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.fetchAnswersByUser.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.fetchAnswersByUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswersByUser(
    @Query('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.answeredExerciseService.fetchAnswersByUser(userId);
  }

  @Get(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswerById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.answeredExerciseService.fetchAnswerById(id);
  }

  @Get()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.fetchAnswers.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.fetchAnswers.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswers(): Promise<Return> {
    return this.answeredExerciseService.fetchAnswers();
  }

  @Patch(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.addFeedback.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.addFeedback.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async addFeedback(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { feedback }: UpdateFeedbackDTO,
  ): Promise<Return> {
    return this.answeredExerciseService.addFeedback(id, feedback);
  }

  @Delete(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.deleteAnswer.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.deleteAnswer.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteAnswer(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.answeredExerciseService.deleteAnswer(id);
  }
}
