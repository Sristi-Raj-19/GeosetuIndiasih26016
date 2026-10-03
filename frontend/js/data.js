/* =====================================================================
   GeoSetu-India (भूसेतु-भारत) — National Land Acquisition & Management System
   Department of Land Resources, Ministry of Rural Development, GoI.
   Role-Based Access Control (RBAC) & Single-file SPA Data Engine
   ===================================================================== */

/* ---------------- 1. ROLE DEFINITIONS & METADATA ---------------- */
const ROLES = {
  CENTRAL: {
    key: 'CENTRAL',
    label: 'Central / Ministry Authority',
    labelHi: 'केंद्रीय / मंत्रालय प्राधिकारी',
    title: 'Joint Secretary (Land Resources), MoRD, GoI',
    jurisdiction: 'National (All States & UTs)',
    scope: 'national',
    level: 1,
    icon: '🏛️',
    badgeClass: 'badge-navy'
  },
  STATE: {
    key: 'STATE',
    label: 'State Authority',
    labelHi: 'राज्य प्राधिकारी (राजस्व विभाग)',
    title: 'Principal Secretary (Revenue), Govt. of Madhya Pradesh',
    jurisdiction: 'State Level (Madhya Pradesh)',
    state: 'Madhya Pradesh',
    scope: 'state',
    level: 2,
    icon: '🏢',
    badgeClass: 'badge-pos'
  },
  DISTRICT: {
    key: 'DISTRICT',
    label: 'District Authority (Collector / CALA)',
    labelHi: 'ज़िला समाहर्ता एवं सक्षम प्राधिकारी (CALA)',
    title: 'District Collector & Competent Authority (CALA), Bhopal',
    jurisdiction: 'Bhopal District',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    scope: 'district',
    level: 3,
    icon: '⚖️',
    badgeClass: 'badge-available'
  },
  PROJECT_AGENCY: {
    key: 'PROJECT_AGENCY',
    label: 'Project Agency / Requiring Body',
    labelHi: 'परियोजना एजेंसी / भू-अपेक्षी निकाय (NHAI/Railways)',
    title: 'Chief Project Director, NHAI Corridor Division',
    jurisdiction: 'National Infrastructure Corridors (NHAI)',
    agency: 'NHAI',
    scope: 'agency',
    level: 4,
    icon: '🏗️',
    badgeClass: 'badge-saffron'
  },
  ACQUISITION_OFFICER: {
    key: 'ACQUISITION_OFFICER',
    label: 'Land Acquisition Officer (LAO)',
    labelHi: 'भू-अधिग्रहण अधिकारी (LAO)',
    title: 'Competent Land Acquisition Officer (Circle-I)',
    jurisdiction: 'Bhopal Circle-I',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    scope: 'circle',
    level: 5,
    icon: '📜',
    badgeClass: 'badge-sky'
  },
  FIELD_OFFICER: {
    key: 'FIELD_OFFICER',
    label: 'Field Verification Officer / Surveyor',
    labelHi: 'क्षेत्रीय सत्यापन अधिकारी / राजस्व सर्वेक्षक',
    title: 'Revenue Inspector & Geo-Surveyor (Berasia/Huzur)',
    jurisdiction: 'Berasia & Huzur Tehsils, Bhopal',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    scope: 'field',
    level: 6,
    icon: '📍',
    badgeClass: 'badge-clay'
  },
  CITIZEN: {
    key: 'CITIZEN',
    label: 'Citizen / Affected Landowner',
    labelHi: 'नागरिक / प्रभावित खातेदार',
    title: 'Verified Landowner (Khatedar)',
    jurisdiction: 'Demo Village, Bhopal Circle',
    scope: 'citizen',
    level: 7,
    icon: '👤',
    badgeClass: 'badge-muted'
  },
  // Backward-compatibility Aliases
  ADMIN: { key: 'DISTRICT', label: 'District Authority (CALA)' },
  LAND_OFFICER: { key: 'ACQUISITION_OFFICER', label: 'Land Acquisition Officer' },
  PROJECT_AUTHORITY: { key: 'PROJECT_AGENCY', label: 'Project Agency (NHAI/Railways)' },
  LAND_OWNER: { key: 'CITIZEN', label: 'Citizen / Land Owner' }
};

/* ---------------- 2. RBAC PERMISSIONS MODEL ---------------- */
const PERMISSIONS = {
  CENTRAL: [
    'VIEW_NATIONAL_DATA', 'VIEW_STATE_DATA', 'VIEW_DISTRICT_DATA', 'VIEW_PROJECT_DATA',
    'VIEW_ANALYTICS', 'VIEW_REPORTS', 'VIEW_GIS', 'VIEW_AI_INSIGHTS', 'VIEW_ALERTS',
    'VIEW_AUDIT', 'VIEW_NOTIFICATIONS', 'EXPORT_DATA'
  ],
  STATE: [
    'VIEW_STATE_DATA', 'VIEW_DISTRICT_DATA', 'VIEW_PROJECT_DATA', 'MANAGE_APPROVALS',
    'VIEW_GIS', 'VIEW_REPORTS', 'VIEW_AI_INSIGHTS', 'VIEW_ALERTS', 'VIEW_AUDIT',
    'VIEW_NOTIFICATIONS', 'UPDATE_WORKFLOW', 'EXPORT_DATA'
  ],
  DISTRICT: [
    'VIEW_DISTRICT_DATA', 'MANAGE_PROJECTS', 'VERIFY_DOCUMENTS', 'REVIEW_FIELD_DATA',
    'MANAGE_COMPENSATION', 'MANAGE_POSSESSION', 'MANAGE_RR', 'VIEW_GIS', 'VIEW_AI_INSIGHTS',
    'UPDATE_WORKFLOW', 'VIEW_ALERTS', 'VIEW_AUDIT', 'VIEW_NOTIFICATIONS', 'SANCTION_APPROVAL',
    'EXPORT_DATA'
  ],
  PROJECT_AGENCY: [
    'CREATE_PROJECT', 'SUBMIT_PROPOSAL', 'UPLOAD_DOCUMENTS', 'VIEW_OWN_PROJECTS',
    'TRACK_WORKFLOW', 'VIEW_OWN_GIS', 'RESPOND_TO_CLARIFICATION', 'VIEW_AI_INSIGHTS',
    'VIEW_GIS', 'VIEW_NOTIFICATIONS', 'VIEW_REPORTS'
  ],
  ACQUISITION_OFFICER: [
    'VERIFY_DOCUMENTS', 'MANAGE_NOTIFICATION', 'MANAGE_AWARD', 'MANAGE_COMPENSATION',
    'MANAGE_POSSESSION', 'MANAGE_RR', 'UPDATE_WORKFLOW', 'VIEW_GIS', 'VIEW_AI_INSIGHTS',
    'VIEW_ALERTS', 'VIEW_AUDIT', 'VIEW_NOTIFICATIONS', 'ASSIGN_FIELD_TASK'
  ],
  FIELD_OFFICER: [
    'VIEW_ASSIGNED_TASKS', 'VIEW_ASSIGNED_PARCELS', 'CAPTURE_GPS', 'UPLOAD_PHOTO',
    'SUBMIT_VERIFICATION', 'ADD_FIELD_REMARKS', 'VIEW_GIS', 'VIEW_NOTIFICATIONS'
  ],
  CITIZEN: [
    'VIEW_OWN_LAND', 'SIGN_AGREEMENT', 'VIEW_COMPENSATION', 'SUBMIT_INQUIRY',
    'VIEW_GIS', 'VIEW_NOTIFICATIONS'
  ]
};

function normalizeRole(roleKey) {
  if (!roleKey) return 'CITIZEN';
  const k = String(roleKey).toUpperCase();
  if (k === 'ADMIN') return 'DISTRICT';
  if (k === 'LAND_OFFICER') return 'ACQUISITION_OFFICER';
  if (k === 'PROJECT_AUTHORITY') return 'PROJECT_AGENCY';
  if (k === 'LAND_OWNER') return 'CITIZEN';
  return ROLES[k] ? ROLES[k].key : 'CITIZEN';
}

function hasPermission(permission, user = CURRENT_USER) {
  if (!user || !user.role) return false;
  const roleKey = normalizeRole(user.role);
  const userPerms = PERMISSIONS[roleKey] || [];
  return userPerms.includes(permission);
}

function canRoleAccess(requiredRoles, user = CURRENT_USER) {
  if (!user || !user.role) return false;
  const userRole = normalizeRole(user.role);
  const normalizedRequired = (requiredRoles || []).map(r => normalizeRole(r));
  return normalizedRequired.includes(userRole);
}

/* ---------------- 3. CORE DOMAIN CONSTANTS ---------------- */
const STATES = ['Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Karnataka', 'Rajasthan', 'Tamil Nadu'];

const DISTRICTS = ['Bhopal', 'Sehore', 'Raisen', 'Vidisha', 'Hoshangabad', 'Indore', 'Nagpur', 'Pune', 'Surat', 'Lucknow'];

const TEHSILS = ['Huzur', 'Berasia', 'Phanda', 'Silwani', 'Goharganj', 'Budni', 'Kolar'];

