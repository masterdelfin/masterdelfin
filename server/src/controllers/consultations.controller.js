const asyncHandler = require('../utils/asyncHandler');
const consultationsService = require('../services/consultations.service');

const listConsultations = asyncHandler(async (req, res) => {
  const salaId = Number(req.params.salaId);
  const consultations = consultationsService.list(salaId, req.doctorId);
  res.status(200).json({
    success: true,
    data: consultations,
  });
});

const createConsultation = asyncHandler(async (req, res) => {
  const salaId = Number(req.params.salaId);
  const consultation = consultationsService.create(salaId, req.doctorId, req.body);
  res.status(201).json({
    success: true,
    data: consultation,
  });
});

const getConsultation = asyncHandler(async (req, res) => {
  const salaId = Number(req.params.salaId);
  const consultationId = Number(req.params.id);
  const consultation = consultationsService.getById(salaId, consultationId, req.doctorId);
  res.status(200).json({
    success: true,
    data: consultation,
  });
});

const updateConsultation = asyncHandler(async (req, res) => {
  const salaId = Number(req.params.salaId);
  const consultationId = Number(req.params.id);
  const consultation = consultationsService.update(salaId, consultationId, req.doctorId, req.body);
  res.status(200).json({
    success: true,
    data: consultation,
  });
});

const deleteConsultation = asyncHandler(async (req, res) => {
  const salaId = Number(req.params.salaId);
  const consultationId = Number(req.params.id);
  const result = consultationsService.deleteConsultation(salaId, consultationId, req.doctorId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  listConsultations,
  createConsultation,
  getConsultation,
  updateConsultation,
  deleteConsultation,
};
