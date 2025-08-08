import { Test, TestingModule } from '@nestjs/testing';
import { SlideshowProgressController } from './slideshow-progress.controller';

describe('SlideshowProgressController', () => {
  let controller: SlideshowProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlideshowProgressController],
    }).compile();

    controller = module.get<SlideshowProgressController>(SlideshowProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
