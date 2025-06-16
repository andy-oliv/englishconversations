import { Test, TestingModule } from '@nestjs/testing';
import { AnsweredQuizService } from './answered-quiz.service';

describe('AnsweredQuizService', () => {
  let service: AnsweredQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnsweredQuizService],
    }).compile();

    service = module.get<AnsweredQuizService>(AnsweredQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
