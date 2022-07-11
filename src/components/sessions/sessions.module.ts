import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PresetsModule from '@components/presets/presets.module';
import PresetsService from '@components/presets/presets.service';
import SessionsController from './sessions.controller';
import SessionsSchema from './schemas/sessions.schema';
import SessionsService from './sessions.service';
import sessionsConstants from './sessions.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: sessionsConstants.models.sessions,
      schema: SessionsSchema,
    }]),
    PresetsModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export default class SessionsModule {}
