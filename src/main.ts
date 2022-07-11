import 'module-alias/register';

import flash from 'connect-flash';
import passport from 'passport';
import session from 'express-session';

import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import AppModule from '@components/app/app.module';

import AllExceptionsFilter from '@filters/all.exceptions.filter';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import NotFoundExceptionFilter from '@filters/not-found.exception.filter';

const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new BaseWsExceptionFilter());
  app.useGlobalFilters(new NotFoundExceptionFilter());

  const viewsPath = join(__dirname, '../public/views');

  app.set('view options', { layout: 'layouts/main' });
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: process.env.PASSPORT_SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: new MongoDBStore({
        uri: process.env.MONGODB_URL,
        collection: 'passportsessions',
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The boilerplate API for nestjs devs')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, async () => {
    // eslint-disable-next-line no-console
    console.log(`The server is running on ${port} port: http://localhost:${port}/api`);
  });
}
bootstrap();
