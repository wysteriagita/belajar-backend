import jwt from 'jsonwebtoken';
import appError from '../utils/appError.utils.js';

const authenticate = (req, res, next) => {
  const authorization = req.get('authorization');
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!token) {
    return next(new appError(401, 'Authentication token is required'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new appError(500, 'JWT_SECRET is not configured'));
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });

    if (
      typeof payload !== 'object' ||
      payload === null ||
      Array.isArray(payload) ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0 ||
      typeof payload.role !== 'string'
    ) {
      return next(new appError(401, 'Invalid authentication token'));
    }

    req.user = payload;
    return next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new appError(401, 'Invalid or expired authentication token'));
    }

    return next(err);
  }
};

export default authenticate;
