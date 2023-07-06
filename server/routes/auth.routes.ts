import * as Boom from 'boom';

import { Request, Response, Router } from 'express';
import { authController } from './../controllers/auth.controller';
import { middlewareController } from '../controllers/middlware.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});


export const AuthRouter: Router = router;
