import AuthModule from '@components/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import HomeModule from '@components/home/home.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import SessionsModule from '@components/sessions/sessions.module';
import UsersModule from '@components/users/users.module';
import { join } from 'path';
import AppGateway from '@components/events/events.gateway';
import SharedModule from '@shared/shared.module';
import PresetsModule from '@components/presets/presets.module';
import AppController from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'public/assets'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    HomeModule,
    SessionsModule,
    SharedModule,
    PresetsModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export default class AppModule {}
