import * as Tokgen from 'tokgen';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UtilController } from './util.controller';
import { jwtSecret } from './../_config/config';
import { userSchema } from '../schemas/user.schema';
import { UserModel } from '../models/user.model';

class UserController extends UtilController {
  public setPassword(user) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, (err, hash) => {
          // Store hash in your password DB.
          UserModel.findByIdAndUpdate (
            { _id: user.decode.user._id},
            {password: hash, firstExp: false},
            { new: true, useFindAndModify: false }, (error, result) => {
              if (error) {
                reject(error);
              }
              console.log(user, user.decode.user._id, result);
              resolve(result);
          });
      });
    });
  }
  public changeEmail(body) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate (
        { _id: body.user._id},
        {pending_new_email: {
          pending: true,
          token: jwt.sign(body.user, jwtSecret, {
            expiresIn: 300000, // time recorded in seconds
          }),
          key: this.token(),
          email: body.email
        }},
        { new: true, useFindAndModify: false }, (error: any, result: unknown) => {
          if (error) {
            reject(error);
          }
          resolve(result);
      });
    });
  }
  public updateUser(body) {
    console.log(body);
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate (
        { _id: body.decode.user._id},
        body,
        { new: true, useFindAndModify: false }, (error: any, result: unknown) => {
          if (error) {
            reject(error);
          }
          resolve(result);
      });
    });
  }
  public updateUserEmail(body) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate (
        { _id: body.decode.user._id},
        {
          pending_new_email: {pending: false},
          email: body.decode.user.pending_new_email.email
        },
        { new: true, useFindAndModify: false }, (error: any, result: unknown) => {
          if (error) {
            reject(error);
          }
          resolve(result);
      });
    });
  }
  public emailStatus(user) {
    const userStatus = user.pending === true ? 'IN  PROGRESS' : 'COMPLETE';
    return userStatus;
  }
}

export const userController = new UserController();
