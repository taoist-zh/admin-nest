import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceEntity } from './device.entity';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyEntity } from 'src/apply/apply.entity';
import { UseEntity } from 'src/record/use/use.entity';
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(ApplyEntity)
    private applyRepository: Repository<ApplyEntity>,
    @InjectRepository(UseEntity)
    private useRepository: Repository<UseEntity>,
    private connection: Connection,
  ) {}
  //增加
  async add(dto) {
    console.log(dto);
    // this.deviceRepository.save()
    if (!dto.name || !dto.deviceNumber) {
      return {
        code: 401,
        message: '设备名称&编号为必填',
      };
    } else {
      const result = await this.deviceRepository.save(dto);
      return {
        code: 200,
        message: '新增成功',
        data: result,
      };
    }
    return '增加';
  }

  //删除设备
  async del(id) {
    //删除设备相关申请
    await this.applyRepository.delete({ deviceId: id });
    const data = await this.deviceRepository.delete({ id });
    if (data.affected == 0) {
      return {
        code: 401,
        message: '设备不存在',
      };
    } else {
      return {
        code: 200,
        message: '删除成功',
      };
    }
  }

  //更新
  async update(dto) {
    if (!dto.id) {
      throw new HttpException('id为必须', HttpStatus.UNAUTHORIZED);
    }
    const toUpdate = await this.deviceRepository.findBy({ id: dto.id });
    const updated = {
      ...toUpdate[0],
      ...dto,
    };
    delete updated.id;
    const result = await this.deviceRepository.update({ id: dto.id }, updated);
    return {
      code: result.affected > 0 ? 200 : 401,
      message: result.affected > 0 ? '修改成功' : '修改失败',
      data: result,
    };
  }
  async findAll(dto) {
    const result = await this.deviceRepository.findBy(dto);
    return {
      code: 200,
      meaasge: '查询成功',
      data: result,
    };
  }
  async findOne(id) {
    const result = await this.deviceRepository.findBy({ id });
    return {
      code: 200,
      meaasge: '查询成功',
      data: result,
    };
  }
  async findUser(id) {
    if (id) {
      //从使用记录里找没有使用结束日期的
      const res = await this.connection.query(`
      SELECT user.username,user.id from \`use\` LEFT JOIN user ON \`use\`.userId=user.id
        WHERE \`use\`.endTime is null AND \`use\`.deviceId=${id}

      `);
      return {
        code: 200,
        data: res,
        message: '查询成功',
      };
    } else {
      return {
        code: 400,
        message: '缺少id',
      };
    }
  }
  async findLike(query) {
    const data = await this.connection.query(
      `
      SELECT * from device
      WHERE name like "%${query.name}%"
      `,
    );
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }
  //查询个人使用中设备
  async findUse(query) {
    const data = await this.connection.query(
      `
      SELECT device.*,\`use\`.startTime as time from \`use\`
      LEFT JOIN device ON device.id= \`use\`.deviceId
      where \`use\`.userId=${query.userId} and \`use\`.endTime is null
      `,
    );
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }
  //查询个人申请的维修的设备
  async findUnable(query) {
    const data = await this.connection.query(
      `
      SELECT device.*, maintenance.time as time  from maintenance
      LEFT JOIN device ON device.id= maintenance.deviceId
      where maintenance.userId=${query.userId} 
      `,
    );
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }
  //查询个人申请报废的设备
  async findDisable(query) {
    const data = await this.connection.query(
      `
      SELECT device.*,unableUse.time as time from unableUse
      LEFT JOIN device ON device.id= unableUse.deviceId
      where unableUse.userId=${query.userId} 
      `,
    );
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }
  async findLikeAttr(query) {
    const data = await this.connection.query(
      `
      SELECT * from device
      WHERE attr like '%${query.attr}%'
      `,
    );
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }
}
