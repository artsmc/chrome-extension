import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { IUsers } from './../interfaces/user.interface';
import { authController } from './../controllers/auth.controller';
import { middlewareController } from '../controllers/middlware.controller';
import { userController } from './../controllers/user.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.get('/my-account', middlewareController.isAuth, middlewareController.isValidUserId, (req: Request, res: Response) => {
  console.log(req.body.user);
  res.status(200).json(req.body.user);
});
router.patch('/update-profile', middlewareController.updateUserValidation, middlewareController.isAuth, (req: Request, res: Response) => {
  userController.updateUser(req.body)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});
router.patch('/update-email', middlewareController.isAuth, middlewareController.isValidEmail, (req: Request, res: Response) => {
  userController.changeEmail(req.body)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});
router.get('/verify-email/:key', middlewareController.verifyEmailRequest, middlewareController.verifyEmailToken, (req: Request, res: Response) => {
  userController.updateUserEmail(req.body)
  .then(() => {
    res.status(200).json('ok');
  })
  .catch(error => {
    console.error(error);
    res.status(400).json(error);
  });
});
router.get('/email-change-status', middlewareController.isAuth, middlewareController.isValidUserId,  (req: Request, res: Response) => {
  const status = userController.emailStatus(req.body.user);
  res.status(200).json(status);
});
router.post('/reset-password', middlewareController.isValidEmail, (req: Request, res: Response) => {
  authController.forgotPassword(req.body.user)
  .then(() => {
    res.status(200).json('ok');
  })
  .catch(error => {
    console.error(error);
    res.status(400).json(error);
  });
});
router.post('/set-password/verify', middlewareController.validtokenKey, middlewareController.isAuth, (req: Request, res: Response) => {
  authController.oneTimeCode(req.body.decode).then(token => {
    res.status(200).json(token);
  })
  .catch(error => {
    console.error(error);
    res.status(400).json(error);
  });
});
router.post('/set-password', middlewareController.isAuth, middlewareController.validPassword, (req: Request, res: Response) => {
  userController.setPassword(req.body).then(complete => {
    res.status(200).json(complete);
  })
  .catch(error => {
    console.error(error);
    res.status(400).json(error);
  });
});
export const UserRouter: Router = router;
