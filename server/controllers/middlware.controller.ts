import * as Boom from 'boom';
import * as jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import { UtilController } from './util.controller';
import { jwtSecret } from '../_config/config';
import {companyController } from './company/company.controller';

class MiddlewareController extends UtilController  {
  constructor() {
    super();
  }
  testStatus(req: Request, res: Response, next: () => void) {
    console.log('TEST STATUS');
    next();
  }
  testRoute(req: Request, res: Response) {
    res.status(200).json('Complete');
  }
  isAuth (req: Request, res: Response, next: () => void) {
    if (req.headers['authorization'] ) {
        const jwtToken = (req.headers.authorization).split(' ');
        jwt.verify(jwtToken[1], jwtSecret, (err, decoded) => {
            if (err) {
              console.log(err);
                return res.status(403).send(Boom.badRequest('invalid query', { auth: false, jwtToken: 'Token Expired' }));
            } else {
              req.body.decode = decoded;
              next();
            }
        });
    } else {
        res.status(500).send(Boom.badRequest('invalid query', {
            auth: false, jwtToken: 'you need proper token to authorize.'
        }));
    }
  }
  isValidCompany (req: Request, res: Response, next: () => void) {
    companyController.findByName(req.body).then((company: any) => {
      console.log(company)
      !company? res.status(403).send(Boom.badRequest('invalid query', {
            auth: false, jwtToken: 'your company is not listed.'
        })) : () => {
          req.body.company = company;
          next();
        }
    }).catch((err: any) => {
        res.status(500).json(err);
    });
  }

}

export const middlewareController = new MiddlewareController();
