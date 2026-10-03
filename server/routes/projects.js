const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    if (isConfigured()) {
      const sb = getSupabase();
      const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }
    return res.json(memoryStore.projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isConfigured()) {
      const sb = getSupabase();
      const { data, error } = await sb.from('projects').select('*').eq('id', id).single();
      if (!error && data) return res.json(data);
    }
    const item = memoryStore.projects.find(p => p.id === id);
    if (!item) return res.status(404).json({ error: 'Project not found' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const newProject = {
      id: req.body.id || `PRJ-${String(memoryStore.projects.length + 1).padStart(3, '0')}`,
      name: req.body.name,
      type: req.body.type || 'National Highway Expansion (NHAI)',
      department: req.body.department || 'Ministry of Road Transport & Highways',
      location_district: req.body.location_district || 'Bhopal',
      state: req.body.state || 'Madhya Pradesh',
      required_area_acres: parseFloat(req.body.required_area_acres) || 100.0,
      acquired_area_acres: parseFloat(req.body.acquired_area_acres) || 0.0,
      utilized_area_acres: parseFloat(req.body.utilized_area_acres) || 0.0,
      estimated_budget_inr: parseFloat(req.body.estimated_budget_inr) || 100000000.0,
      start_date: req.body.start_date || new Date().toISOString().slice(0, 10),
      target_date: req.body.target_date || new Date(Date.now() + 365*24*3600*1000).toISOString().slice(0, 10),
      status: req.body.status || 'In Progress'
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('projects').insert([newProject]);
    }

    memoryStore.projects.unshift(newProject);
    return res.status(201).json(newProject);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
