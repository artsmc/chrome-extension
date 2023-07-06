import { Document } from 'mongoose';
import { IPermissions } from './permissions.interface';

export interface IAuthToken extends Document {
  token: string;
  role: string;
  firstExp: boolean;
  permissions: IPermissions[];
}
