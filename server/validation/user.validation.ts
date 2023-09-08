import * as Joi from 'joi';

export const registerValidationSchema = Joi.object({
  full_name: Joi.string().allow('').optional(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(errors => {
      errors.forEach(err => {
          switch (err.code) {
              case "any.empty":
                  err.message = "Value should contain at least 3 characters and maximum 30 characters";
                  break;
              default:
                  break;
          }
      });
      return new Error(errors.map(err => err.message).join('. '));
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});
