const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, getCredentials, updateCredentials, testConnection, memoryStore } = require('../config/db');
const seedData = require('../data/seedData');

// GET /api/config/status
router.get('/status', async (req, res) => {
  const configured = isConfigured();
  let dbStatus = 'Not Configured';
  let message = '';

  if (configured) {
    const test = await testConnection();
    dbStatus = test.ok ? 'Connected' : 'Connection Failed';
    message = test.message || test.error || test.warning || '';
  }

  res.json({
    configured,
    status: dbStatus,
    message,
    credentials: getCredentials(),
    recordCounts: {
      parcels: memoryStore.parcels.length,
      projects: memoryStore.projects.length,
      cases: memoryStore.cases.length,
      agreements: memoryStore.agreements.length
    }
  });
});

// POST /api/config/test
router.post('/test', async (req, res) => {
  const { url, key } = req.body;
  const result = await testConnection(url, key);
  res.json(result);
});

// POST /api/config/save
router.post('/save', async (req, res) => {
  const { url, key } = req.body;
  if (!url || !key) {
    return res.status(400).json({ ok: false, error: 'URL and Key are required.' });
  }

  const test = await testConnection(url, key);
  if (!test.ok && !test.warning) {
    return res.status(400).json({ ok: false, error: test.error || 'Failed to connect with provided Supabase credentials.' });
  }

  updateCredentials(url, key);

  res.json({
    ok: true,
    message: 'Supabase credentials saved successfully and backend client re-initialized.',
    warning: test.warning || null
  });
});

// POST /api/config/seed-supabase
router.post('/seed-supabase', async (req, res) => {
  if (!isConfigured()) {
    return res.status(400).json({ ok: false, error: 'Supabase is not configured. Please save credentials first.' });
  }

  try {
    const sb = getSupabase();

    // 1. Seed users
    for (const u of seedData.SEED_USERS) {
      await sb.from('users').upsert({
        id: u.id,
        username: u.username,
        email: u.email,
        password_hash: u.password,
        full_name: u.full_name,
        role: u.role,
        designation: u.designation,
        phone: u.phone
      }, { onConflict: 'id' });
    }

    // 2. Seed owners
    for (const o of seedData.SEED_OWNERS) {
      await sb.from('owners').upsert(o, { onConflict: 'id' });
    }

    // 3. Seed projects
    for (const p of seedData.SEED_PROJECTS) {
      await sb.from('projects').upsert(p, { onConflict: 'id' });
    }

    // 4. Seed parcels
    for (const pc of seedData.SEED_PARCELS) {
      await sb.from('parcels').upsert(pc, { onConflict: 'id' });
    }

    // 5. Seed cases
    for (const cs of seedData.SEED_CASES) {
      await sb.from('cases').upsert(cs, { onConflict: 'id' });
    }

    // 6. Seed agreements
    for (const ag of seedData.SEED_AGREEMENTS) {
      await sb.from('agreements').upsert(ag, { onConflict: 'id' });
    }

    return res.json({
      ok: true,
      message: 'Supabase database successfully seeded with official benchmark land records, cases, and e-agreements.'
    });
  } catch (err) {
    console.error('Supabase seeding error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
