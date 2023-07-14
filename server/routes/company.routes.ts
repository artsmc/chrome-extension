import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { middlewareController } from '../controllers/middlware.controller';
import { userController } from '../controllers/user/user.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.post('/add-company', (req: Request, res: Response) => {
  console.log(req.body.company);
  res.status(200).json(req.body.comapny);
});




export const CompanyRouter: Router = router;
