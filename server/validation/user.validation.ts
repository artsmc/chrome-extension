import * as Joi from 'joi';

export const userValidationSchema = Joi.object({
    username: Joi.string().optional(),
    profile_image: Joi.string().base64().optional(),
    company_name: Joi.string().allow('').optional(),
    company_description: Joi.string().allow('').optional(),
});
export const userEmailValidationSchema = Joi.object({
    email: Joi.string().email().required(),
});
