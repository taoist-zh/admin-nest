import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //注册
  //   @UsePipes(new ValidationPipe())
  //   @Post('users')
  //   async create(@Body('user') userData: CreateUserDto) {
  //     return this.userService.create(userData);
  //   }

  //删除
  @Get('')
  async delet() {
    console.log('删除');
    const data = await this.userService.findAll();
    return data;
  }
}
