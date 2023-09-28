import Mailgun = require('mailgun-js');
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userCreateController } from "./user/user.create.controller";
import { UtilController } from './util.controller';
import { UserModel } from '../models/user.model';
import { emailController } from './email.controller';
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });
import { jwtSecret } from '../_config/config';
import { IUsers } from '../interfaces/user.interface';

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
              emailController.sendMessage('angel-new-user', user.email, 'angel-new-user', {});
              jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                  console.log({ err });
                  reject(err);
                }
                resolve({ ...user.toObject(), token });
              });
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
    public async loginUser(userData: {email: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email.toLowerCase() }).then((user: any) => {
          if (!user) {
            reject('User not found');
          }
          bcrypt.compare(userData.password, user.password).then((isMatch) => {
            if (isMatch) {
              jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                  console.log({ err });
                  reject(err);
                }
                resolve({ ...user.toObject(), token });
              });
            } else {
              reject('Password incorrect');
            }
          });
        });
      });
    }
    public async reissueToken(userData: {email: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email.toLowerCase() }).then((user: any) => {
          if (!user) {
            reject('User not found');
          }
          jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) {
              console.log({ err });
              reject(err);
            }
            resolve({ token });
          });
        });
      });
    }
    public async changePassword(userData: {decode:{user:IUsers}; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        console.log(userData)
        UserModel.findOne({ _id: userData.decode.user._id }).then((user: any) => {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              console.log({ err });
              reject(err);
            }
            bcrypt.hash(userData.password, salt, (error, hash) => {
              const { password } = userData;
              user.password = hash; 
              // Store hash in your password DB.
              user.save().then((user) => {
                emailController.sendMessage('angel-forgot-success', user.email, 'angel-forgot-success', {});
                jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                  if (err) {
                    console.log({ err });
                    reject(err);
                  }
                  resolve({ ...user.toObject(), token });
                });
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
      });
    }
    public async forgotPassword(data:{email: string, location:string}): Promise<{message:string}> {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.findOne({ email: data.email });
    
            if (!user) {
                reject('User not found');
                return;
            }
    
            // Generate a 6 digit reset number
            const resetNumber = Math.floor(100000 + Math.random() * 900000); 
    
            // Save the reset number and its expiry to the user model in DB for later verification
            user.passwordResetNumber = resetNumber;
            user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // reset number valid for 15 mins
            await user.save();
    
            try {
                emailController.sendMessage('angel-forgot-password', user.email, 'angel-forgot-password', {
                  'reset-number': `${resetNumber}`
                });
                resolve({ message: 'A 6-digit password reset number sent to email.' });
            } catch (err) {
                user.passwordResetNumber = undefined;
                user.passwordResetExpires = undefined;
                await user.save();
    
                reject('There was an error sending the email.');
            }
        });
    }
    // new method below
    public async verifyPasswordResetNumber(data:{email: string, resetNumber:number}): Promise<{token:string}> {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.findOne({ email: data.email });
    
            if (!user) {
                reject('User not found');
                return;
            }
    
            if (user.passwordResetNumber !== data.resetNumber) {
                reject('Invalid reset number');
                return;
            }
    
            if (user.passwordResetExpires < Date.now()) {
                reject('Reset number expired');
                return;
            }
            user.passwordResetNumber = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                  if (err) {
                    console.log({ err });
                    reject(err);
                  }
                  resolve({ ...user.toObject(), token });
                });
        });
    }
}
export const authController = new AuthController();