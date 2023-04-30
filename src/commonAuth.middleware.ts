import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Jwtkey } from './config';
import { UserService } from './user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
   
    if (authHeaders) {
      const token = authHeaders;
      const decoded: any = jwt.verify(token, Jwtkey);
      const user = await this.userService.findById(decoded.id);
     
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
