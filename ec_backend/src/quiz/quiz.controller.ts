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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import Return from '../common/types/Return';
import CreateQuizDTO from './dto/createQuiz.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import fetchQuizzesByQueryDTO from './dto/fetchQuizzesByQuery.dto';
import UpdateQuizDTO from './dto/updateQuiz.dto';
import AddOrRemoveExerciseDTO from './dto/addOrRemoveExercise.dto';

@ApiTags('Quizzes')
@Controller('api/quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.quiz.createQuiz.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.quizzes.createQuizDTO.level.isIn,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.quiz.throwIfQuizExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createQuiz(@Body() quizData: CreateQuizDTO): Promise<Return> {
    return this.quizService.createQuiz(quizData);
  }

  @Get('query')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.fetchQuizzesByQuery.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.quizzes.fetchQuizzesByQueryDTO.difficulty.isIn,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchQuizzesByQuery(
    @Query() query: fetchQuizzesByQueryDTO,
  ): Promise<Return> {
    return this.quizService.fetchQuizzesByQuery(query.level, query.difficulty);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.fetchQuizById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.fetchQuizById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchQuizById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.quizService.fetchQuizById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.fetchQuizzes.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.fetchQuizzes.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchQuizzes(): Promise<Return> {
    return this.quizService.fetchQuizzes();
  }

  @Patch('exercise/add')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.addExercise.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.quizzes.addOrRemoveExerciseDTO.quizId.isNotEmpty,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.fetchQuizById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  addExercise(@Query() query: AddOrRemoveExerciseDTO): Promise<Return> {
    return this.quizService.addExercise(query.quizId, query.exerciseId);
  }

  @Delete('exercise/remove')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.removeExercise.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.quizzes.addOrRemoveExerciseDTO.quizId.isNotEmpty,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.fetchQuizById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  removeExercise(@Query() query: AddOrRemoveExerciseDTO): Promise<Return> {
    return this.quizService.removeExercise(query.quizId, query.exerciseId);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.updateQuiz.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.quizzes.createQuizDTO.difficulty.isIn,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.updateQuiz.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateQuiz(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() quizData: UpdateQuizDTO,
  ): Promise<Return> {
    return this.quizService.updateQuiz(id, quizData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.quiz.deleteQuiz.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.quiz.deleteQuiz.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteQuiz(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.quizService.deleteQuiz(id);
  }
}
