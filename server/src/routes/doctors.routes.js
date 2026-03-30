const { Router } = require('express');
const { getMe, updateMe, changePassword } = require('../controllers/doctors.controller');
const auth = require('../middleware/auth');

const router = Router();

// All doctor routes require authentication
router.use(auth);

// GET /api/doctors/me
router.get('/me', getMe);

// PUT /api/doctors/me
router.put('/me', updateMe);

// PUT /api/doctors/me/password
router.put('/me/password', changePassword);

module.exports = router;
