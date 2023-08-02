import Mailgun = require('mailgun-js');
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userCreateController } from "./user/user.create.controller";
import { UtilController } from './util.controller';
import { UserModel } from '../models/user.model';
import { emailController } from './email.controller';
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });
import { jwtSecret } from '../_config/config';

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
        UserModel.findOne({ email: userData.email }).then((user: any) => {
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
        UserModel.findOne({ email: userData.email }).then((user: any) => {
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
    public async changePassword(userData: {user_id: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: userData.user_id }).then((user: any) => {
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
                emailController.sendMessage('PhoneAngel-Password', user.email, 'PhoneAngel-Password', {});
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
    public async forgotPassword(email: string, location:string): Promise<{message:string}> {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.findOne({ email });

            if (!user) {
                reject('User not found');
                return;
            }
            const resetToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '15m' });
            // Save the token to the user model in DB for later verification
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // token valid for 15 mins
            await user.save();
            // Email user the reset link containing the token
            const resetURL = `${location}/reset-password?token=${resetToken}`;
            try {
                await emailController.sendMessage('forgot-password', user.email, 'Reset Your Password', {
                    to: user.email,
                    subject: 'Password Reset Request',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process within the next 15 minutes:
                    ${resetURL}`
                });
                resolve({ message: 'Password reset link sent to email.' });
            } catch (err) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save();

                reject('There was an error sending the email.');
            }
        });
    }
}
export const authController = new AuthController();