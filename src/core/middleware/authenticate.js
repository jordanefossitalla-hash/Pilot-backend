const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');
const AppError = require('../errors/app-error');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError('Authentication token is required.', 401));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.auth = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 401));
  }
}

module.exports = authenticate;
