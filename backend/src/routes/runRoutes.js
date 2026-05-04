const express = require('express');
const router = express.Router();
const runService = require('../services/runService');
const { validateRunQuery, validateRunUpdate } = require('../validators/runValidators');

// GET /api/runs
router.get('/', async (req, res, next) => {
  try {
    const filters = validateRunQuery(req.query);
    const runs = await runService.getAllRuns(filters);
    res.json(runs);
  } catch (err) {
    next(err);
  }
});

// GET /api/runs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const run = await runService.getRunById(req.params.id);
    if (!run) {
      return res.status(404).json({ error: 'JobRun not found' });
    }
    res.json(run);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/runs/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = validateRunUpdate(req.body);
    const updatedRun = await runService.updateRun(req.params.id, data);
    res.json(updatedRun);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
