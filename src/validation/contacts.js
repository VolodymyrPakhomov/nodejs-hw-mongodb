import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    // Можно добавить regex для более строгой валидации номера телефона
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().allow(null).messages({
    // allow(null) для полей, которые могут быть null
    'string.base': 'Email should be a string',
    'string.email': 'Email should be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string().valid('personal', 'work').required().messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be either "personal" or "work"',
    'any.required': 'Contact type is required',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
  email: Joi.string().email().allow(null).messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email should be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),
  contactType: Joi.string().valid('personal', 'work').messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be either "personal" or "work"',
  }),
})
  .min(1)
  .messages({
    // .min(1) чтобы убедиться, что хотя бы одно поле для обновления присутствует
    'object.min': 'At least one field must be provided for update',
  });
