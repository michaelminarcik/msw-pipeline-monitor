const express = require('express');
const router = express.Router();
const datasetService = require('../services/datasetService');
const { validateDataset } = require('../validators/datasetValidators');

// POST /api/datasets
router.post('/', async (req, res, next) => {
  try {
    const data = validateDataset(req.body);
    const created = await datasetService.createDataset(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/datasets
router.get('/', async (req, res, next) => {
  try {
    const datasets = await datasetService.getAllDatasets();
    res.json(datasets);
  } catch (err) {
    next(err);
  }
});

// GET /api/datasets/:id
router.get('/:id', async (req, res, next) => {
  try {
    const dataset = await datasetService.getDatasetById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
