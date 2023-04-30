import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApplyService } from './apply.service';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}
  //增加申请
  @Post('/add')
  add(@Body() dto) {
    return this.applyService.add(dto);
  }
  //处理申请
  @Post('/deal')
  deal(@Body() dto) {
    return this.applyService.deal(dto);
  }

  //查询申请
  @Get('/list')
  applyList(@Query() query) {
    return this.applyService.applyList(query);
  }

  //查询使用记录
  @Get('/uselist')
  useList(@Query() query) {
    return this.applyService.useList(query);
  }
  //查询维修记录
  @Get('/maintenancelist')
  maintenancelist(@Query() query) {
    return this.applyService.maintenancelist(query);
  }
  //查询报废记录
  @Get('/unuselist')
  unuselist(@Query() query) {
    return this.applyService.unuselist(query);
  }
}
