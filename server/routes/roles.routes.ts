import * as Boom from 'boom';

import { Request, Response, Router } from 'express';

import { middlewareController } from '../controllers/middlware.controller';

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.post('/add-role', (req: Request, res: Response) => {
  console.log(req.body.user);
  res.status(200).json(req.body.comapny);
});




export const RolesRouter: Router = router;
