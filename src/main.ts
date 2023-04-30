import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  //允许跨域
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  //设置全局前缀
  app.setGlobalPrefix('api');
  //swagger接口文档配置
  const options = new DocumentBuilder()
    .setTitle('实验室设备管理系统api')
    .setDescription('实验室设备管理系统api')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  //设置接口文档地址
  SwaggerModule.setup('/docs', app, document);
  await app.listen(3000);
}

bootstrap();
