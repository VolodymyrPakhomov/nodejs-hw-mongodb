import express from 'express';

import {
  registerUserController,
  loginControler,
  logoutControler,
  refreshControler,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';

import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { User } from '../models/user.js';

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

// Скидання пароля
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

// Тимчасовий endpoint для перегляду користувачів
router.get('/users', async (req, res) => {
  const users = await User.find({}, { password: 0 });
  res.json({
    status: 200,
    message: 'Users list',
    data: users,
  });
});

export default router;
