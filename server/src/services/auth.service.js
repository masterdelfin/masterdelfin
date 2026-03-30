const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../config/env');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

function signToken(doctorId) {
  return jwt.sign({ sub: doctorId }, JWT_SECRET, { expiresIn: '24h' });
}

async function register({ email, password, full_name, specialty, license_no, phone }) {
  if (!email || !password || !full_name) {
    throw new ApiError(400, 'email, password, and full_name are required', 'VALIDATION_ERROR');
  }

  const existing = db.prepare('SELECT id FROM doctors WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    throw new ApiError(409, 'An account with that email already exists', 'EMAIL_TAKEN');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const stmt = db.prepare(`
    INSERT INTO doctors (email, password, full_name, specialty, license_no, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    email.toLowerCase().trim(),
    hashedPassword,
    full_name.trim(),
    specialty || null,
    license_no || null,
    phone || null
  );

  const doctor = db
    .prepare('SELECT id, email, full_name, specialty, license_no, phone, created_at FROM doctors WHERE id = ?')
    .get(result.lastInsertRowid);

  const token = signToken(doctor.id);
  return { token, doctor };
}

async function login(email, password) {
  if (!email || !password) {
    throw new ApiError(400, 'email and password are required', 'VALIDATION_ERROR');
  }

  const doctor = db
    .prepare('SELECT * FROM doctors WHERE email = ?')
    .get(email.toLowerCase().trim());

  if (!doctor) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, doctor.password);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const { password: _pw, ...doctorWithoutPassword } = doctor;
  const token = signToken(doctor.id);
  return { token, doctor: doctorWithoutPassword };
}

module.exports = { register, login };
