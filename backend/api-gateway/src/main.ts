import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
  let app;
  // Para habilitar HTTPS
  if (process.env.PRIVATE_KEY_PATH && process.env.CERTIFICATE_PATH) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.PRIVATE_KEY_PATH), // Ruta a tu clave privada
      cert: fs.readFileSync(process.env.CERTIFICATE), // Ruta a tu certificado
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }
  // manejo de excepciones globales

  app.useGlobalFilters(new AllExceptionFilter());
  // manejo de tiempo maximo de respuesta globales
  app.useGlobalInterceptors(new TimeOutInterceptor());
  // manejo de validaciones a respuestas globales
  app.useGlobalPipes(new ValidationPipe());

  // configuracion de Swagger para documentar API
  const options = new DocumentBuilder()
  .setTitle('API Deptmeeting')
  .setDescription('Framework para agilizar la creación de aplicaciones que manejan actas dialogicas.')
  .setVersion('1.0')
  .addBearerAuth() // autentication
  .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document,{
    swaggerOptions: {
      filter: true,
    }
  });

  // PERMITE CORS
  app.enableCors();
  await app.listen(parseInt(process.env.API_PORT));
  console.log('API Gateway de Deptmeeting corriendo en el puerto: ', parseInt(process.env.API_PORT));
}
bootstrap();
