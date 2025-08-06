import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';
import { SMTP } from '../constants/index.js';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: getEnvVariable(SMTP.SMTP_HOST),
    port: Number(getEnvVariable(SMTP.SMTP_PORT)),
    secure: false,
    auth: {
      user: getEnvVariable(SMTP.SMTP_USER),
      pass: getEnvVariable(SMTP.SMTP_PASSWORD),
    },
  });

  // Використовуємо хардкод email як from
  options.from = 'vmudrij0508@gmail.com';
  
  return await transporter.sendMail(options);
};
