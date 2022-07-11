import { Module } from '@nestjs/common';
import SessionsModule from '@components/sessions/sessions.module';
import HomeController from './home.controller';
import HomeService from './home.service';

@Module({
  imports: [SessionsModule],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export default class HomeModule {}
