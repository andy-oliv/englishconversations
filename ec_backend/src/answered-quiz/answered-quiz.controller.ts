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
import Return from '../common/types/Return';
import { AnsweredQuizService } from './answered-quiz.service';
import SaveQuizAnswerDTO from './dto/saveQuizAnswer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import AddFeedbackDTO from './dto/addFeedback.dto';
import { SelfGuard } from '../auth/guards/self/self.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';

@ApiTags('AnsweredQuizzes')
@Controller('api/answers/q')
export class AnsweredQuizController {
  constructor(private readonly answerQuizService: AnsweredQuizService) {}

  @Post()
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.answeredQuiz.quizId.isUUID,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async saveAnswer(@Body() data: SaveQuizAnswerDTO): Promise<Return> {
    return this.answerQuizService.saveAnswer(data);
  }

  @Get('query')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.fetchAnswersByUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredQuiz.fetchAnswersByUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswersByUser(
    @Query('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.answerQuizService.fetchAnswersByUser(userId);
  }

  @Get(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.fetchAnswerById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredQuiz.fetchAnswerById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswerById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.answerQuizService.fetchAnswerById(id);
  }

  @Get()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.fetchAnswers.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredQuiz.fetchAnswers.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchAnswers(): Promise<Return> {
    return this.answerQuizService.fetchAnswers();
  }

  @Patch(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.addFeedback.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredQuiz.addFeedback.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async addFeedback(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { feedback }: AddFeedbackDTO,
  ): Promise<Return> {
    return this.answerQuizService.addFeedback(id, feedback);
  }

  @Delete(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.answeredQuiz.deleteAnswer.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.answeredQuiz.deleteAnswer.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteAnswer(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.answerQuizService.deleteAnswer(id);
  }
}
