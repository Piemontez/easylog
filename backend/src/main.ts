import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import easylogConfig from './config/easylog.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder().setTitle('Thalamus Easy Log Swagger').setDescription('All endpoints are available on swagger ').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Cors
  if (!easylogConfig.PRODCTION_MODE) {
    app.enableCors({
      origin: easylogConfig.DEV_URL,
      credentials: true,
    });
  }

  await app.listen(easylogConfig.PORT);
}
bootstrap();
