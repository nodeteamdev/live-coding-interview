import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import presetsConstants from './presets.constants';
import PresetsService from './presets.service';
import PresetSchema from './schemas/preset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: presetsConstants.models.presets,
      schema: PresetSchema,
    }]),
  ],
  providers: [PresetsService],
  exports: [PresetsService],
})
export default class PresetsModule {}
