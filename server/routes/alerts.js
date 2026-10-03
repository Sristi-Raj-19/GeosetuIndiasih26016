const express = require('express');
const router = express.Router();
const { memoryStore } = require('../config/db');

// GET /api/alerts
router.get('/', (req, res) => {
  res.json(memoryStore.alerts);
});

// POST /api/alerts
router.post('/', (req, res) => {
  const newAlert = {
    id: `ALT-${Date.now().toString(36)}`,
    severity: req.body.severity || 'info',
    title: req.body.title,
    description: req.body.description,
    timestamp: new Date().toISOString().slice(0, 10),
    entity_type: req.body.entity_type || 'system',
    entity_id: req.body.entity_id || '-'
  };
  memoryStore.alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

module.exports = router;
