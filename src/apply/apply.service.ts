import { Injectable } from '@nestjs/common';
import { ApplyEntity } from './apply.entity';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { resourceLimits } from 'worker_threads';
import { UseEntity } from '../record/use/use.entity';
import { UserEntity } from '../user/user.entity';
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
    private connection: Connection,
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
      console.log(result,'22222222');
      const data = {
        ...result[0],
        applyStatus: dto.applyStatus,
        description: dto.description,
      };
      //如果dto.applyStatus=2，需要往使用记录/维修记录/报废表里增加数据
      if ((dto.applyStatus = 2)) {
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
    let where = '';
    if (Object.keys(dto).length > 0) {
      where = 'WHERE ';
      Object.keys(dto).forEach((item, index) => {
        const and = index == Object.keys(dto).length - 1 ? '' : ' and ';
        where += 'apply.' + item + '=' + dto[item] + and;
      });
    }

    const data = await this.connection.query(`
    SELECT
    apply.id AS id,
    apply.userId AS userId,
    apply.deviceId AS deviceId,
    apply.applyType AS applyType,
    apply.applyStatus AS applyStatus,
    apply.description AS description,
    apply.time AS time,
    user.username AS username,
    device.name AS name,
    device.imgUrl AS imgUrl 
FROM
	apply
	LEFT JOIN user ON apply.userId = user.id
	LEFT JOIN device ON apply.deviceId = device.id 
  ${where}
    `);
    return {
      code: 200,
      message: '查询成功',
      data: data,
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
