import { requirePermission } from '../policies/authorization.policy.js';

const authorize = (permission) => (req, res, next) => {
  try {
    requirePermission(req.user, permission);
    return next();
  } catch (error) {
    return next(error);
  }
};

export default authorize;
