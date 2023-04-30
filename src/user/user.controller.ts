import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { User } from './user.decorator';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //注册
  @UsePipes(new ValidationPipe())
  @Post('')
  async create(@Body('') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  //删除
  @Delete('')
  async delet(@Query() query) {
    console.log(query, '删除');
    const { id } = query;

    if (id != undefined) {
      const data = await this.userService.delete(id);
      return data;
    } else {
      return {
        code: 400,
        message: '请携带删除id',
        data: null,
      };
    }
  }

  //查询用户
  @Get()
  async list(@Query() query) {
    console.log(query);
    let data: any;
    if (query.id == undefined) {
      data = await this.userService.findAll();
    } else {
      data = [await this.userService.findOne(query.id)];
    }
    return {
      code: 200,
      message: '查询成功',
      data: data,
    };
  }

  //管理员修改用户信息
  @Put('/update')
  async updateM(@Body('') userData) {
    console.log(userData)
    return await this.userService.updateM( userData );
  }

  //修改个人信息
  @Put('')
  async update(@User('id') userId: number, @Body('') userData) {
    return await this.userService.update(userId, userData);
  }

  //登陆
  @Post('/login')
  async login(@Body('') loginUserDto) {
    const res = await this.userService.login(loginUserDto);
    return res;
  }
}
