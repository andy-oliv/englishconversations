import { Test, TestingModule } from '@nestjs/testing';
import { AnsweredExerciseController } from './answered-exercise.controller';

describe('AnsweredExerciseController', () => {
  let controller: AnsweredExerciseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsweredExerciseController],
    }).compile();

    controller = module.get<AnsweredExerciseController>(AnsweredExerciseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