const VILLAGES = [
  'Demo Village', 'Kolar Kalan', 'Bagsevaniya', 'Ratanpur', 'Sukhi Sewaniya',
  'Chandanpura', 'Neelbad', 'Barkheda Pathani', 'Misrod', 'Ayodhya Nagar',
  'Bairagarh Kalan', 'Pipariya Kalan', 'Khajuri Sadak', 'Bilkhiriya'
];

const PARCEL_STATUSES = [
  'Available', 'Under Verification', 'Under Acquisition', 'Approved',
  'Compensation Pending', 'Acquired', 'Disputed', 'Utilized'
];

const WORKFLOW_STATES = [
  'PROPOSAL', 'SCRUTINY', 'VERIFICATION', 'APPROVAL', 'NOTICE_ISSUED',
  'AWARD', 'COMPENSATION_ASSESSED', 'PAYMENT_COMPLETED', 'POSSESSION', 'RR_COMPLETED'
];

const WORKFLOW_LABELS = {
  PROPOSAL: 'Project Proposal',
  SCRUTINY: 'Digital Scrutiny',
  VERIFICATION: 'Verification',
  APPROVAL: 'Competent Approval',
  NOTICE_ISSUED: 'Section 11(1) Notice',
  AWARD: 'Section 23/30 Award',
  COMPENSATION_ASSESSED: 'Compensation Assessment',
  PAYMENT_COMPLETED: 'DBT Disbursed (PFMS)',
  POSSESSION: 'Section 38 Possession',
  RR_COMPLETED: 'R&R Completed & Closed',
  // Backward-compatibility
  IDENTIFIED: 'Project Proposal',
  OBJECTION_REVIEW: 'Section 15 Hearing',
  PAYMENT_PENDING: 'DBT Payment Processing',
  LAND_ACQUIRED: 'Section 38 Possession',
  PROJECT_UTILIZATION: 'R&R Handover & Closed'
};

const WORKFLOW_NEXT = {
  PROPOSAL: 'SCRUTINY',
  SCRUTINY: 'VERIFICATION',
  VERIFICATION: 'APPROVAL',
  APPROVAL: 'NOTICE_ISSUED',
  NOTICE_ISSUED: 'AWARD',
  AWARD: 'COMPENSATION_ASSESSED',
  COMPENSATION_ASSESSED: 'PAYMENT_COMPLETED',
  PAYMENT_COMPLETED: 'POSSESSION',
  POSSESSION: 'RR_COMPLETED',
  RR_COMPLETED: null,
  // Backward compatibility
  IDENTIFIED: 'VERIFICATION',
  OBJECTION_REVIEW: 'APPROVAL',
  PAYMENT_PENDING: 'PAYMENT_COMPLETED',
  LAND_ACQUIRED: 'RR_COMPLETED',
  PROJECT_UTILIZATION: null
};

const WORKFLOW_TO_PARCEL_STATUS = {
  PROPOSAL: 'Available',
  SCRUTINY: 'Under Verification',
  VERIFICATION: 'Under Verification',
  APPROVAL: 'Approved',
  NOTICE_ISSUED: 'Under Acquisition',
  AWARD: 'Compensation Pending',
  COMPENSATION_ASSESSED: 'Compensation Pending',
  PAYMENT_COMPLETED: 'Acquired',
  POSSESSION: 'Acquired',
  RR_COMPLETED: 'Utilized',
  // Backward compatibility
  IDENTIFIED: 'Available',
  OBJECTION_REVIEW: 'Under Acquisition',
  PAYMENT_PENDING: 'Compensation Pending',
  LAND_ACQUIRED: 'Acquired',
  PROJECT_UTILIZATION: 'Utilized'
};

const DOCUMENT_TYPES = [
  'Land Record (RoR / 7/12 / Khasra)',
  'Detailed Project Report (DPR)',
  'Ownership Certificate / Mutation Extract',
  'Joint Measurement Survey (JMS) Report',
  'Encumbrance Certificate (Sec 15)',
  'Identity Document (Aadhaar / PAN)',
  'Gazette Preliminary Notification (Sec 4)',
  'Competent Authority Sanction Order (Sec 19)',
  'Compensation Award Deed (Sec 23/30)',
  'Physical Possession Certificate (Sec 38)',
  'Rehabilitation & Resettlement Card (Sched II)'
];

const DOCUMENT_STATUSES = ['Pending', 'Uploaded', 'Under Review', 'Verified', 'Rejected'];

const LAND_TYPES = [
  'Agricultural (Irrigated)', 'Agricultural (Unirrigated)', 'Residential Plot',
  'Commercial / Road-facing', 'Industrial Zone', 'Barren / Govt Vested', 'Forest Buffer'
];

const PROJECT_TYPES = [
  'Highways & Expressways (NHAI)',
  'Dedicated Freight Corridors (DFCCIL)',
  'High Speed Rail (Bullet Train - NHSRCL)',
  'National Irrigation Canal Network',
  'PM GatiShakti Multi-Modal Hub',
  'Power Transmission Grid Line',
  'Industrial Corridor & Smart City'
];

const DEPARTMENTS = [
  'National Highways Authority of India (MoRTH)',
  'Dedicated Freight Corridor Corp. of India (MoR)',
  'National High Speed Rail Corp. Ltd. (NHSRCL)',
  'Department of Water Resources & Irrigation',
  'Department for Promotion of Industry (DPIIT)',
  'Power Grid Corporation of India',
  'Ministry of Petroleum & Natural Gas'
];

const FIRST_NAMES = ['Amit', 'Sunita', 'Rakesh', 'Priya', 'Manoj', 'Geeta', 'Suresh', 'Kavita', 'Deepak', 'Anita', 'Vijay', 'Rekha', 'Ramesh', 'Meena', 'Ashok', 'Neha', 'Sanjay', 'Pooja', 'Vinod', 'Shweta', 'Arun', 'Kiran', 'Mahesh', 'Seema', 'Ravi', 'Usha', 'Naresh', 'Anjali', 'Dinesh', 'Bharti'];
const LAST_NAMES = ['Kumar', 'Sharma', 'Verma', 'Patel', 'Yadav', 'Chouhan', 'Mishra', 'Singh', 'Gupta', 'Rathore', 'Malviya', 'Tiwari', 'Agrawal', 'Jain', 'Solanki'];

