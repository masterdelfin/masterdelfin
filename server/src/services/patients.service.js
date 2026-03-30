const db = require('../config/database');
const ApiError = require('../utils/ApiError');

const JSON_FIELDS = ['medical_history', 'allergies', 'current_medications'];

function parseJsonFields(patient) {
  if (!patient) return patient;
  const parsed = { ...patient };
  for (const field of JSON_FIELDS) {
    try {
      parsed[field] = JSON.parse(parsed[field] || '[]');
    } catch {
      parsed[field] = [];
    }
  }
  return parsed;
}

function serializeJsonFields(data) {
  const serialized = { ...data };
  for (const field of JSON_FIELDS) {
    if (serialized[field] !== undefined) {
      serialized[field] = Array.isArray(serialized[field])
        ? JSON.stringify(serialized[field])
        : typeof serialized[field] === 'string'
        ? serialized[field]
        : JSON.stringify(serialized[field]);
    }
  }
  return serialized;
}

function list(doctorId, search) {
  let query = `
    SELECT id, doctor_id, first_name, last_name, date_of_birth, gender,
           blood_type, email, phone, address, emergency_contact_name,
           emergency_contact_phone, medical_history, allergies, current_medications,
           notes, created_at, updated_at
    FROM patients
    WHERE doctor_id = ?
  `;
  const params = [doctorId];

  if (search && search.trim()) {
    query += ` AND (first_name LIKE ? OR last_name LIKE ? OR (first_name || ' ' || last_name) LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY last_name ASC, first_name ASC';

  const rows = db.prepare(query).all(...params);
  return rows.map(parseJsonFields);
}

function create(doctorId, data) {
  const { first_name, last_name, date_of_birth } = data;
  if (!first_name || !last_name || !date_of_birth) {
    throw new ApiError(400, 'first_name, last_name, and date_of_birth are required', 'VALIDATION_ERROR');
  }

  const serialized = serializeJsonFields(data);

  const stmt = db.prepare(`
    INSERT INTO patients (
      doctor_id, first_name, last_name, date_of_birth, gender, blood_type,
      email, phone, address, emergency_contact_name, emergency_contact_phone,
      medical_history, allergies, current_medications, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    doctorId,
    first_name.trim(),
    last_name.trim(),
    date_of_birth,
    serialized.gender || null,
    serialized.blood_type || null,
    serialized.email || null,
    serialized.phone || null,
    serialized.address || null,
    serialized.emergency_contact_name || null,
    serialized.emergency_contact_phone || null,
    serialized.medical_history !== undefined ? serialized.medical_history : '[]',
    serialized.allergies !== undefined ? serialized.allergies : '[]',
    serialized.current_medications !== undefined ? serialized.current_medications : '[]',
    serialized.notes || null
  );

  return getById(result.lastInsertRowid, doctorId);
}

function getById(id, doctorId) {
  const patient = db
    .prepare('SELECT * FROM patients WHERE id = ? AND doctor_id = ?')
    .get(id, doctorId);

  if (!patient) {
    throw new ApiError(404, 'Patient not found', 'PATIENT_NOT_FOUND');
  }

  return parseJsonFields(patient);
}

function update(id, doctorId, data) {
  const existing = db
    .prepare('SELECT id FROM patients WHERE id = ? AND doctor_id = ?')
    .get(id, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Patient not found', 'PATIENT_NOT_FOUND');
  }

  const allowed = [
    'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_type',
    'email', 'phone', 'address', 'emergency_contact_name', 'emergency_contact_phone',
    'medical_history', 'allergies', 'current_medications', 'notes',
  ];

  const serialized = serializeJsonFields(data);
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (serialized[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(serialized[key]);
    }
  }

  if (fields.length === 0) {
    throw new ApiError(400, 'No valid fields provided for update', 'NO_FIELDS');
  }

  fields.push("updated_at = datetime('now')");
  values.push(id, doctorId);

  db.prepare(`UPDATE patients SET ${fields.join(', ')} WHERE id = ? AND doctor_id = ?`).run(...values);

  return getById(id, doctorId);
}

function deletePatient(id, doctorId) {
  const existing = db
    .prepare('SELECT id FROM patients WHERE id = ? AND doctor_id = ?')
    .get(id, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Patient not found', 'PATIENT_NOT_FOUND');
  }

  db.prepare('DELETE FROM patients WHERE id = ? AND doctor_id = ?').run(id, doctorId);
  return { message: 'Patient deleted successfully' };
}

module.exports = { list, create, getById, update, deletePatient };
