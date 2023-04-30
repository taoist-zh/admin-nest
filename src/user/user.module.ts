import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../commonAuth.middleware';
import { mangerAuthMiddleware } from '../mangerAuth.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/user', method: RequestMethod.GET },
        { path: '/user', method: RequestMethod.PUT },
      );
    consumer
      .apply(mangerAuthMiddleware)
      .forRoutes({ path: '/user/update', method: RequestMethod.PUT });
  }
}