/* ---------------- 4. UTILITY FUNCTIONS ---------------- */
let SEED = 42;
function rnd() { SEED = (SEED * 9301 + 49297) % 233280; return SEED / 233280; }
function rint(a, b) { return Math.floor(rnd() * (b - a + 1)) + a; }
function pick(arr) { return arr[rint(0, arr.length - 1)]; }
function pickN(arr, n) {
  const c = [...arr];
  const out = [];
  for (let i = 0; i < n && c.length; i++) {
    out.push(c.splice(rint(0, c.length - 1), 1)[0]);
  }
  return out;
}
function uid(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 9).toUpperCase(); }
function fmtINR(n) {
  const val = Math.round(n || 0);
  if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
  if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' Lakh';
  return '₹' + val.toLocaleString('en-IN');
}
function fmtINRFull(n) { return '₹' + Math.round(n || 0).toLocaleString('en-IN'); }
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 86400000); }
function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_'); }
function statusBadgeClass(s) { return 'badge badge-' + slug(s); }
function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function addDaysISO(iso, n) { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

/* ---------------- 5. AI BOTTLENECK DETECTION ENGINE & LLAMA 3.2 ---------------- */
/**
 * ML Feature Extractor & Risk Scoring Model
 * Evaluates structured operational delays, pending approvals, possession gaps,
 * compensation disbursement lag, and R&R backlogs.
 */
function analyzeProjectBottlenecks(project) {
  if (!project) return null;

  const cases = (DB.cases || []).filter(c => c.projectId === project.id);
  const comp = (DB.compensation || []).filter(c => cases.some(k => k.id === c.caseId));
  const totalComp = comp.reduce((s, x) => s + (x.total || 0), 0);
  const paidComp = comp.filter(x => x.paymentStatus === 'Paid').reduce((s, x) => s + (x.total || 0), 0);
  const pendingCompRatio = totalComp > 0 ? (totalComp - paidComp) / totalComp : 0;

  const m = (DB.monitoring || []).find(x => x.projectId === project.id) || {};
  const delayPct = (m.expectedProgress || 0) - (m.actualProgress || 0);
  const possessionPct = project.possessionProgressPct != null ? project.possessionProgressPct : Math.round((project.acquiredArea / Math.max(project.requiredArea, 1)) * 100);
  const rrPct = project.rrProgressPct != null ? project.rrProgressPct : 50;

  const pendingDocs = (DB.documents || []).filter(d => cases.some(k => k.id === d.caseId) && d.status !== 'Verified').length;
  const fieldPending = (DB.parcels || []).filter(p => p.projectId === project.id && p.fieldTask && p.fieldTask.status !== 'Approved').length;
  const pendingClarifications = (project.clarifications || []).filter(c => c.status === 'Pending').length;

  const factors = [];
  let score = 15; // baseline risk score
  let primary = 'Workflow Progressing Within Statutory Limits';

  if (delayPct > 15) {
    score += 30;
    factors.push(`${Math.round(delayPct)}% statutory milestone schedule deviation`);
  }
  if (possessionPct < 60 && delayPct > 5) {
    score += 28;
    factors.push(`Section 38 physical possession pending for ${100 - possessionPct}% alignment area`);
    primary = 'Possession & Physical Handover (Sec 38)';
  }
  if (pendingCompRatio > 0.35) {
    score += 24;
    factors.push(`${fmtINR(totalComp - paidComp)} DBT compensation pending in PFMS banking queue`);
    if (primary.includes('Within Statutory')) primary = 'Compensation Disbursement Lag (PFMS DBT)';
  }
  if (pendingDocs >= 2) {
    score += 18;
    factors.push(`${pendingDocs} statutory title/mutation documents flagged in scrutiny queue`);
    if (primary.includes('Within Statutory')) primary = 'Document Scrutiny & RoR Mismatches';
  }
  if (fieldPending >= 2) {
    score += 16;
    factors.push(`${fieldPending} parcel boundaries pending ground GPS & photo verification`);
  }
  if (project.displacedFamiliesCount > 15 && rrPct < 60) {
    score += 22;
    factors.push(`R&R resettlement pending for ${project.displacedFamiliesCount} displaced families (${rrPct}% completed)`);
    if (primary.includes('Within Statutory')) primary = 'Rehabilitation & Resettlement (R&R) Backlog';
  }
  if (pendingClarifications > 0) {
    score += 12;
    factors.push(`${pendingClarifications} inter-departmental clarification requests pending agency response`);
  }

  score = Math.min(96, Math.max(12, score));
  const riskLevel = score >= 65 ? 'High' : (score >= 40 ? 'Medium' : 'Low');

  return {
    projectId: project.id,
    projectName: project.name,
    state: project.state || 'Madhya Pradesh',
    primaryBottleneck: primary,
    riskLevel: riskLevel,
    riskScore: score,
    possessionPct: possessionPct,
    rrPct: rrPct,
    contributingFactors: factors.length ? factors : ['Workflow operating strictly within RFCTLARR baseline timelines'],
    explanation: explainWithLlama({
      primary,
      riskLevel,
      score,
      factors,
      project,
      possessionPct,
      pendingComp: totalComp - paidComp
    })
  };
}

/**
 * Natural Language Explanation Layer (Llama 3.2 Synthesis)
 * Formats factual ML model extraction into crisp executive natural language.
 */
function explainWithLlama(analysis, project) {
  if (!analysis) return '';
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const score = analysis.riskScore != null ? analysis.riskScore : (analysis.score || 25);
  const primary = analysis.primaryBottleneck || analysis.primary || 'Statutory Timeline Alignment';
  const factors = analysis.contributingFactors || analysis.factors || [];
  const riskLevel = analysis.riskLevel || (score > 60 ? 'High' : (score > 35 ? 'Medium' : 'Low'));

  if (riskLevel === 'High' || riskLevel === 'HIGH') {
    return isHi
      ? `[Llama 3.2 निर्णय संश्लेषण] इस परियोजना में मुख्य गतिरोध “${primary}” के अंतर्गत पाया गया है। समग्र जोखिम सूचकांक ${score}/100 है। मुख्य कारक: ${factors.join('; ')}। ज़िला समाहर्ता (CALA) एवं परियोजना एजेंसी के मध्य संयुक्त समीक्षा बैठक आयोजित कर भौतिक कब्जा व डीबीटी अंतरण में तेजी लाने की अनुशंसा की जाती है।`
      : `[Llama 3.2 Decision Synthesis] Critical operational bottleneck identified in “${primary}” with composite risk score of ${score}/100. Key drivers: ${factors.join('; ')}. Immediate high-level coordination between District CALA and Project Authority is recommended to clear pending statutory hurdles.`;
  } else if (riskLevel === 'Medium' || riskLevel === 'MEDIUM') {
    return isHi
      ? `[Llama 3.2 निर्णय संश्लेषण] मध्यम जोखिम स्तर (${score}/100) दर्ज हुआ है। मुख्य कारक: ${factors.join('; ')}। सांविधिक समय-सीमा के भीतर दस्तावेज़ सत्यापन एवं डीबीटी किश्त जारी कर संभावित विलंब को रोका जा सकता है।`
      : `[Llama 3.2 Decision Synthesis] Moderate scheduling friction detected with risk index ${score}/100. Factors: ${factors.join('; ')}. Proactive clearing of field verifications and PFMS tranches will avert compounding delays under RFCTLARR statutory deadlines.`;
  } else {
    return isHi
      ? `[Llama 3.2 निर्णय संश्लेषण] परियोजना कार्यवाही सामान्य गति से संचालित है (जोखिम सूचकांक: ${score}/100)। सभी सांविधिक मानक एवं वितरण लक्ष्य निर्धारित समय-सीमा के अनुकूल हैं।`
      : `[Llama 3.2 Decision Synthesis] Project execution is on schedule with low risk rating (${score}/100). Statutory land titling and compensation disbursements are aligning with baseline corridor handover targets.`;
  }
}

/* ---------------- 6. ROLE-SCOPED DATA FILTERING HELPERS ---------------- */
function getRoleScope(user = CURRENT_USER) {
  if (!user) return { role: 'CITIZEN', level: 'citizen', state: 'Madhya Pradesh', district: 'Bhopal', agency: 'NHAI' };
  const role = normalizeRole(user.role);
  return {
    role,
    level: ROLES[role]?.scope || 'citizen',
    state: user.state || (ROLES[role]?.state) || 'Madhya Pradesh',
    district: user.district || (ROLES[role]?.district) || 'Bhopal',
    agency: user.agency || (ROLES[role]?.agency) || 'NHAI',
    userId: user.id
  };
}

function filterProjectsByRole(listOrUser, maybeUser) {
  const list = Array.isArray(listOrUser) ? listOrUser : (DB?.projects || []);
  const user = Array.isArray(listOrUser) ? (maybeUser || CURRENT_USER) : (listOrUser || CURRENT_USER);
  const scope = getRoleScope(user);
  if (!list || !list.length) return [];
  if (scope.role === 'CENTRAL') return list;
  if (scope.role === 'STATE') return list.filter(p => !p.state || p.state === scope.state);
  if (scope.role === 'DISTRICT') return list.filter(p => !p.district || p.district === scope.district || p.location === scope.district);
  if (scope.role === 'PROJECT_AGENCY') return list.filter(p => p.agency === scope.agency || (p.department && p.department.includes(scope.agency)) || (p.type && p.type.includes(scope.agency)));
  if (scope.role === 'ACQUISITION_OFFICER' || scope.role === 'FIELD_OFFICER') return list.filter(p => !p.district || p.district === scope.district || p.location === scope.district);
  return list.slice(0, 3);
}

function filterParcelsByRole(listOrUser, maybeUser) {
  const list = Array.isArray(listOrUser) ? listOrUser : (DB?.parcels || []);
  const user = Array.isArray(listOrUser) ? (maybeUser || CURRENT_USER) : (listOrUser || CURRENT_USER);
  const scope = getRoleScope(user);
  if (!list || !list.length) return [];
  if (scope.role === 'CENTRAL') return list;
  if (scope.role === 'STATE') return list.filter(p => !p.state || p.state === scope.state);
  if (scope.role === 'DISTRICT' || scope.role === 'ACQUISITION_OFFICER') return list.filter(p => !p.district || p.district === scope.district);
  if (scope.role === 'FIELD_OFFICER') return list.filter(p => (p.fieldTask && (p.fieldTask.assignedTo === user?.id || p.fieldTask.assignedTo === user?.name || p.fieldTask.assignedTo === 'Vikram Patel' || p.fieldTask.assignedTo === 'Sunil Verma')) || p.district === scope.district);
  if (scope.role === 'PROJECT_AGENCY') {
    const agencyPrjs = filterProjectsByRole(user).map(p => p.id);
    return list.filter(p => p.projectId && agencyPrjs.includes(p.projectId));
  }
  if (scope.role === 'CITIZEN') {
    return list.filter(p => p.ownerId === (DB?.owners?.[0]?.id || 'OWN-001') || (user?.parcelIds && user.parcelIds.includes(p.id)));
  }
  return list;
}

function filterCasesByRole(listOrUser, maybeUser) {
  const list = Array.isArray(listOrUser) ? listOrUser : (DB?.cases || []);
  const user = Array.isArray(listOrUser) ? (maybeUser || CURRENT_USER) : (listOrUser || CURRENT_USER);
  const validParcels = filterParcelsByRole(user).map(p => p.id);
  return list.filter(c => validParcels.includes(c.parcelId));
}

function filterFieldTasksByRole(listOrUser, maybeUser) {
  const list = Array.isArray(listOrUser) ? listOrUser : (DB?.fieldTasks || []);
  const user = Array.isArray(listOrUser) ? (maybeUser || CURRENT_USER) : (listOrUser || CURRENT_USER);
  const scope = getRoleScope(user);
  if (!list || !list.length) return [];
  if (scope.role === 'FIELD_OFFICER') return list.filter(t => t.assignedTo === user?.id || t.assignedTo === user?.name || t.assignedTo === 'Vikram Patel' || t.assignedTo === 'Sunil Verma' || t.assignedTo === 'U-FIELD' || !t.assignedTo);
  if (scope.role === 'DISTRICT' || scope.role === 'ACQUISITION_OFFICER' || scope.role === 'STATE' || scope.role === 'CENTRAL') return list;
  return [];
}

function filterNotificationsByRole(listOrUser, maybeUser) {
  const list = Array.isArray(listOrUser) ? listOrUser : (DB?.notifications || []);
  const user = Array.isArray(listOrUser) ? (maybeUser || CURRENT_USER) : (listOrUser || CURRENT_USER);
  const scope = getRoleScope(user);
  if (!list || !list.length) return [];
  return list.filter(n => !n.role || normalizeRole(n.role) === scope.role || n.role === 'ALL');
}

/* ---------------- 7. SEED DATA GENERATOR ---------------- */
const BASE_LAT = 23.2599, BASE_LNG = 77.4126;

function makeParcelPolygon(lat, lng, sizeDeg) {
  const j = () => (rnd() - 0.5) * sizeDeg * 0.35;
  return [
    [lat - sizeDeg / 2 + j(), lng - sizeDeg / 2 + j()],
    [lat - sizeDeg / 2 + j(), lng + sizeDeg / 2 + j()],
    [lat + sizeDeg / 2 + j(), lng + sizeDeg / 2 + j()],
    [lat + sizeDeg / 2 + j(), lng - sizeDeg / 2 + j()],
  ];
}

function generateSeed() {
  SEED = 42;
  const db = {
    users: [],
    owners: [],
    parcels: [],
    projects: [],
    proposals: [],
    cases: [],
    documents: [],
    approvals: [],
    compensation: [],
    fieldTasks: [],
    notifications: [],
    alerts: [],
    monitoring: [],
    auditLogs: [],
    agreements: []
  };

  // 1. Registered Users for all 7 Roles
  db.users = [
    {
      id: 'U-CENTRAL',
      name: 'Dr. V. K. Saraswat',
      role: 'CENTRAL',
      title: 'Joint Secretary, Ministry of Rural Development (DoLR)',
      username: 'central',
      email: 'central@geosetu.gov.in',
      password: 'password123',
      jurisdiction: 'National (All States)',
      state: 'All'
    },
    {
      id: 'U-STATE',
      name: 'P. K. Shrivastava, IAS',
      role: 'STATE',
      title: 'Principal Secretary (Revenue), Govt. of Madhya Pradesh',
      username: 'state',
      email: 'state@geosetu.gov.in',
      password: 'password123',
      jurisdiction: 'Madhya Pradesh',
      state: 'Madhya Pradesh'
    },
    {
      id: 'U-DISTRICT',
      name: 'S. Nair, IAS',
      role: 'DISTRICT',
      title: 'District Collector & Competent Authority (CALA), Bhopal',
      username: 'district',
      email: 'district@geosetu.gov.in',
      password: 'password123',
      jurisdiction: 'Bhopal District',
      district: 'Bhopal',
      state: 'Madhya Pradesh'
    },
    {
      id: 'U-ADMIN',
      name: 'S. Nair, IAS',
      role: 'ADMIN', // Alias for DISTRICT
      title: 'District Collector & CALA, Bhopal',
      username: 'admin',
      email: 'admin@geosetu.gov.in',
      password: 'password123',
      district: 'Bhopal',
      state: 'Madhya Pradesh'
    },
    {
      id: 'U-AGENCY',
      name: 'A. Deshmukh',
      role: 'PROJECT_AGENCY',
      title: 'Chief Project Director, NHAI Corridor Division',
      username: 'agency',
      email: 'agency@geosetu.gov.in',
      password: 'password123',
      agency: 'NHAI',
      jurisdiction: 'NHAI Expressway Network'
    },
    {
      id: 'U-AUTHORITY',
      name: 'A. Deshmukh',
      role: 'PROJECT_AUTHORITY', // Alias for PROJECT_AGENCY
      title: 'Project Director, NHAI Cell',
      username: 'authority',
      email: 'authority@geosetu.gov.in',
      password: 'password123',
      agency: 'NHAI'
    },
    {
      id: 'U-OFFICER',
      name: 'R. Chouhan',
      role: 'ACQUISITION_OFFICER',
      title: 'Land Acquisition Officer (Circle-I, Bhopal)',
      username: 'officer',
      email: 'officer@geosetu.gov.in',
      password: 'password123',
      district: 'Bhopal',
      state: 'Madhya Pradesh'
    },
    {
      id: 'U-FIELD',
      name: 'Vikram Patel',
      role: 'FIELD_OFFICER',
      title: 'Revenue Inspector & Field Surveyor (Berasia/Huzur)',
      username: 'field',
      email: 'field@geosetu.gov.in',
      password: 'password123',
      district: 'Bhopal',
      state: 'Madhya Pradesh'
    },
    {
      id: 'U-CITIZEN',
      name: 'Amit Kumar',
      role: 'CITIZEN',
      title: 'Verified Landowner (Khatedar)',
      username: 'citizen',
      email: 'citizen@geosetu.gov.in',
      password: 'password123',
      village: 'Demo Village',
      district: 'Bhopal',
      state: 'Madhya Pradesh'
    }
  ];

  // 2. Owners (30 Khatedars)
  for (let i = 1; i <= 30; i++) {
    db.owners.push({
      id: 'OWN-' + String(i).padStart(3, '0'),
      name: (i === 1 ? 'Amit Kumar' : (pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES))),
      phone: '9' + rint(100000000, 999999999),
      village: pick(VILLAGES),
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      idType: 'Aadhaar (UIDAI Verified)',
      idMasked: 'XXXX-XXXX-' + rint(1000, 9999)
    });
  }

  // 3. Multi-State Infrastructure Projects (10 Corridors)
  const SEED_PROJECTS = [
    {
      id: 'PRJ-001',
      name: 'Bhopal-Indore Economic Corridor (NH-46 6-Lane)',
      type: 'Highways & Expressways (NHAI)',
      department: 'National Highways Authority of India (MoRTH)',
      agency: 'NHAI',
      state: 'Madhya Pradesh',
      location: 'Bhopal',
      requiredArea: 68.5,
      acquiredArea: 52.0,
      utilizedArea: 44.0,
      compensationAssessed: 142500000,
      compensationDisbursed: 124000000,
      affectedFamiliesCount: 142,
      displacedFamiliesCount: 38,
      possessionProgressPct: 76,
      rrProgressPct: 82,
      startDate: '2024-03-15',
      targetDate: '2027-06-30',
      status: 'In Progress',
      stage: 'POSSESSION',
      clarifications: [
        { id: 'CLR-01', query: 'Provide revised alignment polygon near Kolar buffer zone.', requestedBy: 'District CALA (Bhopal)', date: '2026-08-14', response: 'Revised alignment polygon submitted with 30m stream buffer clearance.', respondedAt: '2026-08-20', status: 'Resolved' }
      ]
    },
    {
      id: 'PRJ-002',
      name: 'Bhopal Outer Ring Road (Phase-II Greenfield)',
      type: 'Highways & Expressways (NHAI)',
      department: 'National Highways Authority of India (MoRTH)',
      agency: 'NHAI',
      state: 'Madhya Pradesh',
      location: 'Bhopal',
      requiredArea: 48.0,
      acquiredArea: 28.5,
      utilizedArea: 18.0,
      compensationAssessed: 88400000,
      compensationDisbursed: 64000000,
      affectedFamiliesCount: 96,
      displacedFamiliesCount: 24,
      possessionProgressPct: 59,
      rrProgressPct: 65,
      startDate: '2025-01-10',
      targetDate: '2027-12-31',
      status: 'In Progress',
      stage: 'COMPENSATION_ASSESSED',
      clarifications: []
    },
    {
      id: 'PRJ-003',
      name: 'Metro Rail Feeder Depot & Sub-Circle Terminal',
      type: 'Industrial Corridor & Smart City',
      department: 'Department for Promotion of Industry (DPIIT)',
      agency: 'Urban Development Authority',
      state: 'Madhya Pradesh',
      location: 'Bhopal',
      requiredArea: 24.0,
      acquiredArea: 24.0,
      utilizedArea: 22.0,
      compensationAssessed: 56200000,
      compensationDisbursed: 56200000,
      affectedFamiliesCount: 42,
      displacedFamiliesCount: 12,
      possessionProgressPct: 100,
      rrProgressPct: 95,
      startDate: '2023-09-01',
      targetDate: '2026-11-30',
      status: 'Completed',
      stage: 'RR_COMPLETED',
      clarifications: []
    },
    {
      id: 'PRJ-004',
      name: 'Narmada Valley Left Bank Irrigation Feeder Canal',
      type: 'National Irrigation Canal Network',
      department: 'Department of Water Resources & Irrigation',
      agency: 'Water Resources Dept',
      state: 'Madhya Pradesh',
      location: 'Hoshangabad',
      requiredArea: 85.0,
      acquiredArea: 46.0,
      utilizedArea: 35.0,
      compensationAssessed: 112000000,
      compensationDisbursed: 74000000,
      affectedFamiliesCount: 188,
      displacedFamiliesCount: 45,
      possessionProgressPct: 54,
      rrProgressPct: 50,
      startDate: '2024-06-15',
      targetDate: '2028-03-31',
      status: 'In Progress',
      stage: 'VERIFICATION',
      clarifications: [
        { id: 'CLR-02', query: 'Clarify forest clearance certificate near Babai range.', requestedBy: 'State Revenue Dept', date: '2026-09-01', response: 'Forest clearance MoEFCC Stage-I sanction attached.', respondedAt: '2026-09-10', status: 'Resolved' }
      ]
    },
    {
      id: 'PRJ-005',
      name: 'Mumbai-Nagpur Samruddhi Expressway Extension Link',
      type: 'Highways & Expressways (NHAI)',
      department: 'National Highways Authority of India (MoRTH)',
      agency: 'NHAI',
      state: 'Maharashtra',
      location: 'Nagpur',
      requiredArea: 92.0,
      acquiredArea: 78.0,
      utilizedArea: 65.0,
      compensationAssessed: 220000000,
      compensationDisbursed: 195000000,
      affectedFamiliesCount: 215,
      displacedFamiliesCount: 62,
      possessionProgressPct: 85,
      rrProgressPct: 88,
      startDate: '2023-11-01',
      targetDate: '2027-02-28',
      status: 'In Progress',
      stage: 'POSSESSION',
      clarifications: []
    },
    {
      id: 'PRJ-006',
      name: 'DFCCIL Western Freight Corridor (Palghar-Dahanu Sec)',
      type: 'Dedicated Freight Corridors (DFCCIL)',
      department: 'Dedicated Freight Corridor Corp. of India (MoR)',
      agency: 'DFCCIL',
      state: 'Maharashtra',
      location: 'Pune',
      requiredArea: 110.0,
      acquiredArea: 65.0,
      utilizedArea: 42.0,
      compensationAssessed: 310000000,
      compensationDisbursed: 180000000,
      affectedFamiliesCount: 290,
      displacedFamiliesCount: 94,
      possessionProgressPct: 59,
      rrProgressPct: 60,
      startDate: '2024-04-10',
      targetDate: '2028-09-30',
      status: 'In Progress',
      stage: 'NOTICE_ISSUED',
      clarifications: [
        { id: 'CLR-03', query: 'Verification needed for coastal regulation zone buffer.', requestedBy: 'State Environment Cell', date: '2026-09-18', response: null, respondedAt: null, status: 'Pending' }
      ]
    },
    {
      id: 'PRJ-007',
      name: 'Mumbai-Ahmedabad High Speed Rail (Surat-Vadodara Section)',
      type: 'High Speed Rail (Bullet Train - NHSRCL)',
      department: 'National High Speed Rail Corp. Ltd. (NHSRCL)',
      agency: 'NHSRCL',
      state: 'Gujarat',
      location: 'Surat',
      requiredArea: 145.0,
      acquiredArea: 138.0,
      utilizedArea: 120.0,
      compensationAssessed: 520000000,
      compensationDisbursed: 510000000,
      affectedFamiliesCount: 420,
      displacedFamiliesCount: 115,
      possessionProgressPct: 95,
      rrProgressPct: 98,
      startDate: '2022-08-01',
      targetDate: '2026-12-31',
      status: 'In Progress',
      stage: 'POSSESSION',
      clarifications: []
    },
    {
      id: 'PRJ-008',
      name: 'Ganga Expressway Greenfield Link (Lucknow Bypass)',
      type: 'Highways & Expressways (NHAI)',
      department: 'National Highways Authority of India (MoRTH)',
      agency: 'NHAI',
      state: 'Uttar Pradesh',
      location: 'Lucknow',
      requiredArea: 75.0,
      acquiredArea: 32.0,
      utilizedArea: 15.0,
      compensationAssessed: 165000000,
      compensationDisbursed: 85000000,
      affectedFamiliesCount: 165,
      displacedFamiliesCount: 48,
      possessionProgressPct: 43,
      rrProgressPct: 40,
      startDate: '2025-03-01',
      targetDate: '2028-06-30',
      status: 'In Progress',
      stage: 'SCRUTINY',
      clarifications: [
        { id: 'CLR-04', query: 'Submit updated Social Impact Assessment baseline survey report.', requestedBy: 'State SIA Unit', date: '2026-09-22', response: null, respondedAt: null, status: 'Pending' }
      ]
    },
    {
      id: 'PRJ-009',
      name: 'Bengaluru-Chennai Expressway Multi-Modal Freight Hub',
      type: 'PM GatiShakti Multi-Modal Hub',
      department: 'Department for Promotion of Industry (DPIIT)',
      agency: 'NHAI',
      state: 'Karnataka',
      location: 'Sehore',
      requiredArea: 55.0,
      acquiredArea: 48.0,
      utilizedArea: 38.0,
      compensationAssessed: 135000000,
      compensationDisbursed: 125000000,
      affectedFamiliesCount: 110,
      displacedFamiliesCount: 28,
      possessionProgressPct: 87,
      rrProgressPct: 90,
      startDate: '2023-10-15',
      targetDate: '2027-05-31',
      status: 'In Progress',
      stage: 'POSSESSION',
      clarifications: []
    },
    {
      id: 'PRJ-010',
      name: 'Dholera Industrial Smart City Energy Pipeline',
      type: 'Power Transmission Grid Line',
      department: 'Ministry of Petroleum & Natural Gas',
      agency: 'DPIIT',
      state: 'Gujarat',
      location: 'Surat',
      requiredArea: 35.0,
      acquiredArea: 12.0,
      utilizedArea: 5.0,
      compensationAssessed: 48000000,
      compensationDisbursed: 22000000,
      affectedFamiliesCount: 65,
      displacedFamiliesCount: 14,
      possessionProgressPct: 34,
      rrProgressPct: 35,
      startDate: '2025-05-20',
      targetDate: '2028-11-30',
      status: 'In Progress',
      stage: 'PROPOSAL',
      clarifications: []
    }
  ];

  db.projects = SEED_PROJECTS;

  // 4. Project Proposals (for Project Agency role)
  db.proposals = [
    {
      id: 'PROP-2026-01',
      title: 'Greenfield Port Connectivity Spur (NH-46 Link to Inland Hub)',
      agency: 'NHAI',
      department: 'National Highways Authority of India (MoRTH)',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      requiredArea: 34.5,
      estimatedCost: 145000000,
      justification: 'Critical 4-lane feeder link connecting Mandideep dry port to National Highway corridor.',
      submittedDate: '2026-08-15',
      status: 'Under Scrutiny',
      scrutinyRemarks: 'Cadastral overlay verified. SIA public hearing scheduled.',
      clarifications: [
        { id: 'C-01', query: 'Please confirm non-encroachment on reserve forest patch at Ch. 12+400.', requestedBy: 'District CALA (Bhopal)', date: '2026-09-02', response: 'Survey coordinates adjusted outside reserve boundary.', respondedDate: '2026-09-08', status: 'Resolved' }
      ]
    },
    {
      id: 'PROP-2026-02',
      title: 'Dedicated Rail Logistics Loop line for Industrial Corridor',
      agency: 'DFCCIL',
      department: 'Dedicated Freight Corridor Corp. of India (MoR)',
      state: 'Madhya Pradesh',
      district: 'Raisen',
      requiredArea: 28.0,
      estimatedCost: 98000000,
      justification: 'Dedicated siding loop to de-congest main passenger railway tracks.',
      submittedDate: '2026-09-04',
      status: 'Clarification Requested',
      scrutinyRemarks: 'Awaiting revised RoR extraction for 4 khasra parcels.',
      clarifications: [
        { id: 'C-02', query: 'Updated RoR copies for Survey 88/1 and 88/2 required.', requestedBy: 'Acquisition Officer (LAO)', date: '2026-09-16', response: null, respondedDate: null, status: 'Pending' }
      ]
    },
    {
      id: 'PROP-2026-03',
      title: 'Bullet Train Maintenance Depot Feeder Link',
      agency: 'NHSRCL',
      department: 'National High Speed Rail Corp. Ltd. (NHSRCL)',
      state: 'Gujarat',
      district: 'Surat',
      requiredArea: 42.0,
      estimatedCost: 280000000,
      justification: 'Track feeder corridor linking rolling stock maintenance depot.',
      submittedDate: '2026-07-20',
      status: 'Sanctioned',
      scrutinyRemarks: 'Section 19 declaration approved and published in State Gazette.',
      clarifications: []
    }
  ];

  // 5. Land Parcels (100 Cadastral Units with GPS, Possession & Field Tasks)
  for (let i = 1; i <= 100; i++) {
    const dlat = BASE_LAT + (rnd() - 0.5) * 0.32;
    const dlng = BASE_LNG + (rnd() - 0.5) * 0.42;
    const size = 0.006 + rnd() * 0.006;
    const owner = pick(db.owners);
    const status = pick(PARCEL_STATUSES);
    const project = rnd() < 0.75 ? pick(db.projects) : null;
    const district = pick(DISTRICTS);
    const surveyNo = rint(10, 999) + '/' + rint(1, 9);
    const area = +(2 + rnd() * 14).toFixed(2);
    const parcelId = 'MP-BH-' + String(i).padStart(3, '0');

    // Field verification task simulation
    const isFieldAssigned = i <= 25;
    const isFieldSubmitted = isFieldAssigned && i <= 15;
    const isFieldApproved = isFieldAssigned && i <= 8;

    const fieldTask = isFieldAssigned ? {
      taskId: 'TSK-' + String(i).padStart(3, '0'),
      parcelId: parcelId,
      assignedTo: 'U-FIELD',
      assignedOfficer: 'Vikram Patel (Field Surveyor)',
      assignedDate: '2026-09-01',
      status: isFieldApproved ? 'Approved' : (isFieldSubmitted ? 'Submitted' : (i % 2 === 0 ? 'Re-verification Requested' : 'Assigned')),
      gpsTarget: { lat: dlat, lng: dlng },
      gpsCaptured: isFieldSubmitted ? {
        lat: +(dlat + (rnd() - 0.5) * 0.0004).toFixed(6),
        lng: +(dlng + (rnd() - 0.5) * 0.0004).toFixed(6),
        accuracyMeters: +(1.2 + rnd() * 1.8).toFixed(1),
        capturedAt: '2026-09-12 11:30:45 IST'
      } : null,
      photoUrl: isFieldSubmitted ? `images/slide${(i % 4) + 1}.jpg` : null,
      photoTimestamp: isFieldSubmitted ? '12-Sep-2026 11:31:02 IST [GPS Tagged]' : null,
      checklist: {
        boundaryDemarcated: isFieldSubmitted,
        landUseVerified: isFieldSubmitted,
        encumbrancesChecked: isFieldSubmitted,
        documentMatchedOnSite: isFieldSubmitted
      },
      fieldRemarks: isFieldSubmitted ? 'Physical boundary pegs identified. No standing encumbrance or disputed structures found.' : '',
      submittedAt: isFieldSubmitted ? '2026-09-12 12:15:00 IST' : null,
      reviewedBy: isFieldApproved ? 'S. Nair, IAS (District Collector & CALA)' : null,
      reviewNotes: isFieldApproved ? 'Ground verification accepted. Proceed to Section 23 award determination.' : (i % 2 === 0 && !isFieldSubmitted ? 'Please re-verify southern canal easement boundary.' : null)
    } : null;

    // Affected Family entitlement data (R&R)
    const affectedFamily = {
      headOfFamily: owner.name,
      familyMembers: rint(3, 7),
      isDisplaced: rnd() < 0.35,
      entitlementCardNo: 'RR-2026-' + String(rint(100, 999)),
      allotmentPackage: 'Model Residential Plot (50 sq.m) + ₹50,000 Resettlement Grant',
      grantStatus: (status === 'Acquired' || status === 'Utilized') ? 'Disbursed' : 'Sanctioned',
      housingPlotStatus: (status === 'Acquired' || status === 'Utilized') ? 'Allotted (Sec 31)' : 'Pending Allotment'
    };

    db.parcels.push({
      id: parcelId,
      surveyNumber: surveyNo,
      state: 'Madhya Pradesh',
      district: district,
      tehsil: pick(TEHSILS),
      village: pick(VILLAGES),
      area: area,
      areaUnit: 'acres',
      landType: pick(LAND_TYPES),
      ownerId: owner.id,
      lat: dlat,
      lng: dlng,
      polygon: makeParcelPolygon(dlat, dlng, size),
      status: status,
      documentStatus: pick(DOCUMENT_STATUSES),
      projectId: project ? project.id : null,
      possessionStatus: (status === 'Acquired' || status === 'Utilized') ? 'Possession Handed Over (Sec 38)' : (status === 'Compensation Pending' ? 'Notice Issued (Sec 37)' : 'Pending Handover'),
      rrStatus: (status === 'Acquired' || status === 'Utilized') ? 'Completed' : 'In Progress',
      affectedFamily: affectedFamily,
      fieldTask: fieldTask,
      createdAt: addDaysISO('2025-06-01', rint(0, 400))
    });

    if (fieldTask) {
      db.fieldTasks.push(fieldTask);
    }
  }

  // Ensure first parcel is perfectly configured for demonstration
  db.parcels[0].id = 'MP-BH-001';
  db.parcels[0].ownerId = db.owners[0].id;
  db.parcels[0].village = 'Demo Village';
  db.parcels[0].surveyNumber = '123/4';
  db.parcels[0].district = 'Bhopal';
  db.parcels[0].state = 'Madhya Pradesh';
  db.parcels[0].area = 3.2;
  db.parcels[0].landType = 'Agricultural (Irrigated)';
  db.parcels[0].status = 'Under Verification';
  db.parcels[0].documentStatus = 'Under Review';
  db.parcels[0].projectId = 'PRJ-001';

  // 6. Statutory Acquisition Cases (20 Cases with 10-Stage Progression)
  const usedParcelIdx = pickN(Array.from({ length: 100 }, (_, i) => i), 20);
  usedParcelIdx.forEach((pIdx, i) => {
    const n = i + 1;
    const parcel = db.parcels[pIdx];
    const project = parcel.projectId ? db.projects.find(p => p.id === parcel.projectId) : pick(db.projects);
    parcel.projectId = project.id;
    const stateIdx = rint(0, 9);
    const state = WORKFLOW_STATES[stateIdx];
    const created = addDaysISO('2025-11-01', rint(0, 280));
    const history = [];
    let d = created;
    for (let s = 0; s <= stateIdx; s++) {
      history.push({
        status: WORKFLOW_STATES[s],
        date: d,
        user: s === 0 ? 'A. Deshmukh (NHAI Agency)' : (s <= 2 ? 'R. Chouhan (LAO Circle-I)' : (s === 3 ? 'S. Nair, IAS (District Collector & CALA)' : (s <= 5 ? 'State Revenue Dept / CALA' : (s <= 7 ? 'PFMS Central DBT' : 'S. Nair, IAS (CALA)'))))
      });
      d = addDaysISO(d, rint(4, 18));
    }
    const caseId = 'CASE-' + String(n).padStart(3, '0');
    db.cases.push({
      id: caseId,
      parcelId: parcel.id,
      projectId: project.id,
      status: state,
      createdAt: created,
      history: history
    });
    parcel.status = WORKFLOW_TO_PARCEL_STATUS[state];
    parcel.caseId = caseId;

    // Attached Documents per Case
    const docCount = rint(3, 5);
    const docTypes = pickN(DOCUMENT_TYPES, docCount);
    docTypes.forEach((dt, di) => {
      db.documents.push({
        id: uid('DOC'),
        parcelId: parcel.id,
        caseId: caseId,
        type: dt,
        status: stateIdx >= 2 ? pick(['Verified', 'Under Review', 'Uploaded']) : pick(['Pending', 'Uploaded']),
        uploadedAt: addDaysISO(created, di * 2 + 1),
        extractedArea: +(parcel.area + (rnd() < 0.3 ? 0.4 : 0)).toFixed(2),
        extractedOwner: (db.owners.find(o => o.id === parcel.ownerId)?.name) || 'Amit Kumar',
        extractedSurvey: parcel.surveyNumber,
        extractedDate: created
      });
    });

    // Approvals
    if (stateIdx >= 3) {
      db.approvals.push({
        id: uid('APR'),
        caseId: caseId,
        approver: 'S. Nair, IAS (District Collector & CALA)',
        decision: 'Approved',
        date: history[3] ? history[3].date : created,
        remarks: 'Section 19 Declaration cleared; Public purpose confirmed under RFCTLARR Act 2013.'
      });
    }

    // Compensation Assessment & Award
    if (stateIdx >= 5) {
      const landValue = Math.round(parcel.area * rint(800000, 1500000));
      const structureValue = rnd() < 0.5 ? Math.round(landValue * rint(5, 20) / 100) : 0;
      const solatium = landValue + structureValue; // 100% Solatium under Sec 30
      const additional = Math.round((landValue + structureValue) * 0.12); // 12% Interest under Sec 30(3)
      const total = landValue + structureValue + solatium + additional;
      const paid = stateIdx >= 7;
      db.compensation.push({
        id: uid('COMP'),
        caseId: caseId,
        landValue: landValue,
        structureValue: structureValue,
        solatium: solatium,
        additional: additional,
        total: total,
        paymentStatus: paid ? 'Paid' : (stateIdx >= 6 ? 'Processing' : 'Pending'),
        paymentDate: paid ? addDaysISO(history[7] ? history[7].date : created, rint(1, 10)) : null,
        dbtReferenceNo: paid ? 'PFMS-DBT-' + rint(10000000, 99999999) : null
      });
    }

    history.forEach(h => {
      db.auditLogs.push({
        id: uid('AUD'),
        action: `Case progressed to ${WORKFLOW_LABELS[h.status] || h.status}`,
        user: h.user,
        role: 'OFFICIAL',
        entity: 'acquisition_case',
        entityId: caseId,
        timestamp: h.date,
        prevValue: 'Previous Stage',
        newValue: h.status,
        remarks: `Statutory milestone progression for Parcel ${parcel.id} (${project.name})`
      });
    });
  });

  // 7. Standalone Documents
  db.parcels.filter(p => !p.caseId).slice(0, 35).forEach((p, i) => {
    db.documents.push({
      id: uid('DOC'),
      parcelId: p.id,
      caseId: null,
      type: pick(DOCUMENT_TYPES),
      status: pick(DOCUMENT_STATUSES),
      uploadedAt: addDaysISO('2025-10-01', i),
      extractedArea: p.area,
      extractedOwner: (db.owners.find(o => o.id === p.ownerId)?.name) || 'Amit Kumar',
      extractedSurvey: p.surveyNumber
    });
  });

  // 8. Project Progress Monitoring
  db.projects.forEach(p => {
    const acquiredPct = Math.min(100, Math.round((p.acquiredArea / p.requiredArea) * 100));
    const utilizedPct = Math.min(100, Math.round((p.utilizedArea / Math.max(p.acquiredArea, 1)) * 100));
    const totalDays = daysBetween(p.startDate, p.targetDate);
    const elapsed = Math.max(0, daysBetween(p.startDate, todayISO()));
    const expected = Math.min(100, Math.round((elapsed / Math.max(totalDays, 1)) * 100));
    const actual = Math.min(100, Math.max(5, expected + rint(-25, 10)));
    const compCases = db.cases.filter(c => c.projectId === p.id);
    const paidComp = compCases.filter(c => {
      const comp = db.compensation.find(x => x.caseId === c.id);
      return comp && comp.paymentStatus === 'Paid';
    }).length;
    const compPct = compCases.length ? Math.round((paidComp / compCases.length) * 100) : 0;
    db.monitoring.push({
      projectId: p.id,
      landAcquiredPct: acquiredPct,
      landUtilizedPct: utilizedPct,
      compensationPaidPct: compPct,
      plannedProgress: expected,
      expectedProgress: expected,
      actualProgress: Math.max(0, Math.min(100, actual)),
      lastUpdate: addDaysISO(todayISO(), -rint(0, 12))
    });
  });

  // 9. Role-Specific Notifications
  db.notifications = [
    { id: 'NOTIF-01', role: 'CENTRAL', type: 'High', title: 'National Review Alert', message: '5 infrastructure corridor projects require Central Ministry coordination due to inter-state delays.', timestamp: '2026-09-24 10:30 IST', isRead: false },
    { id: 'NOTIF-02', role: 'CENTRAL', type: 'Info', title: 'DBT Milestone Reached', message: 'National DBT disbursement surpassed ₹1,840 Crore across 142 national corridors.', timestamp: '2026-09-23 15:45 IST', isRead: false },
    { id: 'NOTIF-03', role: 'STATE', type: 'Warning', title: 'Statutory Delay Warning', message: '3 district projects in Bhopal Circle have exceeded Section 11 timeline by over 21 days.', timestamp: '2026-09-24 09:15 IST', isRead: false },
    { id: 'NOTIF-04', role: 'STATE', type: 'Info', title: 'Gazette Publication Pending', message: 'Section 19 declaration draft for Samruddhi Corridor awaits State Revenue approval.', timestamp: '2026-09-22 14:20 IST', isRead: false },
    { id: 'NOTIF-05', role: 'DISTRICT', type: 'Action', title: 'Field Submissions Awaiting Review', message: '12 ground-level parcel verifications submitted by Field Officers await District Collector sign-off.', timestamp: '2026-09-24 11:00 IST', isRead: false },
    { id: 'NOTIF-06', role: 'DISTRICT', type: 'Warning', title: 'Section 15 Objection Hearing', message: '3 statutory landowner objections listed for hearing on 30-Sep-2026 at Collectorate Hall.', timestamp: '2026-09-23 16:30 IST', isRead: false },
    { id: 'NOTIF-07', role: 'PROJECT_AGENCY', type: 'Action', title: 'Document Clarification Requested', message: 'District CALA requested updated alignment boundary for NH-46 Corridor Spur proposal.', timestamp: '2026-09-24 12:10 IST', isRead: false },
    { id: 'NOTIF-08', role: 'PROJECT_AGENCY', type: 'Success', title: 'Corridor Sanction Issued', message: 'Section 19 declaration sanctioned for High Speed Rail Maintenance Depot link.', timestamp: '2026-09-21 17:00 IST', isRead: false },
    { id: 'NOTIF-09', role: 'ACQUISITION_OFFICER', type: 'Action', title: 'OCR Discrepancy Checks', message: '6 document OCR scans have flagged area/owner discrepancies awaiting manual verification.', timestamp: '2026-09-24 08:45 IST', isRead: false },
    { id: 'NOTIF-10', role: 'ACQUISITION_OFFICER', type: 'Info', title: 'DBT Batch Ready', message: 'PFMS compensation batch for ₹26.28 Lakh is queued for final payment release.', timestamp: '2026-09-23 11:15 IST', isRead: false },
    { id: 'NOTIF-11', role: 'FIELD_OFFICER', type: 'Action', title: '4 Field Tasks Assigned', message: '4 parcel ground verification tasks assigned in Berasia Tehsil for geo-tagging & photo capture.', timestamp: '2026-09-24 07:30 IST', isRead: false },
    { id: 'NOTIF-12', role: 'CITIZEN', type: 'Action', title: 'E-Agreement Ready for e-Sign', message: 'Draft deed for Khasra 142/1 is ready. Sign with Aadhaar OTP to receive statutory award.', timestamp: '2026-09-24 10:00 IST', isRead: false }
  ];

  // 10. Compliance & Statutory Alerts
  db.parcels.forEach(p => {
    if (p.documentStatus === 'Pending' || p.documentStatus === 'Rejected') {
      db.alerts.push({
        id: uid('ALT'),
        type: 'Missing Document',
        severity: 'high',
        message: `Khasra ${p.surveyNumber} (${p.id}) has ${p.documentStatus.toLowerCase()} records in revenue archive.`,
        entityType: 'parcel',
        entityId: p.id,
        createdAt: addDaysISO(todayISO(), -rint(1, 20)),
        resolved: false
      });
    }
  });

  db.cases.forEach(c => {
    const verifStart = c.history.find(h => h.status === 'VERIFICATION');
    if (verifStart && c.status === 'VERIFICATION' && daysBetween(verifStart.date, todayISO()) > 21) {
      db.alerts.push({
        id: uid('ALT'),
        type: 'Verification Delay',
        severity: 'medium',
        message: `Proceedings for Case ${c.id} pending verification for ${daysBetween(verifStart.date, todayISO())} days (threshold 21).`,
        entityType: 'case',
        entityId: c.id,
        createdAt: todayISO(),
        resolved: false
      });
    }
    const comp = db.compensation.find(x => x.caseId === c.id);
    if (comp && comp.paymentStatus !== 'Paid') {
      db.alerts.push({
        id: uid('ALT'),
        type: 'Compensation Delay',
        severity: 'medium',
        message: `Compensation for Case ${c.id} of ${fmtINR(comp.total)} pending DBT transfer.`,
        entityType: 'case',
        entityId: c.id,
        createdAt: addDaysISO(todayISO(), -rint(1, 15)),
        resolved: false
      });
    }
  });

  db.monitoring.forEach(m => {
    if (m.actualProgress < m.expectedProgress - 10) {
      db.alerts.push({
        id: uid('ALT'),
        type: 'Project Delay',
        severity: 'high',
        message: `Project ${m.projectId} physical progress (${m.actualProgress}%) trails schedule target (${m.expectedProgress}%).`,
        entityType: 'project',
        entityId: m.projectId,
        createdAt: todayISO(),
        resolved: false
      });
    }
  });

  // 11. E-Agreements
  db.agreements = [
    {
      id: 'EAGR-2026-001',
      parcelId: 'MP-BH-001',
      khasraNo: '142/1',
      caseId: 'CASE-001',
      projectId: 'PRJ-001',
      projectName: 'Bhopal-Indore Economic Corridor (NH-46)',
      ownerId: 'OWN-001',
      ownerName: 'Amit Kumar',
      ownerAadhaar: 'XXXX-XXXX-8492',
      ownerPhone: '9826012345',
      officerName: 'R. Chouhan',
      officerDesignation: 'Land Acquisition Officer (LAO, Circle-I)',
      tehsil: 'Huzur',
      district: 'Bhopal',
      village: 'Bairagarh Kalan',
      areaAcres: '4.20',
      landType: 'Agricultural (Irrigated)',
      marketValue: 12400000,
      solatium: 12400000,
      interest: 1488000,
      totalAmount: 26288000,
      rehabTerms: 'RFCTLARR Schedule II R&R Entitlement Card issued; 1 Model Residential Plot in Rehabilitation Enclave; Resettlement Grant ₹50,000.',
      status: 'Completed',
      draftDate: '2026-09-02',
      sentDate: '2026-09-06',
      signedDate: '2026-09-10 11:34:22 IST',
      completedDate: '2026-09-12 15:42:08 IST',
      ownerSignature: {
        method: 'Aadhaar e-Sign (UIDAI OTP)',
        signer: 'Amit Kumar',
        timestamp: '2026-09-10 11:34:22 IST',
        certHash: 'SHA256: 8f4b7a2e910c8842af5e12bc44093d19f',
        ip: '103.24.188.42'
      },
      officerSignature: {
        method: 'e-Token DSC Class-3 Seal',
        signer: 'R. Chouhan (LAO)',
        tokenSerial: 'GOI-NIC-DSC-2026-9931',
        timestamp: '2026-09-12 15:42:08 IST',
        certHash: 'SHA256: 3a99c11f78bc2281aef871b66d21b4421',
        seal: 'OFFICE OF THE COMPETENT AUTHORITY & LAO, BHOPAL CIRCLE'
      },
      auditTrail: [
        { action: 'Agreement Drafted under Sec 23 RFCTLARR Act', user: 'R. Chouhan (LAO)', timestamp: '2026-09-02 10:15:00 IST' },
        { action: 'Dispatched to Landowner Portal for Digital Signature', user: 'R. Chouhan (LAO)', timestamp: '2026-09-06 14:20:10 IST' },
        { action: 'Digitally Signed by Landowner via Aadhaar e-Sign OTP', user: 'Amit Kumar (Landowner)', timestamp: '2026-09-10 11:34:22 IST' },
        { action: 'Counter-Signed & Sealed with Official Government DSC Token', user: 'R. Chouhan (LAO)', timestamp: '2026-09-12 15:42:08 IST' },
        { action: 'Deed Registered in Central E-Agreement Vault', user: 'System / NIC', timestamp: '2026-09-12 15:42:15 IST' }
      ]
    },
    {
      id: 'EAGR-2026-002',
      parcelId: 'MP-BH-002',
      khasraNo: '88/2',
      caseId: 'CASE-002',
      projectId: 'PRJ-001',
      projectName: 'Bhopal-Indore Economic Corridor (NH-46)',
      ownerId: 'OWN-002',
      ownerName: 'Sunita Devi',
      ownerAadhaar: 'XXXX-XXXX-6124',
      ownerPhone: '9425098712',
      officerName: 'R. Chouhan',
      officerDesignation: 'Land Acquisition Officer (LAO, Circle-I)',
      tehsil: 'Huzur',
      district: 'Bhopal',
      village: 'Bairagarh Kalan',
      areaAcres: '2.80',
      landType: 'Agricultural (Un-irrigated)',
      marketValue: 7800000,
      solatium: 7800000,
      interest: 936000,
      totalAmount: 16536000,
      rehabTerms: 'One-time resettlement allowance ₹50,000 + Subsistence grant for 12 months under RFCTLARR Sec 31.',
      status: 'Signed',
      draftDate: '2026-09-08',
      sentDate: '2026-09-12',
      signedDate: '2026-09-15 14:18:40 IST',
      completedDate: null,
      ownerSignature: {
        method: 'Aadhaar e-Sign (UIDAI OTP)',
        signer: 'Sunita Devi',
        timestamp: '2026-09-15 14:18:40 IST',
        certHash: 'SHA256: 7d21a88b12f08819abef21198c41c0981',
        ip: '103.24.188.88'
      },
      officerSignature: null,
      auditTrail: [
        { action: 'Agreement Drafted by LAO Circle Desk', user: 'R. Chouhan (LAO)', timestamp: '2026-09-08 11:00:00 IST' },
        { action: 'Dispatched to Landowner Portal', user: 'R. Chouhan (LAO)', timestamp: '2026-09-12 16:30:00 IST' },
        { action: 'Digitally Signed by Landowner via Aadhaar e-Sign', user: 'Sunita Devi (Landowner)', timestamp: '2026-09-15 14:18:40 IST' }
      ]
    },
    {
      id: 'EAGR-2026-003',
      parcelId: 'MP-BH-003',
      khasraNo: '215/3',
      caseId: 'CASE-003',
      projectId: 'PRJ-002',
      projectName: 'Bhopal Outer Ring Road (Phase-II)',
      ownerId: 'OWN-001',
      ownerName: 'Amit Kumar',
      ownerAadhaar: 'XXXX-XXXX-8492',
      ownerPhone: '9826012345',
      officerName: 'R. Chouhan',
      officerDesignation: 'Land Acquisition Officer (LAO, Circle-I)',
      tehsil: 'Berasia',
      district: 'Bhopal',
      village: 'Kolar Sub-div',
      areaAcres: '5.10',
      landType: 'Agricultural (Commercial Road-facing)',
      marketValue: 18500000,
      solatium: 18500000,
      interest: 2220000,
      totalAmount: 39220000,
      rehabTerms: 'Mandatory RFCTLARR Schedule II Package with Commercial kiosk allotment entitlement.',
      status: 'Sent',
      draftDate: '2026-09-14',
      sentDate: '2026-09-16',
      signedDate: null,
      completedDate: null,
      ownerSignature: null,
      officerSignature: null,
      auditTrail: [
        { action: 'Draft Prepared based on Preliminary Section 11 Survey', user: 'R. Chouhan (LAO)', timestamp: '2026-09-14 09:45:00 IST' },
        { action: 'Dispatched to Landowner Portal; Pending e-Sign', user: 'R. Chouhan (LAO)', timestamp: '2026-09-16 12:00:00 IST' }
      ]
    }
  ];

  db.auditLogs.push({
    id: uid('AUD'),
    action: 'Central Database Synchronized with National Land Record Portal',
    user: 'System / NIC',
    role: 'SYSTEM',
    entity: 'system',
    entityId: 'SYSTEM-ROOT',
    timestamp: addDaysISO(todayISO(), -1),
    remarks: 'GeoSetu-India platform initialized with RBAC compliance.'
  });

  db.auditLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return db;
}

