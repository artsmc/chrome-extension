import { Document } from 'mongoose';

export interface IResponse extends Document {
  _id?: string;
  tone:string;
  emojiPermission:boolean;
  emojiAllowed:string;
  wordLimit: number;
  customerInquery: string;
  responseCreated: string;
  feelingsAllowed: boolean;
  responseFinalized: string;
  agentContext: string;
  user: string;
  created: string;
  is_active?: boolean;
  is_system?: boolean;
}