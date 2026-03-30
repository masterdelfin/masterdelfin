const asyncHandler = require('../utils/asyncHandler');
const doctorsService = require('../services/doctors.service');

const getMe = asyncHandler(async (req, res) => {
  const doctor = doctorsService.getById(req.doctorId);
  res.status(200).json({
    success: true,
    data: doctor,
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const { full_name, specialty, license_no, phone, email } = req.body;
  const doctor = doctorsService.update(req.doctorId, { full_name, specialty, license_no, phone, email });
  res.status(200).json({
    success: true,
    data: doctor,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await doctorsService.changePassword(req.doctorId, currentPassword, newPassword);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { getMe, updateMe, changePassword };
