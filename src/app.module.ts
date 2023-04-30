import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { DeviceModule } from './device/device.module';
import { CategorizeModule } from './categorize/categorize.module';
import { ApplyModule } from './apply/apply.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '43.142.105.160',
      port: 3306,
      username: 'api-admin',
      password: 'd3epPpLZkieKA8Yx',
      database: 'api-admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    DeviceModule,
    CategorizeModule,

    ApplyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
