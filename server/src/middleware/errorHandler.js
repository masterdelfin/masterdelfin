const ApiError = require('../utils/ApiError');
const { NODE_ENV } = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code && { code: err.code }),
    });
  }

  // SQLite unique constraint violation
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || (err.message && err.message.includes('UNIQUE constraint failed'))) {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
      code: 'DUPLICATE_ENTRY',
    });
  }

  // Log unexpected errors in development
  if (NODE_ENV === 'development') {
    console.error('Unhandled error:', err);
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(NODE_ENV === 'development' && { detail: err.message }),
  });
};

module.exports = errorHandler;
