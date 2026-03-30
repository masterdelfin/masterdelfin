const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided', 'NO_TOKEN'));
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.doctorId = payload.sub;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired', 'TOKEN_EXPIRED'));
    }
    return next(new ApiError(401, 'Invalid token', 'INVALID_TOKEN'));
  }
};

module.exports = auth;
