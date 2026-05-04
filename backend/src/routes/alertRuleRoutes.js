const express = require('express');
const router = express.Router();
const alertRuleService = require('../services/alertRuleService');
const {
  validateAlertRule,
  validateAlertRuleUpdate,
  validateAlertRuleQuery,
} = require('../validators/alertRuleValidators');

// POST /api/alert-rules
router.post('/', async (req, res, next) => {
  try {
    const data = validateAlertRule(req.body);
    const created = await alertRuleService.createAlertRule(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/alert-rules
router.get('/', async (req, res, next) => {
  try {
    const filters = validateAlertRuleQuery(req.query);
    const alertRules = await alertRuleService.getAllAlertRules(filters);
    res.json(alertRules);
  } catch (err) {
    next(err);
  }
});

// GET /api/alert-rules/:id
router.get('/:id', async (req, res, next) => {
  try {
    const alertRule = await alertRuleService.getAlertRuleById(req.params.id);
    if (!alertRule) {
      return res.status(404).json({ error: 'AlertRule not found' });
    }
    res.json(alertRule);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/alert-rules/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const data = validateAlertRuleUpdate(req.body);
    const updated = await alertRuleService.updateAlertRule(req.params.id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/alert-rules/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await alertRuleService.deleteAlertRule(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
