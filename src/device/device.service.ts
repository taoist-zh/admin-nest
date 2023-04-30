import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceEntity } from './device.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
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
  async findAll() {
    const result = await this.deviceRepository.find();
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
}
