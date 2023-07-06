import * as Joi from 'joi';

import passwordValidator = require('password-validator');

const passwordProtection = new passwordValidator();

 export let passwordVerify = passwordProtection
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['password', 'Passw0rd', 'Password123']); // Blacklist these values

export const registerValidationSchema = Joi.object({
  ip_address: Joi.string(),
  podcast: Joi.string().allow('').allow(null),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

export const loginValidationSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});
export const passwordValidationSchema = Joi.object({
  password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  repeat_password: Joi.ref('password'),
});

export const forgotPasswordValidationSchema = Joi.object({
  enteredEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
});
