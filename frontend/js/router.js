/* ==========================================================================
   GeoSetu-India (भूसेतु-भारत) — RBAC ROUTER & NAVIGATION ENGINE
   Role-Based Access Control, Route Guards & GIGW 3.0 Accessible Interface
   ========================================================================== */

const NAV_ITEMS = [
  {
    id: 'overview',
    groupKey: 'group_overview',
    groupFallback: 'Overview',
    items: [
      { key: 'dashboard', i18nKey: 'item_dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', ico: '▣', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', 'FIELD_OFFICER'] },
      { key: 'my-land', i18nKey: 'item_my_land', labelEn: 'My Land (Khatedar)', labelHi: 'मेरी भूमि (खातेदार)', ico: '⌂', roles: ['CITIZEN'] },
      { key: 'e-agreements', i18nKey: 'item_my_agreements', labelEn: 'My E-Agreements', labelHi: 'मेरे ई-समझौते', ico: '✍', roles: ['CITIZEN'] },
    ]
  },
  {
    id: 'field_ops',
    groupKey: 'group_field_ops',
    groupFallback: 'Field Operations',
    items: [
      { key: 'field-tasks', i18nKey: 'item_field_tasks', labelEn: 'Field Verification Tasks', labelHi: 'क्षेत्रीय सत्यापन कार्य', ico: '📍', roles: ['FIELD_OFFICER', 'DISTRICT'] },
      { key: 'field-review', i18nKey: 'item_field_review', labelEn: 'Field Submission Review', labelHi: 'क्षेत्रीय रिपोर्ट समीक्षा', ico: '📋', roles: ['DISTRICT', 'ACQUISITION_OFFICER', 'STATE', 'CENTRAL'] },
    ]
  },
  {
    id: 'records',
    groupKey: 'group_records',
    groupFallback: 'Land Records',
    items: [
      { key: 'map', i18nKey: 'item_map', labelEn: 'GIS Cadastral Map', labelHi: 'भू-स्थानिक नक्शा', ico: '⚑', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', 'FIELD_OFFICER', 'CITIZEN'] },
      { key: 'parcels', i18nKey: 'item_parcels', labelEn: 'Land Parcels (Khasra)', labelHi: 'खसरा / भूखंड', ico: '▦', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', 'FIELD_OFFICER'] },
    ]
  },
  {
    id: 'acquisition',
    groupKey: 'group_acquisition',
    groupFallback: 'Acquisition Workflow',
    items: [
      { key: 'proposals', i18nKey: 'item_proposals', labelEn: 'Project Proposals', labelHi: 'परियोजना प्रस्ताव', ico: '📥', roles: ['PROJECT_AGENCY', 'STATE', 'DISTRICT', 'CENTRAL'] },
      { key: 'cases', i18nKey: 'item_cases', labelEn: 'Acquisition Cases', labelHi: 'अधिग्रहण प्रकरण', ico: '◧', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER'] },
      { key: 'documents', i18nKey: 'item_documents', labelEn: 'Document Verification', labelHi: 'दस्तावेज़ सत्यापन', ico: '▤', roles: ['DISTRICT', 'ACQUISITION_OFFICER', 'STATE', 'CENTRAL'] },
      { key: 'e-agreements', i18nKey: 'item_agreements', labelEn: 'E-Agreements & Deeds', labelHi: 'ई-समझौता विलेख', ico: '✍', roles: ['ACQUISITION_OFFICER', 'DISTRICT', 'PROJECT_AGENCY'] },
      { key: 'approvals', i18nKey: 'item_approvals', labelEn: 'Sanctions & NOC', labelHi: 'अनुमोदन व अनापत्ति', ico: '✓', roles: ['STATE', 'DISTRICT', 'PROJECT_AGENCY', 'CENTRAL'] },
      { key: 'compensation', i18nKey: 'item_compensation', labelEn: 'Compensation & DBT', labelHi: 'प्रतिकर एवं डीबीटी', ico: '₹', roles: ['DISTRICT', 'ACQUISITION_OFFICER', 'STATE', 'CENTRAL', 'PROJECT_AGENCY'] },
      { key: 'possession-rr', i18nKey: 'item_possession_rr', labelEn: 'Possession & R&R', labelHi: 'कब्जा एवं पुनर्वासन', ico: '🏘️', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'ACQUISITION_OFFICER', 'PROJECT_AGENCY'] },
    ]
  },
  {
    id: 'projects',
    groupKey: 'group_projects',
    groupFallback: 'Projects & Planning',
    items: [
      { key: 'projects', i18nKey: 'item_projects', labelEn: 'Infrastructure Corridors', labelHi: 'अवसंरचना गलियारे', ico: '◆', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY'] },
      { key: 'monitoring', i18nKey: 'item_monitoring', labelEn: 'Progress Monitoring', labelHi: 'प्रगति निगरानी', ico: '◔', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY'] },
    ]
  },
  {
    id: 'decision',
    groupKey: 'group_decision',
    groupFallback: 'Decision Support & AI',
    items: [
      { key: 'bottlenecks', i18nKey: 'item_bottlenecks', labelEn: 'AI Bottleneck Radar', labelHi: 'एआई गतिरोध पहचान', ico: '⚡', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'ACQUISITION_OFFICER', 'PROJECT_AGENCY'] },
      { key: 'decision-support', i18nKey: 'item_decision_support', labelEn: 'Decision Support DSS', labelHi: 'निर्णय सहायता', ico: '⚖', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY'] },
      { key: 'reports', i18nKey: 'item_reports', labelEn: 'Executive MIS Reports', labelHi: 'कार्यकारी एमआईएस रिपोर्ट', ico: '📊', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY'] },
    ]
  },
  {
    id: 'oversight',
    groupKey: 'group_oversight',
    groupFallback: 'Oversight & Admin',
    items: [
      { key: 'alerts', i18nKey: 'item_alerts', labelEn: 'Compliance Alerts', labelHi: 'सतर्कता सूचनाएं', ico: '!', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'ACQUISITION_OFFICER', 'PROJECT_AGENCY'] },
      { key: 'notifications', i18nKey: 'item_notifications', labelEn: 'Role Notifications', labelHi: 'भूमिका सूचनाएं', ico: '🔔', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', 'FIELD_OFFICER', 'CITIZEN'] },
      { key: 'audit', i18nKey: 'item_audit', labelEn: 'Audit Trail', labelHi: 'ऑडिट ट्रेल', ico: '≡', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'ACQUISITION_OFFICER'] },
      { key: 'ai', i18nKey: 'item_ai', labelEn: 'AI Legal Assistant', labelHi: 'एआई सहायक', ico: '✦', roles: ['CENTRAL', 'STATE', 'DISTRICT', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER'] },
      { key: 'users', i18nKey: 'item_users', labelEn: 'User Roles & Access', labelHi: 'प्रयोक्ता प्रबंधन', ico: '☰', roles: ['CENTRAL', 'STATE', 'DISTRICT'] },
    ]
  },
];

function canSee(itemRoles) {
  if (!CURRENT_USER || !CURRENT_USER.role) return false;
  const userRole = normalizeRole(CURRENT_USER.role);
  const normalizedRequired = itemRoles.map(r => normalizeRole(r));
  return normalizedRequired.includes(userRole);
}

// Role-tailored pinned shortcuts
const ROLE_PINNED_ROUTES = {
  CENTRAL: ['dashboard', 'map', 'bottlenecks', 'reports'],
  STATE: ['dashboard', 'map', 'approvals', 'bottlenecks'],
  DISTRICT: ['dashboard', 'field-review', 'cases', 'map'],
  PROJECT_AGENCY: ['dashboard', 'proposals', 'projects', 'map'],
  ACQUISITION_OFFICER: ['dashboard', 'documents', 'cases', 'compensation'],
  FIELD_OFFICER: ['dashboard', 'field-tasks', 'map'],
  CITIZEN: ['my-land', 'e-agreements'],
  // Aliases
  ADMIN: ['dashboard', 'field-review', 'cases', 'map'],
  LAND_OFFICER: ['dashboard', 'documents', 'cases', 'compensation'],
  PROJECT_AUTHORITY: ['dashboard', 'proposals', 'projects', 'map'],
  LAND_OWNER: ['my-land', 'e-agreements']
};

// Collapsible group state tracking
let sidebarExpandedGroups = new Set();
let sidebarSearchQuery = '';

function initSidebarGroupStates() {
  if (sidebarExpandedGroups.size > 0) return;
  const role = normalizeRole(CURRENT_USER?.role || 'DISTRICT');
  sidebarExpandedGroups.add('overview');
  if (role === 'FIELD_OFFICER') {
    sidebarExpandedGroups.add('field_ops');
  } else if (role === 'PROJECT_AGENCY') {
    sidebarExpandedGroups.add('projects');
    sidebarExpandedGroups.add('acquisition');
  } else if (role === 'ACQUISITION_OFFICER' || role === 'DISTRICT') {
    sidebarExpandedGroups.add('acquisition');
    sidebarExpandedGroups.add('field_ops');
  } else if (role === 'CENTRAL' || role === 'STATE') {
    sidebarExpandedGroups.add('decision');
    sidebarExpandedGroups.add('projects');
  }
}

function toggleNavGroup(groupId) {
  if (sidebarExpandedGroups.has(groupId)) {
    sidebarExpandedGroups.delete(groupId);
  } else {
    sidebarExpandedGroups.add(groupId);
  }
  const groupEl = document.querySelector(`.nav-group[data-group-id="${groupId}"]`);
  if (groupEl) {
    groupEl.classList.toggle('collapsed', !sidebarExpandedGroups.has(groupId));
  }
}

function filterSidebarNav(query) {
  sidebarSearchQuery = (query || '').trim().toLowerCase();
  const searchInput = document.getElementById('sidebar-search');
  if (searchInput && searchInput.value !== query) {
    searchInput.value = query;
  }

  const noResultsEl = document.getElementById('sidebar-no-results');
  let totalVisible = 0;

  NAV_ITEMS.forEach(g => {
    const groupEl = document.querySelector(`.nav-group[data-group-id="${g.id}"]`);
    if (!groupEl) return;
    
    let groupMatches = 0;
    const items = groupEl.querySelectorAll('.nav-item');
    items.forEach(item => {
      const routeKey = item.dataset.route || '';
      const label = item.textContent.toLowerCase();
      const match = !sidebarSearchQuery || 
                    label.includes(sidebarSearchQuery) || 
                    routeKey.toLowerCase().includes(sidebarSearchQuery);
      item.style.display = match ? 'flex' : 'none';
      if (match) groupMatches++;
    });

    if (sidebarSearchQuery) {
      if (groupMatches > 0) {
        groupEl.style.display = 'block';
        groupEl.classList.remove('collapsed');
      } else {
        groupEl.style.display = 'none';
      }
    } else {
      groupEl.style.display = 'block';
      groupEl.classList.toggle('collapsed', !sidebarExpandedGroups.has(g.id));
    }
    totalVisible += groupMatches;
  });

  if (noResultsEl) {
    noResultsEl.style.display = (sidebarSearchQuery && totalVisible === 0) ? 'block' : 'none';
  }
}

function getItemLabel(item) {
  if (typeof t === 'function') {
    const def = (typeof currentLang !== 'undefined' && currentLang === 'hi') ? item.labelHi : item.labelEn;
    return t(item.i18nKey, def);
  }
  return (typeof currentLang !== 'undefined' && currentLang === 'hi') ? item.labelHi : item.labelEn;
}

function getGroupLabel(g) {
  if (typeof t === 'function') {
    return t(g.groupKey, g.groupFallback);
  }
  return g.groupFallback;
}

function renderSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;

  initSidebarGroupStates();

  const portalBrand = (typeof t === 'function') ? t('portal_brand', 'GeoSetu-India') : 'GeoSetu-India';
  const roleKey = normalizeRole(CURRENT_USER?.role || 'DISTRICT');
  const roleMeta = ROLES[roleKey] || ROLES.DISTRICT;
  const portalSub = (typeof currentLang !== 'undefined' && currentLang === 'hi') 
    ? `${roleMeta.labelHi || roleMeta.label}` 
    : `${roleMeta.label}`;

  let html = `
    <div class="sidebar-header">
      <div class="sidebar-emblem">GS</div>
      <div>
        <div class="sidebar-title">${portalBrand}</div>
        <div class="sidebar-sub" style="font-size:10px;line-height:1.3;color:#94a3b8;">${portalSub}</div>
      </div>
    </div>

    <!-- Sidebar Search Box -->
    <div class="sidebar-search-box">
      <span class="sidebar-search-icon" aria-hidden="true">🔍</span>
      <input 
        type="text" 
        id="sidebar-search" 
        class="sidebar-search-input" 
        placeholder="${(typeof t === 'function') ? t('sidebar_search_placeholder', 'Search navigation...') : 'Search navigation...'}"
        value="${sidebarSearchQuery}"
        oninput="filterSidebarNav(this.value)"
        aria-label="Filter navigation items"
      />
    </div>
  `;

  // Frequently Used / Pinned Mini-Section
  const pinnedKeys = ROLE_PINNED_ROUTES[roleKey] || ['dashboard', 'cases'];
  const allItems = NAV_ITEMS.flatMap(g => g.items);
  const pinnedItems = pinnedKeys.map(k => allItems.find(i => i.key === k)).filter(Boolean).filter(i => canSee(i.roles));

  if (pinnedItems.length > 0 && !sidebarSearchQuery) {
    const pinnedTitle = (typeof t === 'function') ? t('group_pinned', 'Frequently Used') : 'Frequently Used';
    html += `
      <div class="sidebar-pinned">
        <div class="sidebar-pinned-title">
          <span>★</span> ${pinnedTitle}
        </div>
        <div class="sidebar-pinned-chips">
          ${pinnedItems.map(p => `
            <div class="sidebar-pinned-item ${CURRENT_ROUTE.name === p.key ? 'active' : ''}" data-route="${p.key}">
              <span>${p.ico}</span>
              <span>${getItemLabel(p)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // No search results placeholder
  const noMatchesText = (typeof t === 'function') ? t('no_nav_matches', 'No matching menu items found') : 'No matching menu items found';
  html += `<div id="sidebar-no-results" class="sidebar-no-results" style="display:none;">${noMatchesText}</div>`;

  // Collapsible Groups
  NAV_ITEMS.forEach(g => {
    const visible = g.items.filter(i => canSee(i.roles));
    if (!visible.length) return;

    const isCollapsed = !sidebarExpandedGroups.has(g.id);
    html += `
      <div class="nav-group ${isCollapsed ? 'collapsed' : ''}" data-group-id="${g.id}">
        <div class="nav-group-header" onclick="toggleNavGroup('${g.id}')" title="Toggle section">
          <div class="nav-group-title">
            <span>${getGroupLabel(g)}</span>
          </div>
          <div class="nav-group-meta">
            <span class="nav-group-count">${visible.length}</span>
            <span class="nav-group-chevron">▼</span>
          </div>
        </div>
        <div class="nav-group-items">
          ${visible.map(i => `
            <div class="nav-item ${CURRENT_ROUTE.name === i.key ? 'active' : ''}" data-route="${i.key}">
              <span class="nav-ico">${i.ico}</span>
              <span>${getItemLabel(i)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  // System Group
  const systemLabel = (typeof t === 'function') ? t('group_system', 'System') : 'System';
  const resetDataLabel = (typeof t === 'function') ? t('item_reset_data', 'Reset Demo Data') : 'Reset Demo Data';
  html += `
    <div class="nav-group">
      <div class="nav-label">${systemLabel}</div>
      <div class="nav-item" data-action="reset-data">
        <span class="nav-ico">↺</span>
        <span>${resetDataLabel}</span>
      </div>
    </div>
  `;

  el.innerHTML = html;

  // Bind clicks
  el.querySelectorAll('[data-route]').forEach(n => {
    n.addEventListener('click', () => navigate(n.dataset.route));
  });

  const resetBtn = el.querySelector('[data-action="reset-data"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const confirmPrompt = (typeof currentLang !== 'undefined' && currentLang === 'hi')
        ? 'पुष्टि करें: क्या आप सभी डेमो भू-अभिलेखों को मूल स्थिति में पुनर्स्थापित करना चाहते हैं?'
        : 'Confirm: Do you want to reset all demo land acquisition records to original state?';
      if (confirm(confirmPrompt)) {
        resetDB();
        const toastMsg = (typeof currentLang !== 'undefined' && currentLang === 'hi')
          ? 'केंद्रीय डाटाबेस पुनर्स्थापित किया गया।'
          : 'Central demo database restored.';
        toast(toastMsg);
        navigate(CURRENT_ROUTE.name, CURRENT_ROUTE.param);
      }
    });
  }

  // Re-apply search filter if one was active
  if (sidebarSearchQuery) {
    filterSidebarNav(sidebarSearchQuery);
  }
}

/* ---------------- ROUTER & ROUTE GUARDS ---------------- */
let CURRENT_ROUTE = { name: 'dashboard', param: null };

const TITLES = {
  'dashboard': ['Overview', 'Executive Land Acquisition & Decision Support Dashboard'],
  'my-land': ['Citizen Portal', 'My Registered Land Holdings & Khasra'],
  'proposals': ['Project Agency', 'Land Acquisition Project Proposals & Scrutiny'],
  'field-tasks': ['Field Operations', 'Assigned Ground Verification Tasks & Geo-Tagging'],
  'field-verify': ['Field Operations', 'Ground Verification Form & GPS Capture'],
  'field-review': ['District CALA', 'Field Officer Submission Review & Sanction'],
  'possession-rr': ['R&R & Handover', 'Section 38 Physical Possession & R&R Entitlements'],
  'bottlenecks': ['AI Decision Support', 'Machine Learning Bottleneck Radar & Llama 3.2 Synthesis'],
  'reports': ['Executive Reports', 'National & State MIS Land Acquisition Progress Reports'],
  'notifications': ['Communications', 'Role-Aware Notifications & Statutory Alerts'],
  'map': ['GIS System', 'GIS Cadastral Land Parcel Map'],
  'parcels': ['Revenue Records', 'National Land Parcel Registry (Khasra/RoR)'],
  'parcel-detail': ['Revenue Records', 'Cadastral Parcel Dossier'],
  'cases': ['Acquisition Proceedings', 'Statutory Acquisition Cases (RFCTLARR 2013)'],
  'case-detail': ['Acquisition Proceedings', 'Case Proceeding Dossier'],
  'documents': ['Verification Queue', 'Document Verification & Discrepancy Checks'],
  'e-agreements': ['Digital Governance', 'Digital Land Acquisition E-Agreements'],
  'approvals': ['Statutory Clearances', 'Competent Authority Sanctions & NOC'],
  'compensation': ['DBT Disbursal', 'Compensation Award Determination & DBT'],
  'projects': ['National Infrastructure', 'National Infrastructure Priority Corridors'],
  'project-detail': ['National Infrastructure', 'Project Alignment Dossier'],
  'monitoring': ['Physical Progress', 'Acquisition Milestone & Handover Monitoring'],
  'decision-support': ['Decision Support', 'Geospatial Alignment & Parcel Feasibility DSS'],
  'alerts': ['Statutory Vigilance', 'Compliance Alerts & Statutory Delays'],
  'audit': ['Audit Trail', 'Immutable Cryptographic Audit Trail'],
  'ai': ['Digital India AI', 'GeoSetu-India AI Assistant & Legal Enquiry'],
  'users': ['Administration', 'Portal User Roles & Jurisdiction Directory']
};

function navigate(name, param) {
  // Check RBAC route authorization
  if (CURRENT_USER && CURRENT_USER.role) {
    const userRole = normalizeRole(CURRENT_USER.role);
    const navItem = NAV_ITEMS.flatMap(g => g.items).find(i => i.key === name);
    
    // Guard restricted routes
    if (navItem && !canSee(navItem.roles)) {
      const c = document.getElementById('content');
      const roleMeta = ROLES[userRole] || ROLES.DISTRICT;
      const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
      if (c) {
        c.innerHTML = `
          <div class="card stat-card stripe-clay" style="margin:20px 0;padding:28px;text-align:center;">
            <div style="font-size:42px;margin-bottom:8px;">🔒</div>
            <h3 style="color:var(--gov-navy);margin-bottom:6px;">${isHi ? '403 — अप्राधिकृत प्रवेश' : '403 — Unauthorized Module Access'}</h3>
            <p style="font-size:12.5px;color:var(--gov-text-muted);max-width:550px;margin:0 auto 16px;">
              ${isHi 
                ? `आपकी वर्तमान भूमिका <b>(${roleMeta.labelHi || roleMeta.label})</b> के पास इस मॉड्यूल को देखने की सांविधिक अनुमति नहीं है।`
                : `Your current role <b>(${roleMeta.label})</b> does not have statutory clearance to access this module.`}
            </p>
            <button class="btn btn-primary btn-sm" onclick="navigate(defaultRouteFor(CURRENT_USER.role))">
              ${isHi ? 'प्राधिकृत डैशबोर्ड पर वापस जाएं →' : 'Return to Authorized Dashboard →'}
            </button>
          </div>
        `;
      }
      return;
    }
  }

  CURRENT_ROUTE = { name, param };
  document.querySelectorAll('.nav-item, .sidebar-pinned-item').forEach(n => {
    n.classList.toggle('active', n.dataset.route === name);
  });

  const tInfo = (typeof getRouteTitle === 'function') ? getRouteTitle(name) : (TITLES[name] || ['GeoSetu-India', 'Portal']); 
  const crumbEl = document.getElementById('topbar-crumb');
  const titleEl = document.getElementById('topbar-title');
  if (crumbEl) crumbEl.textContent = tInfo[0];
  if (titleEl) titleEl.innerHTML = tInfo[1];

  const c = document.getElementById('content');
  if (c) {
    c.innerHTML = '';
    const renderer = ROUTES[name];
    if (renderer) {
      renderer(c, param);
    } else {
      const notFoundText = (typeof currentLang !== 'undefined' && currentLang === 'hi')
        ? 'अभिलेख उपलब्ध नहीं है'
        : 'Record Not Found';
      c.innerHTML = `<div class="empty">${notFoundText}</div>`;
    }
  }
  
  if (window.MobileLayout && typeof window.MobileLayout.sync === 'function') {
    window.MobileLayout.sync(window.Device ? window.Device.getMode() : 'desktop');
  }

  window.scrollTo(0, 0);
}

const ROUTES = {};

/* ---------------- SHARED RENDER HELPERS ---------------- */
function ownerName(id) { const o = (DB.owners || []).find(x => x.id === id); return o ? o.name : '—'; }
function projectName(id) { const p = (DB.projects || []).find(x => x.id === id); return p ? p.name : '—'; }
function parcelById(id) { return (DB.parcels || []).find(x => x.id === id); }
function caseById(id) { return (DB.cases || []).find(x => x.id === id); }
function projectById(id) { return (DB.projects || []).find(x => x.id === id); }
function docsForCase(id) { return (DB.documents || []).filter(d => d.caseId === id); }
function compForCase(id) { return (DB.compensation || []).find(c => c.caseId === id); }
function approvalsForCase(id) { return (DB.approvals || []).filter(a => a.caseId === id); }

function statCard(label, value, sub, cls, stripeClass) {
  return `
    <div class="card stat-card ${stripeClass || 'stripe-navy'} ${cls || ''}">
      <div class="stat-num">${value}</div>
      <div class="stat-label">${label}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    </div>
  `;
}

function docStatusBadge(s) { return `<span class="${statusBadgeClass(s)}">${s}</span>`; }
function parcelStatusBadge(s) { return `<span class="${statusBadgeClass(s)}">${s}</span>`; }
function workflowBadge(s) { return `<span class="${statusBadgeClass(s)}">${(typeof getWorkflowLabel === 'function') ? getWorkflowLabel(s) : (WORKFLOW_LABELS[s] || s)}</span>`; }

function renderStepper(currentState) {
  const normState = currentState || 'PROPOSAL';
  const idx = WORKFLOW_STATES.indexOf(normState);
  return `<div class="stepper">${WORKFLOW_STATES.map((s, i) => {
    const cls = i < idx ? 'done' : (i === idx ? 'current' : '');
    const label = (typeof getWorkflowLabel === 'function') ? getWorkflowLabel(s) : (WORKFLOW_LABELS[s] || s);
    return `<div class="step ${cls}"><span class="dot"></span><span class="step-label">${label}</span></div>` + (i < WORKFLOW_STATES.length - 1 ? '<div class="step-connector"></div>' : '');
  }).join('')}</div>`;
}

function openModal(innerHtml) {
  const root = document.getElementById('modal-root');
  if (!root) return;
  root.innerHTML = `<div class="modal-bg" id="modal-bg"><div class="modal">${innerHtml}</div></div>`;
  root.querySelector('#modal-bg').addEventListener('click', (e) => { if (e.target.id === 'modal-bg') closeModal(); });
}

function closeModal() {
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = '';
}