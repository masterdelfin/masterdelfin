const { Router } = require('express');
const {
  listConsultations,
  createConsultation,
  getConsultation,
  updateConsultation,
  deleteConsultation,
} = require('../controllers/consultations.controller');
const auth = require('../middleware/auth');

// mergeParams: true so we can access :salaId from the parent router
const router = Router({ mergeParams: true });

// All consultation routes require authentication
router.use(auth);

// GET  /api/salas/:salaId/consultations  – list all consultations for a sala
// POST /api/salas/:salaId/consultations  – create a new consultation
router.route('/').get(listConsultations).post(createConsultation);

// GET    /api/salas/:salaId/consultations/:id
// PUT    /api/salas/:salaId/consultations/:id
// DELETE /api/salas/:salaId/consultations/:id
router.route('/:id').get(getConsultation).put(updateConsultation).delete(deleteConsultation);

module.exports = router;
