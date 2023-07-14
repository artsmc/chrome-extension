import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { middlewareController } from '../controllers/middlware.controller';
import { userController } from '../controllers/user/user.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.get('/my-account', middlewareController.isAuth, middlewareController.isValidUserId, (req: Request, res: Response) => {
  console.log(req.body.user);
  res.status(200).json(req.body.user);
});




export const UserRouter: Router = router;
