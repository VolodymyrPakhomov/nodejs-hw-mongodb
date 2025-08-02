import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }
  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.accessTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Access token expired');
  }

  const user = await User.findById(session.userId);

  if (user === null) {
    throw new createHttpError.Unauthorized('User not found');
  }
  req.user = { _id: user._id, name: user.name };
  next();
};

export default authenticate;
