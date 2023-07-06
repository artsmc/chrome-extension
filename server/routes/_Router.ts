import * as rateLimit from 'express-rate-limit';
import { Request, Response, Router } from 'express';
import { AuthRouter } from './auth.routes';
import { middlewareController } from '../controllers/middlware.controller';

// Assign router to the express.Router() instance
const router: Router = Router();
const APILimiter = rateLimit({
  windowMs: 60  * 1000, // 1 min
  max: 100,
  message:
    'Too many request created from this IP. Limit 100 request per minute.'
});
const APILimiterStrict = rateLimit({
  windowMs: 60  * 1000, // 1 min
  max: 20,
  message:
    'Too many request created from this IP. Limit 20 request per minute.'
});
const APILimiterFeirce = rateLimit({
  windowMs: 60  * 1000, // 1 min
  max: 5,
  message:
    'Too many request created from this IP. Limit 5 request per minute.'
});
// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});
router.use('/auth', APILimiter, AuthRouter);


export const ExpressRouter: Router = router;
