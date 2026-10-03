const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

const WORKFLOW_NEXT = {
  IDENTIFIED: 'VERIFICATION',
  VERIFICATION: 'NOTICE_ISSUED',
  NOTICE_ISSUED: 'OBJECTION_REVIEW',
  OBJECTION_REVIEW: 'APPROVAL',
  APPROVAL: 'COMPENSATION_ASSESSED',
  COMPENSATION_ASSESSED: 'PAYMENT_PENDING',
  PAYMENT_PENDING: 'PAYMENT_COMPLETED',
  PAYMENT_COMPLETED: 'LAND_ACQUIRED',
  LAND_ACQUIRED: 'PROJECT_UTILIZATION',
  PROJECT_UTILIZATION: null
};

// GET /api/cases
router.get('/', async (req, res) => {
  try {
    const { stage, project_id } = req.query;

    if (isConfigured()) {
      const sb = getSupabase();
      let query = sb.from('cases').select('*, parcels(*, owners(*)), projects(*)').order('created_at', { ascending: false });
      if (stage) query = query.eq('current_stage', stage);
      if (project_id) query = query.eq('project_id', project_id);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }

    let result = [...memoryStore.cases];
    if (stage) result = result.filter(c => c.current_stage === stage);
    if (project_id) result = result.filter(c => c.project_id === project_id);

    // enrich with parcels & projects
    result = result.map(c => {
      const parcel = memoryStore.parcels.find(p => p.id === c.parcel_id);
      const owner = parcel ? memoryStore.owners.find(o => o.id === parcel.owner_id) : null;
      const project = memoryStore.projects.find(pr => pr.id === c.project_id);
      return {
        ...c,
        parcels: parcel ? { ...parcel, owners: owner } : null,
        projects: project
      };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cases/:id/advance
router.post('/:id/advance', async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, user_name } = req.body;

    let targetCase = null;
    let idx = -1;

    idx = memoryStore.cases.findIndex(c => c.id === id);
    if (idx !== -1) {
      targetCase = memoryStore.cases[idx];
    }

    if (!targetCase && isConfigured()) {
      const sb = getSupabase();
      const { data } = await sb.from('cases').select('*').eq('id', id).single();
      if (data) targetCase = data;
    }

    if (!targetCase) return res.status(404).json({ error: 'Case not found' });

    const currentStage = targetCase.current_stage;
    const nextStage = WORKFLOW_NEXT[currentStage];
    if (!nextStage) {
      return res.status(400).json({ error: 'Case has already reached the final statutory stage.' });
    }

    const updates = {
      current_stage: nextStage,
      officer_remarks: remarks || `Statutory stage advanced from ${currentStage} to ${nextStage}.`
    };

    const today = new Date().toISOString().slice(0, 10);
    if (nextStage === 'NOTICE_ISSUED') updates.sec_11_notice_date = today;
    if (nextStage === 'OBJECTION_REVIEW') updates.sec_15_objection_deadline = new Date(Date.now() + 60*24*3600*1000).toISOString().slice(0, 10);
    if (nextStage === 'APPROVAL') updates.sec_19_declaration_date = today;
    if (nextStage === 'COMPENSATION_ASSESSED') updates.sec_23_award_date = today;

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('cases').update(updates).eq('id', id);
    }

    if (idx !== -1) {
      memoryStore.cases[idx] = { ...memoryStore.cases[idx], ...updates };
    }

    // Add audit log
    memoryStore.audit.unshift({
      id: `AUD-${Date.now().toString(36)}`,
      user_name: user_name || 'Land Acquisition Officer',
      action: `Statutory Case Stage Advanced (${nextStage})`,
      entity_type: 'case',
      entity_id: id,
      remarks: updates.officer_remarks,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, case: targetCase, nextStage });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
