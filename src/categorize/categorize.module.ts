import { Module } from '@nestjs/common';
import { CategorizeController } from './categorize.controller';
import { CategorizeService } from './categorize.service';
import { CategorizeEntity } from './categorize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategorizeEntity])],
  controllers: [CategorizeController],
  providers: [CategorizeService],
})
export class CategorizeModule {}
