import { Body, Controller, Post } from '@nestjs/common';
import { AnsweredExerciseService } from './answered-exercise.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import Return from '../common/types/Return';
import SaveAnswerDTO from './dto/saveAnswer.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';

@ApiTags('AnsweredExercise')
@Controller('api/exercises/answers')
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
  async generateAnswer(@Body() data: SaveAnswerDTO): Promise<Return> {
    return this.answeredExerciseService.saveAnswer(data);
  }
}
