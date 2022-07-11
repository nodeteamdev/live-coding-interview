import { Schema } from 'mongoose';
import sessionsConstants from '../sessions.constants';

const SessionsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  timestamps: true,
  collection: sessionsConstants.models.sessions,
});

export default SessionsSchema;
