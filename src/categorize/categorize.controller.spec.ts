import { Test, TestingModule } from '@nestjs/testing';
import { CategorizeController } from './categorize.controller';

describe('CategorizeController', () => {
  let controller: CategorizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorizeController],
    }).compile();

    controller = module.get<CategorizeController>(CategorizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
