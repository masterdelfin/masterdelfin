const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, specialty, license_no, phone } = req.body;
  const result = await authService.register({ email, password, full_name, specialty, license_no, phone });
  res.status(201).json({
    success: true,
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { register, login };
