import { logger } from "../../../_config/logging";
import { UserModel } from "../models/user.model";


export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      logger.error(`POST /validate-email ${JSON.stringify(req.headers)} \n ${JSON.stringify('Email is required')}`);
      return res.status(400).json({ msg: 'Email is required' });
    }
    // check if email is in the UserModel
    UserModel.findOne({ email: email.toLowerCase() }).then(user => {
        if (user) {
          logger.error(`POST /validate-email ${JSON.stringify(req.headers)} \n ${JSON.stringify('Email already exists')}`);
          return res.status(400).json({ msg: 'Email already exists' });
        }
        next();
    });
}