import * as Tokgen from 'tokgen';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
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
            { new: true, useFindAndModify: false }).then(result => {
              console.log(user, user.decode.user._id, result);
              resolve(result);
          }).catch(error => {
            reject(error);
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
        { new: true, useFindAndModify: false }).then(result => {
              resolve(result);
          }).catch(error => {
            reject(error);
          });
    });
  }
  public updateUser(body) {
    console.log(body);
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate (
        { _id: body.decode.user._id},
        body,
        { new: true, useFindAndModify: false }).then(result => {
              resolve(result);
          }).catch(error => {
            reject(error);
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
        { new: true, useFindAndModify: false }).then(result => {
              resolve(result);
          }).catch(error => {
            reject(error);
          });
    });
  }
  public emailStatus(user) {
    const userStatus = user.pending === true ? 'IN  PROGRESS' : 'COMPLETE';
    return userStatus;
  }
}

export const userController = new UserController();