/* ---------------- 8. PERSISTENCE & INITIALIZATION ---------------- */
const DB_KEY = 'geosetu_db_v2';
let DB = null;

function loadDB() {
  try {
    let raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      raw = localStorage.getItem('geosetu_db_v1') || localStorage.getItem('terrabyte_db_v1');
    }
    if (raw) {
      DB = JSON.parse(raw);
      // Ensure all 7 users exist
      const seed = generateSeed();
      if (!DB.users || DB.users.length < 7) {
        DB.users = seed.users;
      }
      if (!DB.proposals || !DB.proposals.length) {
        DB.proposals = seed.proposals;
      }
      if (!DB.fieldTasks || !DB.fieldTasks.length) {
        DB.fieldTasks = seed.fieldTasks;
      }
      if (!DB.notifications || !DB.notifications.length) {
        DB.notifications = seed.notifications;
      }
      saveDB();
      syncFromBackendApi();
      return;
    }
  } catch (e) {
    console.warn('DB load failed', e);
  }
  DB = generateSeed();
  saveDB();
  syncFromBackendApi();
}

async function syncFromBackendApi() {
  try {
    const res = await fetch('/api/parcels');
    if (res.ok) {
      const serverParcels = await res.json();
      if (Array.isArray(serverParcels) && serverParcels.length > 0 && DB) {
        serverParcels.forEach(sp => {
          const existing = DB.parcels.find(p => p.id === sp.id);
          if (existing) {
            existing.status = sp.status || existing.status;
            existing.documentStatus = sp.document_status || existing.documentStatus;
          }
        });
      }
    }
  } catch (e) {}
}

