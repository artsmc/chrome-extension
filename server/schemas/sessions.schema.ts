import * as Joi from 'joi';

import { Schema } from 'mongoose';

export let sessionsSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    token: { type: String },
    ip: { type: String },
    referrer: { type: String },
    browser: { type: String },
    system: { type: String },
    device: { type: String },
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'sessions',
  },
);

sessionsSchema.pre<any>('validate', function (next) {
  if (!this.created_at) {
    this.created_at = new Date().toISOString();
  }
  if (!this.is_active) {
    this.is_active = true;
  }
  if (!this.is_system) {
    this.is_system = false;
  }
  next();
});
