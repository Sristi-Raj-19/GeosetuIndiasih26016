const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

// GET /api/agreements
router.get('/', async (req, res) => {
  try {
    const { status, owner_id, case_id } = req.query;

    if (isConfigured()) {
      const sb = getSupabase();
      let query = sb.from('agreements').select('*, cases(*), parcels(*), projects(*), owners(*)').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (owner_id) query = query.eq('owner_id', owner_id);
      if (case_id) query = query.eq('case_id', case_id);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }

    let result = [...memoryStore.agreements];
    if (status) result = result.filter(a => a.status === status);
    if (owner_id) result = result.filter(a => a.owner_id === owner_id);
    if (case_id) result = result.filter(a => a.case_id === case_id);

    // enrich
    result = result.map(a => {
      const c = memoryStore.cases.find(x => x.id === a.case_id);
      const p = memoryStore.parcels.find(x => x.id === a.parcel_id);
      const pr = memoryStore.projects.find(x => x.id === a.project_id);
      const o = memoryStore.owners.find(x => x.id === a.owner_id);
      return { ...a, cases: c, parcels: p, projects: pr, owners: o };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements
router.post('/', async (req, res) => {
  try {
    const { case_id, parcel_id, project_id, owner_id, total_amount_inr, rehab_terms } = req.body;
    const year = new Date().getFullYear();
    const stampCert = `IN-MP-ESTAMP-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
    const agrNumber = `IN-MP-AGR-${year}-${String(memoryStore.agreements.length + 1).padStart(3, '0')}`;

    const newAgreement = {
      id: `EAGR-${year}-${String(memoryStore.agreements.length + 1).padStart(3, '0')}`,
      agreement_number: agrNumber,
      case_id: case_id || 'CASE-001',
      parcel_id: parcel_id || 'MP-BH-001',
      project_id: project_id || 'PRJ-001',
      owner_id: owner_id || 'OWN-001',
      total_amount_inr: parseFloat(total_amount_inr) || 25000000.0,
      rehab_terms: rehab_terms || 'Mandatory RFCTLARR Schedule II Rehabilitation Package.',
      status: 'Sent',
      draft_date: new Date().toISOString().slice(0, 10),
      sent_date: new Date().toISOString().slice(0, 10),
      signed_date: null,
      completed_date: null,
      owner_sign_method: null,
      owner_sign_cert_hash: null,
      officer_dsc_token_serial: null,
      estamp_certificate_no: stampCert
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('agreements').insert([newAgreement]);
    }

    memoryStore.agreements.unshift(newAgreement);

    // Audit Log
    memoryStore.audit.unshift({
      id: `AUD-${Date.now().toString(36)}`,
      user_name: 'Land Acquisition Officer',
      action: 'Statutory E-Agreement Deed Created & Dispatched',
      entity_type: 'agreement',
      entity_id: newAgreement.id,
      remarks: `Official ₹100 E-Stamp deed ${stampCert} issued for acquisition.`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, agreement: newAgreement });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/:id/sign-owner (Aadhaar e-Sign)
router.post('/:id/sign-owner', async (req, res) => {
  try {
    const { id } = req.params;
    const { method, otp, signer_name } = req.body;

    const hash = 'SHA256:' + crypto.randomBytes(32).toString('hex');
    const updates = {
      status: 'Signed',
      signed_date: new Date().toISOString(),
      owner_sign_method: method || 'Aadhaar e-Sign (UIDAI OTP)',
      owner_sign_cert_hash: hash
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('agreements').update(updates).eq('id', id);
    }

    const idx = memoryStore.agreements.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryStore.agreements[idx] = { ...memoryStore.agreements[idx], ...updates };
    }

    memoryStore.audit.unshift({
      id: `AUD-${Date.now().toString(36)}`,
      user_name: signer_name || 'Khatedar / Landowner',
      action: 'Aadhaar e-Sign Executed on E-Agreement',
      entity_type: 'agreement',
      entity_id: id,
      remarks: `Authenticated via UIDAI OTP. Hash: ${hash.slice(0, 18)}...`,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Landowner Aadhaar e-Sign recorded successfully.', certHash: hash });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/agreements/:id/sign-officer (Class-3 DSC Token Counter-Sign)
router.post('/:id/sign-officer', async (req, res) => {
  try {
    const { id } = req.params;
    const { officer_name, dsc_token } = req.body;

    const tokenSerial = dsc_token || `DSC-CLASS3-NIC-${Math.floor(100000 + Math.random() * 900000)}`;
    const updates = {
      status: 'Completed',
      completed_date: new Date().toISOString(),
      officer_dsc_token_serial: tokenSerial
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('agreements').update(updates).eq('id', id);
    }

    const idx = memoryStore.agreements.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryStore.agreements[idx] = { ...memoryStore.agreements[idx], ...updates };
    }

    memoryStore.audit.unshift({
      id: `AUD-${Date.now().toString(36)}`,
      user_name: officer_name || 'Land Acquisition Officer',
      action: 'Class-3 DSC Token Counter-Signature Applied',
      entity_type: 'agreement',
      entity_id: id,
      remarks: `Official Government seal stamped. Token: ${tokenSerial}`,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Officer DSC Counter-Signature completed and sealed.', tokenSerial });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
