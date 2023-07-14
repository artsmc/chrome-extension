import { Document } from 'mongoose';

export interface IUsers extends Document {
  _id?: string;
  email: string;
  token?: string;
  reference?: string;
  user_id: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}

