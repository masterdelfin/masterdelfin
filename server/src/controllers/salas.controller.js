const asyncHandler = require('../utils/asyncHandler');
const salasService = require('../services/salas.service');

const listSalas = asyncHandler(async (req, res) => {
  const salas = salasService.list(req.doctorId);
  res.status(200).json({
    success: true,
    data: salas,
  });
});

const createSala = asyncHandler(async (req, res) => {
  const sala = salasService.create(req.doctorId, req.body);
  res.status(201).json({
    success: true,
    data: sala,
  });
});

const getSala = asyncHandler(async (req, res) => {
  const sala = salasService.getById(Number(req.params.id), req.doctorId);
  res.status(200).json({
    success: true,
    data: sala,
  });
});

const updateSala = asyncHandler(async (req, res) => {
  const sala = salasService.update(Number(req.params.id), req.doctorId, req.body);
  res.status(200).json({
    success: true,
    data: sala,
  });
});

const deleteSala = asyncHandler(async (req, res) => {
  const result = salasService.deleteSala(Number(req.params.id), req.doctorId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { listSalas, createSala, getSala, updateSala, deleteSala };
