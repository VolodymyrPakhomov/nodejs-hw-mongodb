import express from 'express';

import {
  registerUserController,
  loginControler,
  logoutControler,
  refreshControler,
} from '../controllers/auth.js';

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

router.post('/logout', ctrlWrapper(logoutControler));

router.post('/refresh', ctrlWrapper(refreshControler));
export default router;
