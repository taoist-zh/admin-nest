import { Delete, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');
//加密算法
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  //注册用户
  async create(dto: CreateUserDto) {
    console.log(dto, 'dto');

    // //检查用户名是否存在
    const { username, password } = dto;
    const user = await this.usersRepository
      .createQueryBuilder()
      .where({ username })
      .getOne();

    // const user = await qb.getOne();
    console.log(user, 'user');
    if (user) {
      const errors = { username: '用户名已经存在，请修改' };
      throw new HttpException(
        { message: '用户名已经存在', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    //创建新用户
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.password = password;

    const savedUser = await this.usersRepository.save(newUser);
    return this.buildUserRO(savedUser);
  }
  //删除用户
  async delete(id) {
    const data = await this.usersRepository.delete({ id });
    if (data.affected == 0) {
      return {
        code: 401,
        message: '用户不存在',
      };
    } else {
      return {
        code: 200,
        message: '删除成功',
      };
    }
  }
  //获取所有用户信息
  async findAll(): Promise<UserEntity[]> {
    const data = await this.usersRepository.find();
    console.log(data);
    return data;
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id });
  }
  //管理员修改用户信息
  async updateM(dto) {
    if (!dto.id) {
      throw new HttpException('id为必须', HttpStatus.UNAUTHORIZED);
    }
    const toUpdate = await this.usersRepository.findBy({ id: dto.id });
    dto.password = !!dto.password
      ? await argon2.hash(dto.password)
      : toUpdate[0].password;
    const updated = {
      ...toUpdate[0],
      ...dto,
    };
    delete updated.id;
    let result = await this.usersRepository.update({ id: dto.id }, updated);
    return {
      code: result.affected > 0 ? 200 : 401,
      message: result.affected > 0 ? '修改成功' : '修改失败',
    };
  }
  //通过id查找
  async findById(id: number) {
    const user = await this.usersRepository.findBy({ id });

    if (!user) {
      const errors = { User: '没找到用户' };
      throw new HttpException({ errors }, 401);
    }

    return user[0];
  }
  //登陆
  async login(params) {
    const { username, password } = params;
    const result = await this.usersRepository.findBy({ username });
    if (result.length > 0) {
      console.log('存在', result[0]);

      const res: boolean = await argon2.verify(result[0].password, password);
      const token = this.generateJWT(result[0]);
      if (res) {
        return {
          code: 200,
          message: '登陆成功',
          data: {
            token: token,
          },
        };
      } else {
        return {
          code: 401,
          message: '密码错误',
        };
      }
    } else {
      return {
        code: 401,
        message: '用户名不存在',
      };
    }
  }
  //修改个人信息
  async update(id, dto) {
    const toUpdate = await this.usersRepository.findBy({ id });
    dto.password = !!dto.password
      ? await argon2.hash(dto.password)
      : toUpdate[0].password;
    const updated = {
      ...toUpdate[0],
      ...dto,
    };
    delete updated.id;
    let result = await this.usersRepository.update({ id: id }, updated);
    return {
      code: result.affected > 0 ? 200 : 401,
      message: result.affected > 0 ? '修改成功' : '修改失败',
    };
  }
  //生成token
  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    //jwt加密密钥
    let Jwtkey = '123456';
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        exp: exp.getTime() / 1000,
      },
      Jwtkey,
    );
  }

  private buildUserRO(user: UserEntity) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      remember_token: this.generateJWT(user),
    };

    return { message: '注册成功', code: 200, data: userRO };
  }
}
