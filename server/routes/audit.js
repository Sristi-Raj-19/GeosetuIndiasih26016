const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

// GET /api/audit
router.get('/', async (req, res) => {
  try {
    if (isConfigured()) {
      const sb = getSupabase();
      const { data, error } = await sb.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }
    return res.json(memoryStore.audit);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/audit
router.post('/', async (req, res) => {
  try {
    const newLog = {
      id: `AUD-${Date.now().toString(36)}`,
      user_name: req.body.user_name || 'System / Official',
      action: req.body.action || 'Administrative Event',
      entity_type: req.body.entity_type || 'system',
      entity_id: req.body.entity_id || '-',
      remarks: req.body.remarks || '',
      created_at: new Date().toISOString()
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('audit_logs').insert([{
        user_name: newLog.user_name,
        action: newLog.action,
        entity_type: newLog.entity_type,
        entity_id: newLog.entity_id,
        remarks: newLog.remarks
      }]);
    }

    memoryStore.audit.unshift(newLog);
    return res.status(201).json(newLog);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
