import { Module } from '@nestjs/common';
import { CategorizeController } from './categorize.controller';
import { CategorizeService } from './categorize.service';

@Module({
  controllers: [CategorizeController],
  providers: [CategorizeService]
})
export class CategorizeModule {}
