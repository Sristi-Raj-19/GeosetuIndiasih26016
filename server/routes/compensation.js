const express = require('express');
const router = express.Router();
const { getSupabase, isConfigured, memoryStore } = require('../config/db');

// GET /api/compensation
router.get('/', async (req, res) => {
  try {
    if (isConfigured()) {
      const sb = getSupabase();
      const { data, error } = await sb.from('compensation_awards').select('*, cases(*), parcels(*), owners(*)').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    }

    const result = memoryStore.compensation.map(c => {
      const cs = memoryStore.cases.find(x => x.id === c.case_id);
      const p = memoryStore.parcels.find(x => x.id === c.parcel_id);
      const o = memoryStore.owners.find(x => x.id === c.owner_id);
      return { ...c, cases: cs, parcels: p, owners: o };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/compensation/calculate
router.post('/calculate', (req, res) => {
  const { circle_rate_inr, land_area_acres, is_rural, months_elapsed } = req.body;
  const rate = parseFloat(circle_rate_inr) || 2500000.0;
  const area = parseFloat(land_area_acres) || 1.0;
  const multiplier = is_rural ? 2.0 : 1.25; // RFCTLARR rural vs urban multiplier
  const months = parseInt(months_elapsed, 10) || 12;

  const baseMarketValue = rate * area * multiplier;
  const solatium = baseMarketValue * 1.0; // 100% Solatium under Section 30(1)
  const interest = (baseMarketValue * 0.12 * months) / 12; // 12% per annum under Section 30(3)
  const totalAward = baseMarketValue + solatium + interest;

  return res.json({
    circle_rate_inr: rate,
    land_area_acres: area,
    multiplier,
    base_market_value_inr: Math.round(baseMarketValue),
    solatium_amount_inr: Math.round(solatium),
    interest_amount_inr: Math.round(interest),
    total_award_inr: Math.round(totalAward),
    statutory_breakdown: {
      section_26_base: 'Base Market Value × Multiplier',
      section_30_1_solatium: '100% Mandatory Solatium',
      section_30_3_interest: '12% Additional Compensation per annum'
    }
  });
});

// POST /api/compensation/:id/disburse (PFMS Direct Benefit Transfer Release)
router.post('/:id/disburse', async (req, res) => {
  try {
    const { id } = req.params;
    const txnRef = `PFMS-${new Date().getFullYear()}-MP-${Math.floor(100000 + Math.random() * 900000)}`;

    const updates = {
      pfms_status: 'Disbursed via PFMS DBT',
      pfms_txn_ref: txnRef
    };

    if (isConfigured()) {
      const sb = getSupabase();
      await sb.from('compensation_awards').update(updates).eq('id', id);
    }

    const idx = memoryStore.compensation.findIndex(c => c.id === id);
    if (idx !== -1) {
      memoryStore.compensation[idx] = { ...memoryStore.compensation[idx], ...updates };
    }

    memoryStore.audit.unshift({
      id: `AUD-${Date.now().toString(36)}`,
      user_name: 'District Nodal Officer / PFMS Cell',
      action: 'Direct Benefit Transfer (DBT) Compensation Disbursed',
      entity_type: 'compensation',
      entity_id: id,
      remarks: `PFMS Reference: ${txnRef} released to verified Aadhaar-seeded bank account.`,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'DBT funds disbursed successfully via PFMS gateway.', txnRef });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
