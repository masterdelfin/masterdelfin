const { Router } = require('express');
const {
  listSalas,
  createSala,
  getSala,
  updateSala,
  deleteSala,
} = require('../controllers/salas.controller');
const auth = require('../middleware/auth');

const router = Router();

// All sala routes require authentication
router.use(auth);

// GET  /api/salas  – list all salas for the logged-in doctor
// POST /api/salas  – create a new sala
router.route('/').get(listSalas).post(createSala);

// GET    /api/salas/:id  – get a single sala (with patient + last consultation)
// PUT    /api/salas/:id  – update a sala
// DELETE /api/salas/:id  – delete a sala
router.route('/:id').get(getSala).put(updateSala).delete(deleteSala);

module.exports = router;
