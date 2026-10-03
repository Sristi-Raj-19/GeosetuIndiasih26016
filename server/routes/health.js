const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, getCredentials } = require('../config/db');

router.get('/', async (req, res) => {
  const configured = isConfigured();
  let supabaseStatus = 'disconnected';
  let latencyMs = 0;

  if (configured) {
    const start = Date.now();
    try {
      const sb = getSupabase();
      const { data, error } = await sb.from('users').select('id').limit(1);
      latencyMs = Date.now() - start;
      supabaseStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e) {
      supabaseStatus = `error: ${e.message}`;
    }
  }

  res.json({
    status: 'online',
    app: 'GeoSetu-India (भूसेतु-भारत)',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase (PostgreSQL 15+ & PostGIS 3+)',
      configured,
      status: supabaseStatus,
      latencyMs: configured ? latencyMs : null,
      credentials: getCredentials()
    }
  });
});

module.exports = router;
