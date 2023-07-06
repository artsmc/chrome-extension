import * as bcrypt from 'bcrypt';
import * as ipRegex from 'ip-regex';
import * as jwt from 'jsonwebtoken';
import * as parser from 'ua-parser-js';

import { IAuthToken } from './../interfaces/authToken.interface';
import { UserModel } from './../models/user.model';
import { UtilController } from './util.controller';
import { jwtSecret } from './../_config/config';
class AuthController  extends UtilController {
  constructor() {
    super();
  }
  public login (user) {
    return new Promise((resolve, reject) => {
      console.log(user);
      bcrypt.compare(user.password, user.user.password, (err, result) => {
        if (err) {
          reject(err);
        }
        this.changeFirstExpStatus(user);
        resolve(result);
      });
    });
  }
  public issueToken(userBody) {
    const userObject = this.getUserByEmail(userBody['username']);
    userObject.then(user => {
      const newObject = bcrypt.compareSync(userBody['password'], userObject['password']) !== true ? null : user;
      if (newObject) {
        return jwt.sign({newObject}, jwtSecret, {
        expiresIn: 86400, // time recorded in seconds
      });
      }
    }).catch(err => {
      return { message: 'unable to find user.' };
    });
  }
  private changeFirstExpStatus(user) {
    UserModel.findOneAndUpdate(
      { _id: user.user._id},
      {firstExp: false},
      { new: true, useFindAndModify: false }, (error, result) => {
        if (error) {
          console.log(error);
        }
        console.log(result);
      }
    ).catch(err => {
      console.log(err);
    });
  }
}

export const authController = new AuthController();
