const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');
const { validateAlertQuery } = require('../validators/alertValidators');

// GET /api/alerts
router.get('/', async (req, res, next) => {
  try {
    const filters = validateAlertQuery(req.query);
    const alerts = await alertService.getAllAlerts(filters);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

// GET /api/alerts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const alert = await alertService.getAlertById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'AlertEvent not found' });
    }
    res.json(alert);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
