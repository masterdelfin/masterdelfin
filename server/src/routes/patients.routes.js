const { Router } = require('express');
const {
  listPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patients.controller');
const auth = require('../middleware/auth');

const router = Router();

// All patient routes require authentication
router.use(auth);

// GET  /api/patients        – list all patients for the logged-in doctor
// POST /api/patients        – create a new patient
router.route('/').get(listPatients).post(createPatient);

// GET    /api/patients/:id  – get a single patient
// PUT    /api/patients/:id  – update a patient
// DELETE /api/patients/:id  – delete a patient
router.route('/:id').get(getPatient).put(updatePatient).delete(deletePatient);

module.exports = router;
