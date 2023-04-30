import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CategorizeService } from './categorize.service';
@Controller('categorize')
export class CategorizeController {
  constructor(private readonly categorizeService: CategorizeService) {}
  //增加设备
  @Post('')
  async create(@Body() dto) {
    const data = await this.categorizeService.add(dto);
    return data;
  }
  //删除设备
  @Delete('')
  del(@Body() dto) {
    const data = this.categorizeService.del(dto.id);
    return data;
  }
  //修改设备
  @Put('')
  update(@Body() dto) {
    return this.categorizeService.update(dto);
  }
  //查询设备
  @Get('')
  async query() {
    return await this.categorizeService.findAll();
  }
}
