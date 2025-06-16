import { Test, TestingModule } from '@nestjs/testing';
import { AnsweredQuizController } from './answered-quiz.controller';

describe('AnsweredQuizController', () => {
  let controller: AnsweredQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsweredQuizController],
    }).compile();

    controller = module.get<AnsweredQuizController>(AnsweredQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
