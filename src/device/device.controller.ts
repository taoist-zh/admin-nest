import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  //增加设备
  @Post('')
  async create(@Body() dto) {
    const data = await this.deviceService.add(dto);
    return data;
  }
  //删除设备
  @Delete('')
  del(@Body() dto) {
    const data = this.deviceService.del(dto.id);
    return data;
  }
  //修改设备
  @Put('')
  update(@Body() dto) {
    return this.deviceService.update(dto);
  }
  //查询设备
  @Get('')
  async query(@Query() query) {
    if(!query.id){
      return await this.deviceService.findAll();
    }else{
      return await this.deviceService.findOne(query.id);
    }
   

  }
}
