import { Test, TestingModule } from '@nestjs/testing';
import { SlideshowProgressService } from './slideshow-progress.service';

describe('SlideshowProgressService', () => {
  let service: SlideshowProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlideshowProgressService],
    }).compile();

    service = module.get<SlideshowProgressService>(SlideshowProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
