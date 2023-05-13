import { Module } from '@nestjs/common';
import { CategorizeController } from './categorize.controller';
import { CategorizeService } from './categorize.service';
import { CategorizeEntity } from './categorize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/device/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategorizeEntity, DeviceEntity])],
  controllers: [CategorizeController],
  providers: [CategorizeService],
})
export class CategorizeModule {}
