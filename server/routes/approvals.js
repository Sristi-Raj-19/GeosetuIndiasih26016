const express = require('express');
const router = express.Router();
const { memoryStore } = require('../config/db');

// GET /api/approvals
router.get('/', (req, res) => {
  const { case_id, status } = req.query;
  let items = [...memoryStore.approvals];
  if (case_id) items = items.filter(a => a.case_id === case_id);
  if (status) items = items.filter(a => a.status === status);
  res.json(items);
});

// POST /api/approvals
router.post('/', (req, res) => {
  const newApproval = {
    id: `APP-${String(memoryStore.approvals.length + 1).padStart(3, '0')}`,
    case_id: req.body.case_id || 'CASE-001',
    authority: req.body.authority || 'Competent Authority Land Acquisition (CALA)',
    type: req.body.type || 'Statutory Clearance / NOC',
    status: req.body.status || 'Approved',
    sanction_date: req.body.sanction_date || new Date().toISOString().slice(0, 10),
    file_number: req.body.file_number || `CALA/BHP/2026/${Math.floor(100 + Math.random() * 900)}`,
    remarks: req.body.remarks || 'Statutory clearance granted in compliance with RFCTLARR Act 2013.'
  };

  memoryStore.approvals.unshift(newApproval);
  res.status(201).json(newApproval);
});

module.exports = router;
