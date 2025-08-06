import crypto from 'node:crypto';

import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

import createHttpError from 'http-errors';

import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';

import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError.Unauthorized('Incorrect email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError.Unauthorized('Incorrect email or password');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw createHttpError.Unauthorized(' Refresh token invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token expired');
  }
  await Session.deleteOne({ _id: session._id });
  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

// Скидання пароля

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVariable('JWT_SECRET'),
    { expiresIn: '5m' },
  );
  console.log('Reset token for testing:', resetToken);
  
  // Простий HTML без шаблону
  const html = `<p>Hello ${user.name}!</p><p>Click <a href="${getEnvVariable('APP_DOMAIN')}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`;

  // Закоментовано для тестування
  // await sendEmail({
  //   from: getEnvVariable(SMTP.SMTP_FROM),
  //   to: email,
  //   subject: 'Password Reset Request',
  //   html,
  // });
  
  console.log('Email would be sent to:', email);
  console.log('Reset link:', `${getEnvVariable('APP_DOMAIN')}/reset-password?token=${resetToken}`);
};
/////////////////
export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVariable('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 5);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
