import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // manejo de excepciones globales

  app.useGlobalFilters(new AllExceptionFilter());
  // manejo de tiempo maximo de respuesta globales
  app.useGlobalInterceptors(new TimeOutInterceptor());
  // manejo de validaciones a respuestas globales
  app.useGlobalPipes(new ValidationPipe());

  // configuracion de Swagger para documentar API
  const options = new DocumentBuilder()
  .setTitle('API textedit')
  // .setDescription('Framework para agilizar la creación de aplicaciones que menjan actas dialogicas.')
  .setDescription('Aplicativo web para realizar una gestión del seguimiento de proyectos de título construido a partir del framework D-MeetFlow.')
  .setVersion('1.1')
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
  console.log('API Gateway de meetflow corriendo en el puerto: ', parseInt(process.env.API_PORT));
}
bootstrap();
