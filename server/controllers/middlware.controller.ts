import { UserModel } from './../models/user.model';
import * as Boom from 'boom';
import * as Tokgen from 'tokgen';
import * as ipRegex from 'ip-regex';
import * as jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { passwordVerify, registerValidationSchema } from './../validation/auth.validation';

import { UtilController } from './util.controller';
import { jwtSecret } from '../_config/config';
import { userValidationSchema } from '../validation/user.validation';

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

  updateUserValidation(req: Request, res: Response, next: () => void) {
    const requestData = { ...req.body };
    const validation = userValidationSchema.validate(requestData);
    if (validation.error) {
      return res
        .status(400)
        .send(Boom.badRequest('invalid query', validation.error.details));
    } else {
      next();
    }
  }
  validTranscript(req: Request, res: Response, next: () => void) {
    const id = req.params.id;
    const user = req.body.decode.user._id;
    // @ts-ignore
    TranscriptModel.findOne({_id: id, user}, {lean: true, speakerSort: 1}).then(transcript => {
      req.body.transcript = transcript;
      next();
    }).catch(err => {
      res.status(401).send(Boom.unauthorized('no transcript found', null));
    });
  }
  isValidEmail(req: Request, res: Response, next: () => void) {
    const validUser = super.getUserByEmail(req.body.email);
    validUser.then(user => {
      if (user !== null) {
        req.body.user = user;
        next();
      } else {
        res.status(401).send(Boom.unauthorized('no user found', null));
      }
    }).catch(err => {
      res.status(401).send(Boom.unauthorized('no user found', null));
    });
  }
  isValidUserId(req: Request, res: Response, next: () => void) {
    const validUser = super.getUserById(req.body.decode.user._id);
    validUser.then(user => {
      if (user !== null) {
        req.body.user = user;
        next();
      } else {
        res.status(401).send(Boom.unauthorized('no user found', null));
      }
    }).catch(err => {
      res.status(401).send(Boom.unauthorized('no user found', null));
    });
  }
  validPodcastToken(req: Request, res: Response, next: () => void) {
    const token = req.query.token || '';
    // @ts-ignore
    PodcastModel.findOne({token}, {lean: true, listennotes_id: 1, token: 1, user: 1}, (err: any, result: any) => {
      if (err || result == null) {
        return res.status(400).send(Boom.badRequest('invalid query', { auth: false, err: 'Token Not Found' }));
      }
      req.body.podcastData = result;
      next();
    }).catch(err => {
      console.log(err);
    });
  }
  newFormAudioData(req: Request, res: Response, next: () => void) {
    const audioToken = new Tokgen({ chars: '0-9a-f', length: 12 });
    req.query.podcast = {...req.body.podcastData, ...{audioToken: audioToken.generate()}};
    next();
  }
  userValidation(req: Request, res: Response, next: () => void) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const requestData = { ...req.body, ...req['json'] };
    const validation = registerValidationSchema.validateAsync(requestData);
    console.log('NEW REQUEST TO SIGN UP: USER VALIDATION', {
      ...requestData,
      ...{ ip },
    });
    validation
      .then((result) => {
        next();
      })
      .catch((err) => {
        console.log(err.details);
        return res
          .status(400)
          .send(Boom.badRequest('invalid query', err.details));
      });
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
  validPassword(req: Request, res: Response, next: () => void) {
    const isVerified: boolean|any = passwordVerify.validate(req.body.password, { list: true });
    if (!isVerified || isVerified.length > 1) {
      return res.status(403).send(Boom.badRequest('invalid password', { passwordError: isVerified}));
    }
    next();
  }
  verifyEmailRequest(req: Request, res: Response, next: () => void) {
    const user = super.findEmailChangeByKey(req.params.key);
    user.then(data => {
      // @ts-ignore
      if (data.err || data.user === null) {
        return res
        .status(400)
        // @ts-ignore
        .send(Boom.badRequest('Request no longer valid', data.err));
      } else {
        req.body.decode = data;
        next();
      }
    })
    .catch((err) => {
      console.log(err.details);
    });
  }
  verifyEmailToken(req: Request, res: Response, next: () => void) {
    console.log(req.body);
    const tokenWrapper = req.body.decode.user.pending_new_email;
    jwt.verify(tokenWrapper.token, jwtSecret, (err, decoded) => {
      if (err) {
        UserModel.findByIdAndUpdate({_id: req.body.decode.user._id},
          {pending_new_email: {pending: false}},
          { new: true, useFindAndModify: false }, (error, user) => {
            if (error) {
              console.log(error);
            }
            req.body.decode = user;
        });
        return res.status(403).send(Boom.badRequest('invalid query', { auth: false, jwtToken: 'Token Expired' }));
      } else {
        next();
      }
    });
  }
}

export const middlewareController = new MiddlewareController();
