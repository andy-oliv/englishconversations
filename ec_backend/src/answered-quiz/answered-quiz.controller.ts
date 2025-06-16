import { Body, Controller, Get, Post } from '@nestjs/common';
import Return from '../common/types/Return';
import { AnsweredQuizService } from './answered-quiz.service';
import SaveQuizAnswerDTO from './dto/saveQuizAnswer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AnsweredQuizzes')
@Controller('api/answers/q')
export class AnsweredQuizController {
  constructor(private readonly answerQuizService: AnsweredQuizService) {}

  @Post()
  async saveAnswer(@Body() data: SaveQuizAnswerDTO): Promise<Return> {
    return this.answerQuizService.saveAnswer(data);
  }
}
