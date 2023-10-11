import { Document } from 'mongoose';

export interface ISessions extends Document {
  _id?: string;
  token?: string;
  user_id: string;
  ip: string;
  user_agent: string;
  referrer: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}

