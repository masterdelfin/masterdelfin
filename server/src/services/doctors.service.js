const bcrypt = require('bcryptjs');
const db = require('../config/database');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

function getById(id) {
  const doctor = db
    .prepare('SELECT id, email, full_name, specialty, license_no, phone, created_at, updated_at FROM doctors WHERE id = ?')
    .get(id);

  if (!doctor) {
    throw new ApiError(404, 'Doctor not found', 'DOCTOR_NOT_FOUND');
  }

  return doctor;
}

function update(id, data) {
  const allowed = ['full_name', 'specialty', 'license_no', 'phone', 'email'];
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'email' ? data[key].toLowerCase().trim() : data[key]);
    }
  }

  if (fields.length === 0) {
    throw new ApiError(400, 'No valid fields provided for update', 'NO_FIELDS');
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  const stmt = db.prepare(`UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getById(id);
}

async function changePassword(id, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'currentPassword and newPassword are required', 'VALIDATION_ERROR');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters', 'WEAK_PASSWORD');
  }

  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(id);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found', 'DOCTOR_NOT_FOUND');
  }

  const match = await bcrypt.compare(currentPassword, doctor.password);
  if (!match) {
    throw new ApiError(401, 'Current password is incorrect', 'WRONG_PASSWORD');
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  db.prepare("UPDATE doctors SET password = ?, updated_at = datetime('now') WHERE id = ?").run(hashed, id);

  return { message: 'Password updated successfully' };
}

module.exports = { getById, update, changePassword };
