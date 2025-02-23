import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6), 
});
export const changPassSchema = Joi.object({
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});