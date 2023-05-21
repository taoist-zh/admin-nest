import { Injectable } from '@nestjs/common';
import { ApplyEntity } from './apply.entity';
import { Connection, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { resourceLimits } from 'worker_threads';
import { UseEntity } from '../record/use/use.entity';
import { UserEntity } from '../user/user.entity';
import { MaintenanceEntity } from '../record/maintenance/maintenance.entity';
import { UnableUseEntity } from '../record/unable-use/unableUse.entity';
import { DeviceEntity } from 'src/device/device.entity';

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
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
  ) {}
  async add(dto) {
    //判断设备是否在使用
    const toUpdate = await this.deviceRepository.findBy({ id: dto.deviceId });
    //0未使用，1.使用中，2.维修中，3.报废 4.待审核
    // if (toUpdate[0] != undefined && toUpdate[0].status == '1') {
    //   return {
    //     code: 400,
    //     message: '设备使用中',
    //     // data: data,
    //   };
    // }
    //如果存在相同申请，申请不成功
    const res = await this.applyRepository.findBy({
      deviceId: dto.deviceId,
      applyType: dto.applyType,
      userId: dto.userId,
    });
    if (res[0] != undefined) {
      return {
        code: 400,
        message: '已经存在相同申请',
        // data: data,
      };
    }
    //如果不在使用，就更改设备状态为待审核
    const time = new Date();
    dto.time = time;
    const data = await this.applyRepository.save(dto);
    if (data.deviceId) {
      //更改设备状态
      const updated = {
        ...toUpdate[0],
        status: '4', //4是已经有人申请
      };
      delete updated.id;
      const result = await this.deviceRepository.update(
        { id: dto.deviceId },
        updated,
      );
    }

    return {
      code: 200,
      message: '申请成功',
      data: data,
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
      console.log(result, '22222222');
      const data = {
        ...result[0],
        applyStatus: dto.applyStatus,
        description: dto.description,
      };
      const deviceId1 = result[0].deviceId;
      //如果dto.applyStatus=2，需要往使用记录/维修记录/报废表里增加数据
      if (dto.applyStatus == 2) {
        //通过申请，设备状态变更
        const toUpdate = await this.deviceRepository.findBy({
          id: deviceId1,
        });
        const { userId, deviceId } = result[0];
        switch (result[0].applyType) {
          case 1:
            console.log('通过使用');
            //通过使用，设备状态变更
            const updated = {
              ...toUpdate[0],
              status: '1',
            };
            delete updated.id;
            await this.deviceRepository.update({ id: deviceId1 }, updated);
            //其他设备相关申请，自动驳回
            await this.connection.query(`
            UPDATE apply SET applyStatus=3 WHERE deviceId=${deviceId1};
            `);

            //使用记录表里增加使用记录
            await this.useRepository.save({
              userId: userId,
              deviceId: deviceId,
              startTime: new Date(),
            });

            break;
          case 2:
            console.log('归还');
            //设备更新为未使用状态
            const updated1 = {
              ...toUpdate[0],
              status: '0',
            };
            delete updated1.id;
            await this.deviceRepository.update({ id: deviceId1 }, updated1);
            //查询使用记录
            const result = await this.useRepository.findBy({
              userId: userId,
              deviceId: deviceId,
            });

            //使用记录更新使用时间
            await this.useRepository.save({
              ...result[0],
              endTime: new Date(),
            });
            break;
          case 3:
            //更改设备状态
            const updated2 = {
              ...toUpdate[0],
              status: '2',
            };
            delete updated2.id;
            await this.deviceRepository.update({ id: deviceId1 }, updated2);
            //其他设备相关申请，自动驳回
            await this.connection.query(`
            UPDATE apply SET applyStatus=3 WHERE deviceId=${deviceId1};
            `);
            console.log('维修');
            await this.maintenanceRepository.save({
              userId: userId,
              deviceId: deviceId,
              time: new Date(),
            });
            const result1 = await this.useRepository.findBy({
              userId: userId,
              deviceId: deviceId,
            });

            //使用记录更新使用时间
            await this.useRepository.save({
              ...result1[0],
              endTime: new Date(),
            });
            break;
          case 4:
            //更改设备状态
            const updated3 = {
              ...toUpdate[0],
              status: '3',
            };
            delete updated3.id;
            await this.deviceRepository.update({ id: deviceId1 }, updated3);
            //其他设备相关申请，自动驳回
            await this.connection.query(`
            UPDATE apply SET applyStatus=3 WHERE deviceId=${deviceId1} and applyType=4;
            `);
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
        message: '操作成功',
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
