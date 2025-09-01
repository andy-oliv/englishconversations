import { Test, TestingModule } from '@nestjs/testing';
import { RecordedClassController } from './recorded-class.controller';

describe('RecordedClassController', () => {
  let controller: RecordedClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordedClassController],
    }).compile();

    controller = module.get<RecordedClassController>(RecordedClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
