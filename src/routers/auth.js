import express from 'express';

import { registerUserController, loginControler } from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';

import { registerUserSchema, loginUserSchema } from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginControler),
);

export default router;
