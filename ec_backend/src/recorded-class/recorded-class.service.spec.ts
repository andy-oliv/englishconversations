import { Test, TestingModule } from '@nestjs/testing';
import { RecordedClassService } from './recorded-class.service';

describe('RecordedClassService', () => {
  let service: RecordedClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordedClassService],
    }).compile();

    service = module.get<RecordedClassService>(RecordedClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