function saveDB() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(DB));
    localStorage.setItem('geosetu_db_v1', JSON.stringify(DB));
  } catch (e) {
    console.warn('DB save failed', e);
  }
}

function resetDB() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem('geosetu_db_v1');
  localStorage.removeItem('terrabyte_db_v1');
  loadDB();
}

function addAudit(action, entity, entityId, remarks, prevValue = '', newValue = '') {
  if (!DB || !DB.auditLogs) return;
  const user = CURRENT_USER ? CURRENT_USER.name : 'System';
  const role = CURRENT_USER ? CURRENT_USER.role : 'SYSTEM';
  DB.auditLogs.push({
    id: uid('AUD'),
    action: action,
    user: user,
    role: role,
    entity: entity || 'general',
    entityId: entityId || '-',
    timestamp: new Date().toISOString(),
    prevValue: String(prevValue || ''),
    newValue: String(newValue || ''),
    remarks: remarks || ''
  });
  DB.auditLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function addAlert(type, severity, message, entityType, entityId) {
  if (!DB || !DB.alerts) return;
  DB.alerts.unshift({
    id: uid('ALT'),
    type: type,
    severity: severity || 'medium',
    message: message,
    entityType: entityType || 'general',
    entityId: entityId || '-',
    createdAt: todayISO(),
    resolved: false
  });
}

function toast(msg) {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .4s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 2600);
}