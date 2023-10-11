import { Document } from 'mongoose';

export interface IUsers extends Document {
  _id?: string;
  email: string;
  agent: string;
  full_name: string;
  first_name: string;
  last_name: string;
  token?: string;
  company: string;
  user_id: string;
  ip: string;
  user_agent: string;
  referrer: string;
  password: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
  passwordResetNumber:number;
  passwordResetExpires:number;
}

