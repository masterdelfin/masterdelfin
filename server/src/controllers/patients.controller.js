const asyncHandler = require('../utils/asyncHandler');
const patientsService = require('../services/patients.service');

const listPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const patients = patientsService.list(req.doctorId, search);
  res.status(200).json({
    success: true,
    data: patients,
  });
});

const createPatient = asyncHandler(async (req, res) => {
  const patient = patientsService.create(req.doctorId, req.body);
  res.status(201).json({
    success: true,
    data: patient,
  });
});

const getPatient = asyncHandler(async (req, res) => {
  const patient = patientsService.getById(Number(req.params.id), req.doctorId);
  res.status(200).json({
    success: true,
    data: patient,
  });
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = patientsService.update(Number(req.params.id), req.doctorId, req.body);
  res.status(200).json({
    success: true,
    data: patient,
  });
});

const deletePatient = asyncHandler(async (req, res) => {
  const result = patientsService.deletePatient(Number(req.params.id), req.doctorId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { listPatients, createPatient, getPatient, updatePatient, deletePatient };
