import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import easylogConfig from './config/easylog.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useBodyParser('text');

  // Swagger
  const config = new DocumentBuilder().setTitle('EasyLog Swagger').setDescription('All endpoints are available on swagger ').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Cors
  if (!easylogConfig.PRODCTION_MODE) {
    app.enableCors({
      origin: easylogConfig.DEV_URL,
      credentials: true,
    });
  }

  console.log('PORT:' + easylogConfig.PORT);
  await app.listen(easylogConfig.PORT);
}
bootstrap();
