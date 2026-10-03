const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

// GET /api/parcels
router.get('/', async (req, res) => {
  try {
    const { district, status, project_id, owner_id } = req.query;

    if (isConfigured()) {
      const sb = getSupabase();
      let query = sb.from('parcels').select('*, owners(full_name, phone, aadhaar_masked), projects(name, type)');
      if (district) query = query.eq('district', district);
      if (status) query = query.eq('status', status);
      if (project_id) query = query.eq('project_id', project_id);
      if (owner_id) query = query.eq('owner_id', owner_id);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }

    // Fallback to memoryStore
    let result = [...memoryStore.parcels];
    if (district) result = result.filter(p => p.district === district);
    if (status) result = result.filter(p => p.status === status);
    if (project_id) result = result.filter(p => p.project_id === project_id);
    if (owner_id) result = result.filter(p => p.owner_id === owner_id);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/parcels/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured()) {
      const sb = getSupabase();
      const { data, error } = await sb
        .from('parcels')
        .select('*, owners(*), projects(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return res.json(data);
      }
    }

    const item = memoryStore.parcels.find(p => p.id === id);
    if (!item) return res.status(404).json({ error: 'Parcel not found' });

    const owner = memoryStore.owners.find(o => o.id === item.owner_id);
    const project = memoryStore.projects.find(pr => pr.id === item.project_id);

    return res.json({ ...item, owners: owner, projects: project });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/parcels
router.post('/', async (req, res) => {
  try {
    const newParcel = {
      id: req.body.id || `MP-${(req.body.district || 'BH').slice(0,2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      survey_number: req.body.survey_number || `${Math.floor(10 + Math.random() * 90)}/${Math.floor(1 + Math.random() * 5)}`,
      district: req.body.district || 'Bhopal',
      tehsil: req.body.tehsil || 'Huzur',
      village: req.body.village || 'Demo Village',
      area_acres: parseFloat(req.body.area_acres) || 2.50,
      land_type: req.body.land_type || 'Agricultural (Irrigated)',
      owner_id: req.body.owner_id || 'OWN-001',
      project_id: req.body.project_id || null,
      circle_rate_per_acre_inr: parseFloat(req.body.circle_rate_per_acre_inr) || 2500000.00,
      status: req.body.status || 'Available',
      document_status: req.body.document_status || 'Pending',
      lat: parseFloat(req.body.lat) || 23.2599,
      lng: parseFloat(req.body.lng) || 77.4126,
      polygon_json: req.body.polygon_json || null
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('parcels').insert([newParcel]);
    }

    memoryStore.parcels.unshift(newParcel);

    return res.status(201).json(newParcel);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/parcels/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('parcels').update(updates).eq('id', id);
    }

    const idx = memoryStore.parcels.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryStore.parcels[idx] = { ...memoryStore.parcels[idx], ...updates };
      return res.json(memoryStore.parcels[idx]);
    }

    return res.status(404).json({ error: 'Parcel not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
