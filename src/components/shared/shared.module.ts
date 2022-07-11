import SessionsModule from '@components/sessions/sessions.module';
import { Module } from '@nestjs/common';
import SharedController from './shared.controller';
import SharedService from './shared.service';

@Module({
  imports: [SessionsModule],
  controllers: [SharedController],
  providers: [SharedService],
})
export default class SharedModule {}
