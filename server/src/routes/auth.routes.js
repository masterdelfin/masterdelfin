const { Router } = require('express');
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middleware/validate');

const router = Router();

// POST /api/auth/register
router.post('/register', validate(['email', 'password', 'full_name']), register);

// POST /api/auth/login
router.post('/login', validate(['email', 'password']), login);

module.exports = router;
