import Mailgun = require('mailgun-js');
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userCreateController } from "./user/user.create.controller";
import { UtilController } from './util.controller';
import { UserModel } from '../models/user.model';
import { emailController } from './email.controller';
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });


class AuthController extends UtilController {
    constructor() {
        super();
    }
    public async createUser(userData: {full_name?: string; email: string; ip?: any; user_agent?: any; referral?:string;password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log({ err });
            reject(err);
          }
          bcrypt.hash(userData.password, salt, (error, hash) => {
            const { password } = userData;
            userData.password = hash; 
            // Store hash in your password DB.
            const state = new UserModel(userData);
            state.save().then((user) => {
              emailController.sendMessage('PodTitle-ConfirmEmail', user.email, 'PodTitle-ConfirmEmail', {});
              resolve(user);
            }).catch(err => {
              console.log({ err });
              reject(err);
            });
            if (error) {
              console.log({ error });
              reject(err);
            }
          });
        });
      });
    }

}
export const authController = new AuthController();