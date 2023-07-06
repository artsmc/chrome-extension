import * as Tokgen from 'tokgen';
import * as rp from 'request-promise';
import * as Parser from 'rss-parser';
import * as aws from 'aws-sdk';
import * as slug from 'slug';
import { IUsers } from './../interfaces/user.interface';
import { UserModel } from './../models/user.model';

const parser = new Parser();
export class UtilController {
  constructor() {}
  public token(size?: number): string {
    const generator = new Tokgen({ chars: '0-9a-f', length: size || 12 });
    return generator.generate();
  }
  async parseRSS(linkUrl: string) {
    const request = await parser.parseURL(linkUrl);
    const {items, feedUrl, paginationLinks, generator, link, language, copyright, lastBuildDate, ...feed} = request;
    return feed;
  }

  public getUserByEmail(email: string) {
    const user  = new Promise((resolve, reject) => {
        UserModel.findOne({email, is_active: true}).populate('roles').then((result) => {
          const userObj = result.toObject();
          const {ip, country_name, region_name, loginCount, pending_new_email, city, latitude, longitude,  ...returnUser} = userObj;
          resolve(returnUser);
        }).catch(err => {
          reject(err);
        });
      });
    return user;
  }
  public getUserById(_id: string) {
    const user  = new Promise((resolve, reject) => {
        UserModel.findOne({_id, is_active: true}).populate('roles').then((result) => {
          const userObj = result.toObject();
          const {ip, country_name, region_name, loginCount, city, latitude, longitude,  ...returnUser} = userObj;
          resolve(returnUser);
        }).catch(err => {
          reject(err);
        });
      });
    return user;
  }

  public renderUA(ua: any) {
    const returnUA = {};
    if (ua['browser']['name']) {
      returnUA[
        'browser'
      ] = `${ua['browser']['name']} Version: ${ua['browser']['version']}`;
    }
    if (ua['os']['name']) {
      returnUA[
        'system'
      ] = `${ua['os']['name']} Version: ${ua['os']['version']}`;
    }
    if (ua['device']['name']) {
      returnUA[
        'device'
      ] = `${ua['device']['vendor']} Model: ${ua['device']['model']} Type: ${ua['device']['type']}`;
    }
    return returnUA;
  }

  public async doAsyncWith(callback) {
    const cb = await callback();
    return cb;
  }
  public async getUser(userID: string) {
    const user  = await this.findUserByID(userID);
    return user;
  }

  public renameKey (object, key, newKey) {
    const clonedObj = this.clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  }
  public async findEmailChangeByKey(key) {
    return new Promise((resolve, reject) => {
        const findQuery =  {
          'pending_new_email.key': key,
          'pending_new_email.pending': true,
          is_active: true
        };
        UserModel.findOne(findQuery, (err, user) => {
            if (err) {
              console.log({err});
              reject({err});
            } else {
              resolve({user});
            }
        });
      });
  }
  private clone(obj) {
    return {...obj};
  }
  private async findUserByID(userID): Promise<IUsers> {
    return new Promise((resolve, reject) => {
        UserModel.findOne({_id: userID, is_active: true}, {lean: true, email: 1, roles: 1, firstExp: 1}).populate('roles').then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
  }
  private imageMIMEType(base64String): string {
    const strings = base64String.split(',');
    let extension = 'jpeg';
    switch (strings[0]) {
        case 'data:image/jpeg;base64':
            extension = 'jpeg';
            break;
        case 'data:image/png;base64':
            extension = 'png';
            break;
        default:
            extension = 'jpeg';
            break;
    }
    return extension;
  }
}
