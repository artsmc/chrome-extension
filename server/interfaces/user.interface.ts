import { Document } from 'mongoose';
import { IRoles } from './roles.interface';

export interface IUsers extends Document {
  id?: string;
  username: string;
  email: string;
  country_name?: string;
  region_name?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  browser?: string;
  system?: string;
  device?: string;
  firstExp: boolean;
  roles?: IRoles| string;
  is_active?: boolean;
  is_system?: boolean;
  created_at?: string;
  ip?: string;
  password: string;
  loginCount: number;
  company_name: string;
    company_description: string;
    profile_image: string;
    pending_new_email: {
      pending: boolean;
      token: string;
      email: string;
    }| {};
}
