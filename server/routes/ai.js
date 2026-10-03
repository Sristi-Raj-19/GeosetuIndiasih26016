const express = require('express');
const router = express.Router();

const KNOWLEDGE_BASE = [
  {
    keywords: ['solatium', '100%', 'section 30', 'compensation multiplier', 'bonus'],
    answer: 'Under **Section 30(1) of the RFCTLARR Act, 2013**, the Collector shall impose a mandatory **Solatium amount equivalent to 100% (one hundred percent)** of the base market value of the acquired land and assets, in addition to statutory market value.'
  },
  {
    keywords: ['interest', '12%', 'section 30(3)', 'delay', 'additional compensation'],
    answer: 'Under **Section 30(3) of the RFCTLARR Act, 2013**, an additional compensation calculated at the rate of **12% per annum** on the market value is statutory payable from the date of publication of the preliminary notification under Section 4/11 till the date of award or physical possession, whichever is earlier.'
  },
  {
    keywords: ['section 11', 'preliminary notification', 'notification', 'gazette'],
    answer: '**Section 11(1)** requires publication of a preliminary notification in the Official Gazette, two daily local newspapers (one in regional language), and Gram Panchayat notice boards. No person shall enter into any land sale/transaction post Section 11 publication without prior Collector approval.'
  },
  {
    keywords: ['section 15', 'objection', 'hearing', '60 days'],
    answer: 'Under **Section 15(1)**, any person interested in land notified under Section 11 may, within **60 days** from the date of publication, submit written objections regarding the public purpose, suitability of land, or Social Impact Assessment (SIA) findings. The Collector must grant personal hearing under Section 15(2).'
  },
  {
    keywords: ['pfms', 'dbt', 'direct benefit', 'payment', 'bank'],
    answer: 'GeoSetu-India interfaces with the **Public Financial Management System (PFMS)** for Zero-Leakage Direct Benefit Transfer (DBT). Once the Land Acquisition Officer and Collector approve the statutory Section 23/30 Award, funds are pushed directly into the verified Aadhaar-seeded Khatedar bank account with automated cryptographic reconciliation.'
  },
  {
    keywords: ['e-agreement', 'e-stamp', '₹100', 'aadhaar sign', 'dsc'],
    answer: 'GeoSetu-India generates **legally enforceable ₹100 E-Stamp Acquisition Deeds** in compliance with the Indian Stamp Act and Information Technology Act 2000. Landowners authenticate via Aadhaar OTP (or digital stylus pad), and the Land Officer applies Class-3 DSC cryptographic signature.'
  }
];

// POST /api/ai/ask
router.post('/ask', (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query text is required.' });
  }

  const cleanQuery = query.toLowerCase();
  let matched = KNOWLEDGE_BASE.find(item => item.keywords.some(kw => cleanQuery.includes(kw)));

  let responseText = '';
  if (matched) {
    responseText = matched.answer;
  } else {
    responseText = `According to the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013** and Ministry of Rural Development (DoLR) guidelines:\n\n` +
      `• All statutory land acquisition proceedings must follow the transparent 10-stage milestone pipeline (Section 4 SIA → Section 11 Notification → Section 15 Objections → Section 19 Declaration → Section 23 Award → PFMS DBT Release).\n` +
      `• Mandatory statutory solatium is 100% over the base circle rate market value with 12% annual interest.\n` +
      `• For specific case queries or cadastral survey disputes, please refer to the CALA officer or check your registered Khasra number in the Land Parcels module.`;
  }

  return res.json({
    query,
    answer: responseText,
    timestamp: new Date().toISOString(),
    source: 'RFCTLARR Act 2013 & Ministry of Rural Development Statutory Corpus'
  });
});

module.exports = router;
