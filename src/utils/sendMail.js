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

  try {
    const result = await transporter.sendMail(options);
    console.log('✅ Email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ EMAIL ERROR:', error); // <-- ТУТ буде реальна причина!
    throw new Error('Failed to send the email, please try again later.');
  }
};
