const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'medrecords.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    specialty TEXT,
    license_no TEXT,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('male','female','other')),
    blood_type TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_history TEXT DEFAULT '[]',
    allergies TEXT DEFAULT '[]',
    current_medications TEXT DEFAULT '[]',
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#1A73E8',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(doctor_id, patient_id)
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sala_id INTEGER NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    visit_date TEXT NOT NULL,
    chief_complaint TEXT,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    prescriptions TEXT DEFAULT '[]',
    follow_up_date TEXT,
    is_draft INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
  CREATE INDEX IF NOT EXISTS idx_salas_doctor_id ON salas(doctor_id);
  CREATE INDEX IF NOT EXISTS idx_salas_patient_id ON salas(patient_id);
  CREATE INDEX IF NOT EXISTS idx_consultations_sala_id ON consultations(sala_id);
  CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
`);

module.exports = db;
