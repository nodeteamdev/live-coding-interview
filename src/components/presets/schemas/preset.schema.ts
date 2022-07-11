import { Schema, Types } from 'mongoose';
import presetsConstants from '../presets.constants';

const PresetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  ownerId: {
    type: Types.ObjectId,
    required: true,
  },
}, {
  versionKey: false,
  collection: presetsConstants.models.presets,
});

export default PresetSchema;
