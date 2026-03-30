const ApiError = require('../utils/ApiError');

/**
 * validate(fields) – middleware factory.
 * Pass an array of field names that are required in req.body.
 * Returns 400 ApiError listing the missing fields.
 *
 * Usage:
 *   router.post('/login', validate(['email', 'password']), handler)
 */
const validate = (requiredFields) => (req, res, next) => {
  const missing = requiredFields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
  );

  if (missing.length > 0) {
    return next(
      new ApiError(400, `Missing required fields: ${missing.join(', ')}`, 'VALIDATION_ERROR')
    );
  }

  next();
};

module.exports = validate;
