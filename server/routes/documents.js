const express = require('express');
const router = express.Router();
const { memoryStore } = require('../config/db');

// GET /api/documents
router.get('/', (req, res) => {
  const { parcel_id, status } = req.query;
  let docs = [...memoryStore.documents];
  if (parcel_id) docs = docs.filter(d => d.parcel_id === parcel_id);
  if (status) docs = docs.filter(d => d.status === status);
  res.json(docs);
});

// POST /api/documents/:id/verify
router.post('/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const doc = memoryStore.documents.find(d => d.id === id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  doc.status = status || 'Verified';
  if (remarks) doc.remarks = remarks;

  memoryStore.audit.unshift({
    id: `AUD-${Date.now().toString(36)}`,
    user_name: 'Land Acquisition Officer',
    action: `Revenue Document Status Updated (${doc.status})`,
    entity_type: 'document',
    entity_id: id,
    remarks: doc.remarks,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, document: doc });
});

module.exports = router;
