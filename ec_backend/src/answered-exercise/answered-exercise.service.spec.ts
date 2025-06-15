import { Test, TestingModule } from '@nestjs/testing';
import { AnsweredExerciseService } from './answered-exercise.service';

describe('AnsweredExerciseService', () => {
  let service: AnsweredExerciseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnsweredExerciseService],
    }).compile();

    service = module.get<AnsweredExerciseService>(AnsweredExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
