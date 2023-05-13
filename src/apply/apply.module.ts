import { Module } from '@nestjs/common';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { ApplyEntity } from './apply.entity';
import { UseEntity } from '../record/use/use.entity';
import { MaintenanceEntity } from '../record/maintenance/maintenance.entity';
import { UnableUseEntity } from '../record/unable-use/unableUse.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/device/device.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplyEntity,
      UseEntity,
      MaintenanceEntity,
      UnableUseEntity,
      DeviceEntity,
    ]),
  ],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
