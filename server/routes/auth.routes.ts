
import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import { magicLogin } from '../controllers/auth.controller';
import { jwtSecret } from '../_config/config';
const router: Router = Router();
export const passAuth = (req: Request, res: Response, next: () => void) => {
    if (req.headers['authorization']) {
      const jwtToken = (req.headers.authorization).split(' ');
      jwt.verify(jwtToken[1], jwtSecret, (err, decoded) => {
        if (err) {
        } else {
          req.body.authorization = req.headers.authorization;
          next();
        }
      });
    } else {
      res.status(500).send(Boom.badRequest('invalid query', {
        auth: false,
        jwtToken: 'you need proper token to authorize.'
      }));
    }
  }
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json(req.headers);
});
router.post("/magiclogin", magicLogin.send);

router.get('/callback', (req: Request, res: Response, next) => {
  passport.authenticate('magiclogin', (err, user)=>{
  if (err) { return next(err) }
    if (!user) { return res.status(401).json({err:'no valid user'}) }
    const jwtToken = jwt.sign({
      user
    }, jwtSecret, {
      expiresIn: 1209600000, //14 days
    });
    user.jwt = jwtToken;
    const returnUser = {...user._doc, jwt: jwtToken}
    res.status(200).json(returnUser);
  })(req, res);
});
router.get('/test-auth', passAuth, (req: Request, res: Response) => {
  res.status(200).json({auth: true, jwtToken: req.body.authorization});
});
// @ts-ignore

export const AuthRouter: Router = router;
