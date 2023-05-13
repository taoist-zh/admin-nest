import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategorizeEntity } from './categorize.entity';
import { Repository } from 'typeorm';
import { DeviceEntity } from 'src/device/device.entity';

@Injectable()
export class CategorizeService {
  constructor(
    @InjectRepository(CategorizeEntity)
    private categorizeRepository: Repository<CategorizeEntity>,
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
  ) {}
  //增加
  async add(dto) {
    console.log(dto);
    // this.deviceRepository.save()
    if (!dto.name) {
      return {
        code: 401,
        message: '分类名称必填',
      };
    } else {
      const result = await this.categorizeRepository.save(dto);
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
    //如果该分类下存在数据
    await this.deviceRepository.delete({ categorizeId: id });
    const data = await this.categorizeRepository.delete({ id });
    if (data.affected == 0) {
      return {
        code: 401,
        message: '分类不存在',
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
    const toUpdate = await this.categorizeRepository.findBy({ id: dto.id });
    const updated = {
      ...toUpdate[0],
      ...dto,
    };
    delete updated.id;
    const result = await this.categorizeRepository.update(
      { id: dto.id },
      updated,
    );
    return {
      code: result.affected > 0 ? 200 : 401,
      message: result.affected > 0 ? '修改成功' : '修改失败',
      data: result,
    };
  }
  async findAll() {
    const result = await this.categorizeRepository.find();
    return {
      code: 200,
      meaasge: '查询成功',
      data: result,
    };
  }
}
