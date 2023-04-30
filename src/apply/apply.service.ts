import { Injectable } from '@nestjs/common';
import { ApplyEntity } from './apply.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { resourceLimits } from 'worker_threads';
import { UseEntity } from '../record/use/use.entity';
import { MaintenanceEntity } from '../record/maintenance/maintenance.entity';
import { UnableUseEntity } from '../record/unable-use/unableUse.entity';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(ApplyEntity)
    private applyRepository: Repository<ApplyEntity>,
    @InjectRepository(UseEntity)
    private useRepository: Repository<UseEntity>,
    @InjectRepository(MaintenanceEntity)
    private maintenanceRepository: Repository<MaintenanceEntity>,
    @InjectRepository(UnableUseEntity)
    private unableUseRepository: Repository<UnableUseEntity>,
  ) {}
  async add(dto) {
    return {
      code: 200,
      message: '申请成功',
      data: await this.applyRepository.save(dto),
    };
  }

  //处理申请
  async deal(dto) {
    if (!dto.id) {
      return {
        code: 401,
        message: '缺少申请id',
      };
    } else {
      const result = await this.applyRepository.findBy({ id: dto.id });
      console.log(result);
      const data = {
        ...result[0],
        status: dto.status,
        description: dto.description,
      };
      //如果dto.status=2，需要往使用记录/维修记录/报废表里增加数据
      if ((dto.status = 2)) {
        const { userId, deviceId } = result[0];
        switch (result[0].applyType) {
          case 1:
            await this.useRepository.save({
              userId: userId,
              deviceId: deviceId,
              startTime: new Date(),
            });
            break;
          case 2:
            console.log('归还');
            const result = await this.useRepository.findBy({
              userId: userId,
              deviceId: deviceId,
            });
            await this.useRepository.save({
              ...result[0],
              endTime: new Date(),
            });
            break;
          case 3:
            console.log('维修');
            await this.maintenanceRepository.save({
              userId: userId,
              deviceId: deviceId,
              time: new Date(),
            });
            break;
          case 4:
            await this.unableUseRepository.save({
              userId: userId,
              deviceId: deviceId,
              time: new Date(),
            });
            console.log('报废');
            break;
        }
      }

      return {
        code: 200,
        message: '更新成功',
        data: await this.applyRepository.save(data),
      };
    }
  }

  //申请记录
  async applyList(dto) {
    return {
      code: 200,
      message: '查询成功',
      data: await this.applyRepository.findBy(dto),
    };
  }

  //使用记录
  async useList(dto) {
    return {
      code: 200,
      message: '查询成功',
      data: await this.useRepository.findBy(dto),
    };
  }

  //维修记录
  async maintenancelist(dto) {
    return {
      code: 200,
      message: '查询成功',
      data: await this.maintenanceRepository.findBy(dto),
    };
  }
  //报废记录
  async unuselist(dto) {
    return {
      code: 200,
      message: '查询成功',
      data: await this.unableUseRepository.findBy(dto),
    };
  }
}
