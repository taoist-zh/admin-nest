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
  @Get('')
  async query(@Query() query) {
    if (!query.id) {
      return await this.deviceService.findAll(query);
    } else {
      return await this.deviceService.findOne(query.id);
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
