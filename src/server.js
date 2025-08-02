import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authenticate from './middlewares/authenticate.js';

import authRouters from './routers/auth.js';

import cookieParser from 'cookie-parser';

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.use(express.json());
  app.use(cookieParser());

  app.use('/auth', authRouters);

  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });

  app.use('/contacts', authenticate, contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
