import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 86400000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT);
}

bootstrap();
