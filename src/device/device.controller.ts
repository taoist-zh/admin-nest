import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import multer = require('multer');

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
  @Get('/user')
  async query(@Query() query) {
    return await this.deviceService.findUser(query.id);
  }
  //模糊查询设备
  @Get('like')
  async query2(@Query() query) {
    if (!query.attr) {
      return await this.deviceService.findLike(query);
    } else {
      return await this.deviceService.findLikeAttr(query);
    }
  }
  //查询个人名下设备（使用、维修、报废）
  @Get('/foruser')
  async query3(@Query() query) {
    if (query.type == 1) {
      //查找使用记录，使用中
      return await this.deviceService.findUse(query);
    } else if (query.type == 2) {
      //查找维修记录
      return await this.deviceService.findUnable(query);
    } else if (query.type == 3) {
      //查找报废记录
      return await this.deviceService.findDisable(query);
    }
  }
  //查询设备使用者
  @Get('')
  async query1(@Query() query) {
    if (!query.id) {
      return await this.deviceService.findAll(query);
    } else {
      return await this.deviceService.findLikeAttr(query);
    }
  }
  //上传图片
  @Post('img')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          // cb(null, join(process.cwd(), 'upload'));
          cb(null, join(process.cwd(), 'public'));
        },
        filename: function (req, file, cb) {
          const unique = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
          const imgPath = `${unique}.${file.mimetype.split('/')[1]}`;
          cb(null, imgPath);
        },
      }),
      limits: {
        fileSize: 1024 * 1024,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          throw new BadRequestException(`只支持jpg, png格式`);
        }
        cb(null, true);
      },
    }),
  )
  async coverImport(@UploadedFile() file) {
    return { url: `/static/${file.filename}` };
  }
}
