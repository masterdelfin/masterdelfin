const db = require('../config/database');
const ApiError = require('../utils/ApiError');

const PATIENT_JSON_FIELDS = ['medical_history', 'allergies', 'current_medications'];

function parsePatientJsonFields(patient) {
  if (!patient) return patient;
  const parsed = { ...patient };
  for (const field of PATIENT_JSON_FIELDS) {
    try {
      parsed[field] = JSON.parse(parsed[field] || '[]');
    } catch {
      parsed[field] = [];
    }
  }
  return parsed;
}

function list(doctorId) {
  const rows = db.prepare(`
    SELECT
      s.id,
      s.doctor_id,
      s.patient_id,
      s.name,
      s.color,
      s.is_active,
      s.created_at,
      s.updated_at,
      p.first_name AS patient_first_name,
      p.last_name  AS patient_last_name,
      p.date_of_birth AS patient_date_of_birth,
      p.gender AS patient_gender,
      (
        SELECT c.visit_date
        FROM consultations c
        WHERE c.sala_id = s.id
        ORDER BY c.visit_date DESC
        LIMIT 1
      ) AS last_consultation_date
    FROM salas s
    JOIN patients p ON p.id = s.patient_id
    WHERE s.doctor_id = ?
    ORDER BY s.updated_at DESC
  `).all(doctorId);

  return rows;
}

function create(doctorId, data) {
  const { patient_id, name, color } = data;

  if (!patient_id || !name) {
    throw new ApiError(400, 'patient_id and name are required', 'VALIDATION_ERROR');
  }

  // Verify patient belongs to this doctor
  const patient = db
    .prepare('SELECT id FROM patients WHERE id = ? AND doctor_id = ?')
    .get(patient_id, doctorId);

  if (!patient) {
    throw new ApiError(404, 'Patient not found', 'PATIENT_NOT_FOUND');
  }

  const stmt = db.prepare(`
    INSERT INTO salas (doctor_id, patient_id, name, color)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(
    doctorId,
    patient_id,
    name.trim(),
    color || '#1A73E8'
  );

  return getById(result.lastInsertRowid, doctorId);
}

function getById(id, doctorId) {
  const sala = db.prepare(`
    SELECT s.*, p.first_name, p.last_name, p.date_of_birth, p.gender, p.blood_type,
           p.email AS patient_email, p.phone AS patient_phone, p.address,
           p.emergency_contact_name, p.emergency_contact_phone,
           p.medical_history, p.allergies, p.current_medications, p.notes AS patient_notes
    FROM salas s
    JOIN patients p ON p.id = s.patient_id
    WHERE s.id = ? AND s.doctor_id = ?
  `).get(id, doctorId);

  if (!sala) {
    throw new ApiError(404, 'Sala not found', 'SALA_NOT_FOUND');
  }

  // Extract and parse patient data
  const {
    first_name, last_name, date_of_birth, gender, blood_type,
    patient_email, patient_phone, address,
    emergency_contact_name, emergency_contact_phone,
    medical_history, allergies, current_medications, patient_notes,
    ...salaFields
  } = sala;

  const patientData = parsePatientJsonFields({
    id: sala.patient_id,
    doctor_id: sala.doctor_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    blood_type,
    email: patient_email,
    phone: patient_phone,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_history,
    allergies,
    current_medications,
    notes: patient_notes,
  });

  return {
    ...salaFields,
    patient: patientData,
  };
}

function update(id, doctorId, data) {
  const existing = db
    .prepare('SELECT id FROM salas WHERE id = ? AND doctor_id = ?')
    .get(id, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Sala not found', 'SALA_NOT_FOUND');
  }

  const allowed = ['name', 'color', 'is_active'];
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    throw new ApiError(400, 'No valid fields provided for update', 'NO_FIELDS');
  }

  fields.push("updated_at = datetime('now')");
  values.push(id, doctorId);

  db.prepare(`UPDATE salas SET ${fields.join(', ')} WHERE id = ? AND doctor_id = ?`).run(...values);

  return getById(id, doctorId);
}

function deleteSala(id, doctorId) {
  const existing = db
    .prepare('SELECT id FROM salas WHERE id = ? AND doctor_id = ?')
    .get(id, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Sala not found', 'SALA_NOT_FOUND');
  }

  db.prepare('DELETE FROM salas WHERE id = ? AND doctor_id = ?').run(id, doctorId);
  return { message: 'Sala deleted successfully' };
}

module.exports = { list, create, getById, update, deleteSala };
