import { Test, TestingModule } from '@nestjs/testing';
import { SlideshowController } from './slideshow.controller';

describe('SlideshowController', () => {
  let controller: SlideshowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlideshowController],
    }).compile();

    controller = module.get<SlideshowController>(SlideshowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
