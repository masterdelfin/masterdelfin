const db = require('../config/database');
const ApiError = require('../utils/ApiError');

function parsePrescriptions(row) {
  if (!row) return row;
  const parsed = { ...row };
  try {
    parsed.prescriptions = JSON.parse(parsed.prescriptions || '[]');
  } catch {
    parsed.prescriptions = [];
  }
  return parsed;
}

function serializePrescriptions(data) {
  const out = { ...data };
  if (out.prescriptions !== undefined) {
    out.prescriptions = Array.isArray(out.prescriptions)
      ? JSON.stringify(out.prescriptions)
      : typeof out.prescriptions === 'string'
      ? out.prescriptions
      : JSON.stringify(out.prescriptions);
  }
  return out;
}

function verifySalaOwnership(salaId, doctorId) {
  const sala = db
    .prepare('SELECT id, patient_id FROM salas WHERE id = ? AND doctor_id = ?')
    .get(salaId, doctorId);

  if (!sala) {
    throw new ApiError(404, 'Sala not found', 'SALA_NOT_FOUND');
  }

  return sala;
}

function list(salaId, doctorId) {
  verifySalaOwnership(salaId, doctorId);

  const rows = db.prepare(`
    SELECT * FROM consultations
    WHERE sala_id = ? AND doctor_id = ?
    ORDER BY visit_date DESC
  `).all(salaId, doctorId);

  return rows.map(parsePrescriptions);
}

function create(salaId, doctorId, data) {
  const sala = verifySalaOwnership(salaId, doctorId);

  const { visit_date } = data;
  if (!visit_date) {
    throw new ApiError(400, 'visit_date is required', 'VALIDATION_ERROR');
  }

  const serialized = serializePrescriptions(data);

  const stmt = db.prepare(`
    INSERT INTO consultations (
      sala_id, doctor_id, patient_id, visit_date,
      chief_complaint, subjective, objective, assessment,
      plan, prescriptions, follow_up_date, is_draft
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    salaId,
    doctorId,
    sala.patient_id,
    visit_date,
    serialized.chief_complaint || null,
    serialized.subjective || null,
    serialized.objective || null,
    serialized.assessment || null,
    serialized.plan || null,
    serialized.prescriptions !== undefined ? serialized.prescriptions : '[]',
    serialized.follow_up_date || null,
    serialized.is_draft !== undefined ? (serialized.is_draft ? 1 : 0) : 0
  );

  return getById(salaId, result.lastInsertRowid, doctorId);
}

function getById(salaId, consultationId, doctorId) {
  verifySalaOwnership(salaId, doctorId);

  const consultation = db
    .prepare('SELECT * FROM consultations WHERE id = ? AND sala_id = ? AND doctor_id = ?')
    .get(consultationId, salaId, doctorId);

  if (!consultation) {
    throw new ApiError(404, 'Consultation not found', 'CONSULTATION_NOT_FOUND');
  }

  return parsePrescriptions(consultation);
}

function update(salaId, id, doctorId, data) {
  verifySalaOwnership(salaId, doctorId);

  const existing = db
    .prepare('SELECT id FROM consultations WHERE id = ? AND sala_id = ? AND doctor_id = ?')
    .get(id, salaId, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Consultation not found', 'CONSULTATION_NOT_FOUND');
  }

  const allowed = [
    'visit_date', 'chief_complaint', 'subjective', 'objective',
    'assessment', 'plan', 'prescriptions', 'follow_up_date', 'is_draft',
  ];

  const serialized = serializePrescriptions(data);
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (serialized[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'is_draft') {
        values.push(serialized[key] ? 1 : 0);
      } else {
        values.push(serialized[key]);
      }
    }
  }

  if (fields.length === 0) {
    throw new ApiError(400, 'No valid fields provided for update', 'NO_FIELDS');
  }

  fields.push("updated_at = datetime('now')");
  values.push(id, salaId, doctorId);

  db.prepare(
    `UPDATE consultations SET ${fields.join(', ')} WHERE id = ? AND sala_id = ? AND doctor_id = ?`
  ).run(...values);

  return getById(salaId, id, doctorId);
}

function deleteConsultation(salaId, id, doctorId) {
  verifySalaOwnership(salaId, doctorId);

  const existing = db
    .prepare('SELECT id FROM consultations WHERE id = ? AND sala_id = ? AND doctor_id = ?')
    .get(id, salaId, doctorId);

  if (!existing) {
    throw new ApiError(404, 'Consultation not found', 'CONSULTATION_NOT_FOUND');
  }

  db.prepare('DELETE FROM consultations WHERE id = ? AND sala_id = ? AND doctor_id = ?').run(id, salaId, doctorId);
  return { message: 'Consultation deleted successfully' };
}

module.exports = { list, create, getById, update, deleteConsultation };
