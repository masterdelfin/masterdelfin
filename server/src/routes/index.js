const { Router } = require('express');
const authRoutes = require('./auth.routes');
const doctorsRoutes = require('./doctors.routes');
const patientsRoutes = require('./patients.routes');
const salasRoutes = require('./salas.routes');
const consultationsRoutes = require('./consultations.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctors', doctorsRoutes);
router.use('/patients', patientsRoutes);
router.use('/salas', salasRoutes);

// Consultations are nested under salas: /api/salas/:salaId/consultations
router.use('/salas/:salaId/consultations', consultationsRoutes);

module.exports = router;
