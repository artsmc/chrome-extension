import { mongoSetup } from '../_config/config';
import { ISessions } from '../interfaces/session.interface';
import * as mongoose from 'mongoose';
import { sessionsSchema } from '../schemas/sessions.schema';

mongoose.connect(mongoSetup.MONGODB_CONNECTION, mongoSetup.options);
export const SessionModel: mongoose.Model<ISessions> = mongoose.model<ISessions>(
  'Sessions',
  sessionsSchema,
);
