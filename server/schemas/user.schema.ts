import * as Joi from 'joi';

import { Schema } from 'mongoose';

export let userSchema: Schema = new Schema(
  {
    email: { type: String,lowercase: true, index: true, unique: true, required: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Companies',
    },
    roles: [{
      type: Schema.Types.ObjectId,
      ref: 'Roles',
    }],
    agent: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    full_name: { type: String },
    user_agent: { type: String },
    ip: { type: String },
    referrer: { type: String },
    password: { type: String, required: true },
    loginCount: {type: Number, default: 0},
    firstExp: { type : Boolean,  default: true},
    browser: { type: String },
    system: { type: String },
    device: { type: String },
    passwordResetNumber:{ type: Number },
    passwordResetExpires:{ type: Number },
    is_active: { type: Boolean },
    is_system: { type: Boolean },
    created_at: Date,
    modified_at: Date,
  },
  {
    versionKey: false,
    strict: true,
    collection: 'users',
  },
);

userSchema.pre<any>('validate', function (next) {
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
