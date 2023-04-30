import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Jwtkey } from '../config';
export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  //如果是鉴权路由
  if (!!req.user) {
    return !!data ? req.user[data] : req.user;
  }

  // 非鉴权路由，依旧需要获取jwt存储的信息
  const token = req.headers.authorization
    ? (req.headers.authorization as string).split(' ')
    : null;
  if (token && token[1]) {
    const decoded: any = jwt.verify(token[1], Jwtkey);
    return !!data ? decoded[data] : decoded.user;
  }
});
