import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setDescription(`${configService.get('APP_NAME')} API documentation`)
    .setVersion('1.0')
    .build();
  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  app.register(fastifyCookie);
  app.register(fastifyMultipart);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.enableCors({
    credentials: true,
    origin: '*',
    exposedHeaders: ['set-cookie'],
  });
  app.setGlobalPrefix('/api/v1');

  await app.listen(configService.get('PORT'), '0.0.0.0');
}

bootstrap();
