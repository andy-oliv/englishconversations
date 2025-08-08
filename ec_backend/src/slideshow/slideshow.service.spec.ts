import { Test, TestingModule } from '@nestjs/testing';
import { SlideshowService } from './slideshow.service';

describe('SlideshowService', () => {
  let service: SlideshowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlideshowService],
    }).compile();

    service = module.get<SlideshowService>(SlideshowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
