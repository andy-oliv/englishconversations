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
import { AnsweredExerciseService } from './answered-exercise.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Return from '../common/types/Return';
import SaveAnswerDTO from './dto/saveAnswer.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import fetchAnswerByQuery from './dto/fetchAnswerByQuery.dto';

@ApiTags('AnsweredExercise')
@Controller('api/answers/e')
export class AnsweredExerciseController {
  constructor(
    private readonly answeredExerciseService: AnsweredExerciseService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.saveAnswer.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.answeredExercise.saveAnswerDTO.quizId.isUUID,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async saveAnswer(@Body() data: SaveAnswerDTO): Promise<Return> {
    return this.answeredExerciseService.saveAnswer(data);
  }

  @Get('q')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswerByQuery(@Query() query: fetchAnswerByQuery) {
    return this.answeredExerciseService.fetchAnswerByQuery(
      query.studentId,
      query.exerciseId,
      query.quizId,
    );
  }

  @Get(':id')
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

  @Delete(':id')
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
