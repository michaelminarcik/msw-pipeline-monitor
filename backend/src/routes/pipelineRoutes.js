const express = require('express');
const router = express.Router();
const pipelineService = require('../services/pipelineService');
const { validatePipeline } = require('../validators/pipelineValidators');

// POST /api/pipelines
router.post('/', async (req, res, next) => {
  try {
    const data = validatePipeline(req.body);
    const created = await pipelineService.createPipeline(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/pipelines
router.get('/', async (req, res, next) => {
  try {
    const pipelines = await pipelineService.getAllPipelines();
    res.json(pipelines);
  } catch (err) {
    next(err);
  }
});

// GET /api/pipelines/:id
router.get('/:id', async (req, res, next) => {
  try {
    const pipeline = await pipelineService.getPipelineById(req.params.id);
    if (!pipeline) {
      return res.status(404).json({ error: 'Pipeline not found' });
    }
    res.json(pipeline);
  } catch (err) {
    next(err);
  }
});

// POST /api/pipelines/:id/run
router.post('/:id/run', async (req, res, next) => {
  try {
    const run = await pipelineService.runPipeline(req.params.id);
    res.status(201).json(run);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
