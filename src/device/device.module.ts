import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceEntity } from './device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyEntity } from 'src/apply/apply.entity';
import { UseEntity } from 'src/record/use/use.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, ApplyEntity, UseEntity])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
