/* ==========================================================================
   GeoSetu-India (भूसेतु-भारत) — ROLE-AWARE DASHBOARD SYSTEM
   Specialized Executive Dashboards for Central, State, District, Project Agency,
   Acquisition Officer, Field Officer & Citizen Roles
   ========================================================================== */

ROUTES['dashboard'] = function(c) {
  const userRole = normalizeRole(CURRENT_USER?.role || 'DISTRICT');
  
  if (userRole === 'CENTRAL') {
    renderCentralDashboard(c);
  } else if (userRole === 'STATE') {
    renderStateDashboard(c);
  } else if (userRole === 'PROJECT_AGENCY') {
    renderProjectAgencyDashboard(c);
  } else if (userRole === 'ACQUISITION_OFFICER') {
    renderAcquisitionOfficerDashboard(c);
  } else if (userRole === 'FIELD_OFFICER') {
    renderFieldOfficerDashboard(c);
  } else if (userRole === 'CITIZEN') {
    ROUTES['my-land'](c);
  } else {
    renderDistrictDashboard(c);
  }
};

/* ==================== 1. CENTRAL / MINISTRY AUTHORITY DASHBOARD ==================== */
function renderCentralDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const projects = DB.projects || [];
  const parcels = DB.parcels || [];
  
  const totalProposed = projects.reduce((s, p) => s + (p.requiredArea || 0), 0);
  const totalAcquired = projects.reduce((s, p) => s + (p.acquiredArea || 0), 0);
  const totalCompAssessed = projects.reduce((s, p) => s + (p.compensationAssessed || 0), 0);
  const totalCompDisbursed = projects.reduce((s, p) => s + (p.compensationDisbursed || 0), 0);
  const totalAffected = projects.reduce((s, p) => s + (p.affectedFamiliesCount || 0), 0);
  const totalDisplaced = projects.reduce((s, p) => s + (p.displacedFamiliesCount || 0), 0);
  
  const avgPossession = Math.round(projects.reduce((s, p) => s + (p.possessionProgressPct || 0), 0) / Math.max(projects.length, 1));
  const avgRR = Math.round(projects.reduce((s, p) => s + (p.rrProgressPct || 0), 0) / Math.max(projects.length, 1));
  
  const delayedProjects = projects.filter(p => {
    const m = (DB.monitoring || []).find(x => x.projectId === p.id);
    return m && (m.expectedProgress - m.actualProgress) > 10;
  });
  
  const highRiskBottlenecks = projects.map(p => analyzeProjectBottlenecks(p)).filter(b => b && b.riskLevel === 'High');

  c.innerHTML = `
    <!-- Top Central Authority Header -->
    <div class="section-head">
      <div>
        <h2>${isHi ? 'राष्ट्रीय भू-अधिग्रहण एवं निर्णय सहायता अवलोकन' : 'National Land Acquisition & Decision Support Dashboard'}</h2>
        <div class="muted small">${isHi ? 'भारत सरकार • ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग (DoLR) • राष्ट्रीय कॉरिडोर निगरानी' : 'Government of India • Ministry of Rural Development • Department of Land Resources (DoLR) • PM GatiShakti Portal'}</div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-sm btn-secondary" onclick="navigate('reports')">📊 ${isHi ? 'एमआईएस रिपोर्ट' : 'Executive MIS'}</button>
        <button class="btn btn-sm btn-saffron" onclick="navigate('bottlenecks')">⚡ ${isHi ? 'एआई गतिरोध रडार' : 'AI Bottleneck Radar'}</button>
        <button class="btn btn-sm btn-primary" onclick="navigate('map')">🗺️ ${isHi ? 'राष्ट्रीय नक्शा' : 'National GIS'}</button>
      </div>
    </div>

    <!-- AI Insights Banner (National Level) -->
    <div class="card stat-card stripe-saffron" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:16px;padding:12px 18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">✦</span>
          <div>
            <div style="font-weight:700;color:#92400e;font-size:13px;">${isHi ? 'राष्ट्रीय एआई अंतर्दृष्टि एवं सतर्कता सारांश (Llama 3.2)' : 'National AI Decision Intelligence & Bottleneck Alert (Llama 3.2)'}</div>
            <div class="small" style="color:#78350f;margin-top:2px;">
              🔴 <b>${highRiskBottlenecks.length} ${isHi ? 'परियोजनाओं में तत्काल ध्यान आवश्यक' : 'Projects Require Immediate Central Attention'}</b> &bull; 
              🟠 <b>${delayedProjects.length} ${isHi ? 'विलंबित सांविधिक मील के पत्थर' : 'Delayed Statutory Milestones'}</b> &bull; 
              ⚠️ <b>${fmtINR(totalCompAssessed - totalCompDisbursed)} ${isHi ? 'प्रतिकर डीबीटी अंतरण लंबित' : 'DBT Compensation Pending in Banking Queue'}</b> &bull; 
              👥 <b>${totalDisplaced} ${isHi ? 'विस्थापित परिवारों का आर एंड आर पुनर्वासन जारी' : 'Displaced Families in Active R&R Resettlement'}</b>
            </div>
          </div>
        </div>
        <button class="btn btn-sm btn-saffron" onclick="navigate('bottlenecks')">${isHi ? 'विश्लेषण देखें →' : 'View AI Radar →'}</button>
      </div>
    </div>

    <!-- 11 National Statutory Metrics Grid -->
    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'कुल राष्ट्रीय परियोजनाएं' : 'Total National Projects', projects.length, isHi ? `${STATES.length} राज्यों में` : `across ${STATES.length} States`, '', 'stripe-navy')}
      ${statCard(isHi ? 'प्रस्तावित भूमि' : 'Total Land Proposed', totalProposed.toFixed(1) + ' ac', isHi ? 'राष्ट्रीय संरेखण' : 'National Corridors', '', 'stripe-sky')}
      ${statCard(isHi ? 'अधिग्रहीत भूमि' : 'Total Land Acquired', totalAcquired.toFixed(1) + ' ac', Math.round((totalAcquired/Math.max(totalProposed,1))*100) + '% ' + (isHi ? 'अधिग्रहण संपन्न' : 'Acquired'), '', 'stripe-green')}
      ${statCard(isHi ? 'प्रतिकर एवार्ड निर्धारित' : 'Compensation Assessed', fmtINR(totalCompAssessed), isHi ? 'धारा 23/30 अनुसार' : 'Under Sec 23/30', '', 'stripe-saffron')}
    </div>

    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'डीबीटी वितरित प्रतिकर' : 'Compensation Disbursed', fmtINR(totalCompDisbursed), Math.round((totalCompDisbursed/Math.max(totalCompAssessed,1))*100) + '% ' + (isHi ? 'पीएफएमएस डीबीटी' : 'Disbursed via PFMS'), '', 'stripe-green')}
      ${statCard(isHi ? 'प्रभावित परिवार' : 'Affected Families', totalAffected, isHi ? 'सर्वेक्षण में दर्ज' : 'Identified in Baseline', '', 'stripe-navy')}
      ${statCard(isHi ? 'विस्थापित परिवार' : 'Displaced Families', totalDisplaced, isHi ? 'पुनर्वास पात्र' : 'Eligible for Sched II', '', 'stripe-clay')}
      ${statCard(isHi ? 'पुनर्वासन (R&R) प्रगति' : 'R&R Progress', avgRR + '%', isHi ? 'आवास व अनुदान पैकेज' : 'Housing & Grants Allocated', '', 'stripe-sky')}
    </div>

    <div class="grid g3" style="margin-bottom:18px;">
      ${statCard(isHi ? 'कब्जा (धारा 38) प्रगति' : 'Physical Possession Progress', avgPossession + '%', isHi ? 'निर्माण हैंडओवर हेतु' : 'Handed Over to Agencies', '', 'stripe-navy')}
      ${statCard(isHi ? 'विलंबित परियोजनाएं' : 'Delayed Projects', delayedProjects.length, isHi ? 'सांविधिक सीमा से पीछे' : 'Behind Statutory Targets', '', 'stripe-clay')}
      ${statCard(isHi ? 'तत्काल समीक्षा आवश्यक' : 'Projects Requiring Attention', highRiskBottlenecks.length, isHi ? 'एआई जोखिम सूचकांक > 65' : 'AI Risk Score > 65', '', 'stripe-saffron')}
    </div>

    <!-- National GIS Map Preview & State Progress Breakdown -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <div class="card-title" style="margin:0;">${isHi ? 'राष्ट्रीय जीआईएस कॉरिडोर संरेखण नक्शा' : 'National GIS Infrastructure Alignment Map'}</div>
          <button class="btn btn-sm btn-secondary" onclick="navigate('map')">${isHi ? 'पूर्ण नक्शा खोलें ↗' : 'Open Full GIS ↗'}</button>
        </div>
        <div id="dash-central-map" style="height:280px;border-radius:2px;overflow:hidden;"></div>
      </div>
      <div class="card">
        <div class="card-title">${isHi ? 'राज्य-वार भूमि अधिग्रहण प्रगति (लक्ष्य बनाम वास्तविक)' : 'State-wise Acquisition Progress vs Targets'}</div>
        <canvas id="chart-central-states" height="230"></canvas>
      </div>
    </div>

    <!-- State-wise Acquisition & Bottleneck Monitoring Table -->
    <div class="card" style="padding:0;margin-bottom:16px;">
      <div class="section-head" style="padding:14px 18px 0;margin-bottom:8px;">
        <h3 style="font-size:14px;color:var(--gov-navy);margin:0;">${isHi ? 'राज्य-वार सांविधिक अधिग्रहण एवं गतिरोध निगरानी' : 'State-wise Statutory Acquisition & Bottleneck Matrix'}</h3>
        <span class="small muted">${isHi ? 'राष्ट्रीय सारांश तालिका' : 'National Executive Rollup'}</span>
      </div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'राज्य' : 'State'}</th>
              <th>${isHi ? 'सक्रिय परियोजनाएं' : 'Active Projects'}</th>
              <th>${isHi ? 'प्रस्तावित भूमि' : 'Proposed Land'}</th>
              <th>${isHi ? 'अधिग्रहीत भूमि' : 'Acquired Land'}</th>
              <th>${isHi ? 'प्रतिकर वितरण %' : 'Compensation Disbursed %'}</th>
              <th>${isHi ? 'कब्जा %' : 'Possession %'}</th>
              <th>${isHi ? 'आर एंड आर %' : 'R&R %'}</th>
              <th>${isHi ? 'एआई गतिरोध स्तर' : 'AI Bottleneck Risk'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${STATES.map(st => {
              const stPrjs = projects.filter(p => p.state === st);
              const count = stPrjs.length;
              const req = stPrjs.reduce((s, p) => s + p.requiredArea, 0);
              const acq = stPrjs.reduce((s, p) => s + p.acquiredArea, 0);
              const compAss = stPrjs.reduce((s, p) => s + p.compensationAssessed, 0);
              const compDis = stPrjs.reduce((s, p) => s + p.compensationDisbursed, 0);
              const compPct = compAss > 0 ? Math.round((compDis / compAss) * 100) : 0;
              const possPct = count > 0 ? Math.round(stPrjs.reduce((s, p) => s + (p.possessionProgressPct || 0), 0) / count) : 0;
              const rrPct = count > 0 ? Math.round(stPrjs.reduce((s, p) => s + (p.rrProgressPct || 0), 0) / count) : 0;
              const hasHighRisk = stPrjs.some(p => analyzeProjectBottlenecks(p)?.riskLevel === 'High');
              return `
                <tr>
                  <td><b>${st}</b></td>
                  <td>${count} ${isHi ? 'परियोजनाएं' : 'Corridors'}</td>
                  <td>${req.toFixed(1)} ac</td>
                  <td><b>${acq.toFixed(1)} ac</b> (${req > 0 ? Math.round((acq/req)*100) : 0}%)</td>
                  <td><div class="progress-track" style="width:70px;display:inline-block;vertical-align:middle;margin-right:6px;"><div class="progress-fill" style="width:${compPct}%;background:var(--gov-green);"></div></div>${compPct}%</td>
                  <td>${possPct}%</td>
                  <td>${rrPct}%</td>
                  <td><span class="badge ${hasHighRisk ? 'badge-disputed' : 'badge-available'}">${hasHighRisk ? 'High Risk' : 'Normal'}</span></td>
                  <td><button class="btn btn-sm btn-primary" onclick="navigate('projects')">${isHi ? 'समीक्षा' : 'Drilldown'}</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delayed Projects & National AI Insight Recommendations -->
    <div class="grid g2">
      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'विलंबित राष्ट्रीय गलियारे (समीक्षा सूची)' : 'Delayed National Priority Corridors'}</h3>
          <a class="small" onclick="navigate('alerts')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'सभी अलर्ट →' : 'All Alerts →'}</a>
        </div>
        ${delayedProjects.map(p => {
          const b = analyzeProjectBottlenecks(p);
          return `
            <div class="timeline-item" style="padding:8px 0;">
              <div class="timeline-dot" style="background:var(--clay);"></div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <b style="font-size:12.5px;color:var(--gov-navy);">${p.name}</b>
                  <span class="badge badge-disputed">${b?.riskLevel || 'Delayed'}</span>
                </div>
                <div class="small muted" style="margin-top:2px;">${p.department} &bull; ${p.state} &bull; Target: ${fmtDate(p.targetDate)}</div>
                <div class="small" style="color:var(--clay);font-weight:600;margin-top:3px;">⚠ ${b?.primaryBottleneck || 'Milestone delay'}</div>
              </div>
            </div>
          `;
        }).join('') || `<div class="empty small">${isHi ? 'कोई गंभीर विलंबित परियोजना नहीं है।' : 'No delayed priority projects.'}</div>`}
      </div>

      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'राष्ट्रीय निर्णय सहायता सारांश (Llama 3.2)' : 'National Executive Summary & Guidance'}</h3>
          <a class="small" onclick="navigate('bottlenecks')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'एआई रडार →' : 'AI Radar →'}</a>
        </div>
        <div style="background:#f8fafc;border-left:3px solid var(--gov-blue);padding:10px 14px;border-radius:2px;font-size:11.5px;line-height:1.6;color:var(--gov-text);margin-bottom:10px;">
          <b>[Central Recommendation]</b> Inter-state coordination with Maharashtra and Uttar Pradesh Revenue Departments is advised to release remaining 18% PFMS compensation tranches and clear Section 38 physical possession certificates prior to Q4 construction commissioning.
        </div>
        <div style="font-size:11.5px;color:var(--gov-text-muted);line-height:1.6;">
          • <b>PFMS Banking Gateways:</b> Average disbursement latency across 142 corridors stands at 8.4 days (under statutory target of 15 days).<br>
          • <b>Cadastral GIS Coverage:</b> 98.4% of proposed survey numbers have been geo-referenced with sub-meter precision.<br>
          • <b>R&R Entitlements:</b> Schedule II housing plots allocated for 78% of verified displaced families.
        </div>
      </div>
    </div>
  `;

  // Render Central Map Preview
  setTimeout(() => {
    const mapEl = document.getElementById('dash-central-map');
    if (mapEl && typeof L !== 'undefined') {
      const cmap = L.map('dash-central-map', { zoomControl: false, attributionControl: false }).setView([BASE_LAT, BASE_LNG], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(cmap);
      parcels.slice(0, 50).forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 4, color: colorForStatus(p.status), fillOpacity: 0.85, weight: 1 }).addTo(cmap);
      });
    }

    // Render State Chart
    const ctx = document.getElementById('chart-central-states');
    if (ctx && typeof Chart !== 'undefined') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: STATES.slice(0, 6),
          datasets: [
            {
              label: isHi ? 'प्रस्तावित भूमि (एकड़)' : 'Proposed Land (Acres)',
              data: STATES.slice(0, 6).map(st => projects.filter(p => p.state === st).reduce((s, p) => s + p.requiredArea, 0)),
              backgroundColor: '#cbd5e1'
            },
            {
              label: isHi ? 'अधिग्रहीत भूमि (एकड़)' : 'Acquired Land (Acres)',
              data: STATES.slice(0, 6).map(st => projects.filter(p => p.state === st).reduce((s, p) => s + p.acquiredArea, 0)),
              backgroundColor: '#073763'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 10.5 } } } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } }, x: { ticks: { font: { size: 9.5 } } } }
        }
      });
    }
  }, 100);
}

/* ==================== 2. STATE AUTHORITY DASHBOARD ==================== */
function renderStateDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const userState = CURRENT_USER.state || 'Madhya Pradesh';
  const stateProjects = (DB.projects || []).filter(p => !p.state || p.state === userState);
  const stateParcels = (DB.parcels || []).filter(p => !p.state || p.state === userState);
  
  const landProposed = stateProjects.reduce((s, p) => s + (p.requiredArea || 0), 0);
  const landAcquired = stateProjects.reduce((s, p) => s + (p.acquiredArea || 0), 0);
  const compAssessed = stateProjects.reduce((s, p) => s + (p.compensationAssessed || 0), 0);
  const compDisbursed = stateProjects.reduce((s, p) => s + (p.compensationDisbursed || 0), 0);
  const affectedFamilies = stateProjects.reduce((s, p) => s + (p.affectedFamiliesCount || 0), 0);
  const displacedFamilies = stateProjects.reduce((s, p) => s + (p.displacedFamiliesCount || 0), 0);
  
  const pendingApprovals = (DB.cases || []).filter(k => k.status === 'OBJECTION_REVIEW' || k.status === 'VERIFICATION').length;
  const delayedProjects = stateProjects.filter(p => {
    const m = (DB.monitoring || []).find(x => x.projectId === p.id);
    return m && (m.expectedProgress - m.actualProgress) > 10;
  });

  const avgPossession = Math.round(stateProjects.reduce((s, p) => s + (p.possessionProgressPct || 0), 0) / Math.max(stateProjects.length, 1));
  const avgRR = Math.round(stateProjects.reduce((s, p) => s + (p.rrProgressPct || 0), 0) / Math.max(stateProjects.length, 1));

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? `राज्य भू-अधिग्रहण डैशबोर्ड — ${userState}` : `State Acquisition Dashboard — ${userState}`}</h2>
        <div class="muted small">${isHi ? `राजस्व विभाग • मध्य प्रदेश शासन • ज़िला कलेक्टर एवं सक्षम प्राधिकारी (CALA) निगरानी` : `Department of Revenue • Govt. of ${userState} • State Land Authority & CALA Directorate`}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-saffron" onclick="navigate('approvals')">✓ ${isHi ? 'स्वीकृतियां' : 'Sanctions'}</button>
        <button class="btn btn-sm btn-primary" onclick="navigate('map')">🗺️ ${isHi ? 'राज्य जीआईएस' : 'State GIS'}</button>
      </div>
    </div>

    <!-- State Metrics 4-Card Grid -->
    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'राज्य परियोजनाएं' : 'State Projects', stateProjects.length, `${userState} Corridors`, '', 'stripe-navy')}
      ${statCard(isHi ? 'प्रस्तावित भूमि' : 'Land Proposed', landProposed.toFixed(1) + ' ac', isHi ? 'कुल संरेखण' : 'Alignment Target', '', 'stripe-sky')}
      ${statCard(isHi ? 'अधिग्रहीत भूमि' : 'Land Acquired', landAcquired.toFixed(1) + ' ac', Math.round((landAcquired/Math.max(landProposed,1))*100) + '% ' + (isHi ? 'अधिग्रहीत' : 'Acquired'), '', 'stripe-green')}
      ${statCard(isHi ? 'प्रतिकर देय / वितरित' : 'Compensation Disbursed', fmtINR(compDisbursed), isHi ? `कुल ${fmtINR(compAssessed)} में से` : `of ${fmtINR(compAssessed)}`, '', 'stripe-saffron')}
    </div>

    <div class="grid g4" style="margin-bottom:18px;">
      ${statCard(isHi ? 'भौतिक कब्जा (Sec 38)' : 'Possession Handover', avgPossession + '%', isHi ? 'एजेंसियों को सुपुर्द' : 'Vested & Handed Over', '', 'stripe-navy')}
      ${statCard(isHi ? 'पुनर्वासन (R&R) प्रगति' : 'R&R Package Progress', avgRR + '%', isHi ? 'अनुदान व भूखंड वितरण' : 'Entitlements Settled', '', 'stripe-green')}
      ${statCard(isHi ? 'प्रभावित / विस्थापित' : 'Affected / Displaced', `${affectedFamilies} / ${displacedFamilies}`, isHi ? 'परिवार' : 'Families', '', 'stripe-clay')}
      ${statCard(isHi ? 'लंबित संस्वीकृतियां' : 'Pending Approvals', pendingApprovals, isHi ? 'धारा 15/19 अनुमोदन' : 'Sec 15/19 Sanctions', '', 'stripe-saffron')}
    </div>

    <!-- State Map & District Breakdown Chart -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card">
        <div class="card-title">${isHi ? `राज्य कैडस्ट्रल जीआईएस पूर्वावलोकन (${userState})` : `State Cadastral GIS Map (${userState})`}</div>
        <div id="dash-state-map" style="height:270px;border-radius:2px;overflow:hidden;"></div>
      </div>
      <div class="card">
        <div class="card-title">${isHi ? 'ज़िला-वार परियोजना एवं खसरा वितरण' : 'District-wise Acquisition Progress'}</div>
        <canvas id="chart-state-districts" height="220"></canvas>
      </div>
    </div>

    <!-- District-wise Monitoring Breakdown Table -->
    <div class="card" style="padding:0;">
      <div class="section-head" style="padding:14px 18px 0;margin-bottom:8px;">
        <h3 style="font-size:14px;color:var(--gov-navy);margin:0;">${isHi ? 'ज़िला समाहर्ता एवं सक्षम प्राधिकारी (CALA) कार्य निष्पादन' : 'District Collector & CALA Performance Matrix'}</h3>
      </div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'ज़िला' : 'District'}</th>
              <th>${isHi ? 'सक्रिय गलियारे' : 'Active Projects'}</th>
              <th>${isHi ? 'खसरा भूखंड' : 'Parcels'}</th>
              <th>${isHi ? 'सत्यापन स्थिति' : 'Verification Status'}</th>
              <th>${isHi ? 'प्रतिकर डीबीटी' : 'DBT Disbursed'}</th>
              <th>${isHi ? 'कब्जा %' : 'Possession %'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${DISTRICTS.slice(0, 5).map(dist => {
              const dParcels = stateParcels.filter(p => p.district === dist);
              const verified = dParcels.filter(p => p.documentStatus === 'Verified').length;
              const vPct = dParcels.length > 0 ? Math.round((verified / dParcels.length) * 100) : 85;
              return `
                <tr>
                  <td><b>${dist}</b></td>
                  <td>${stateProjects.filter(p => p.location === dist || p.district === dist).length || 1} Corridors</td>
                  <td>${dParcels.length || 18} Parcels</td>
                  <td><div class="progress-track" style="width:70px;display:inline-block;vertical-align:middle;margin-right:6px;"><div class="progress-fill" style="width:${vPct}%;background:var(--gov-green);"></div></div>${vPct}%</td>
                  <td>${fmtINR(rint(18000000, 65000000))}</td>
                  <td>${rint(60, 95)}%</td>
                  <td><button class="btn btn-sm btn-primary" onclick="navigate('parcels')">${isHi ? 'विवरण' : 'Inspect'}</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const mapEl = document.getElementById('dash-state-map');
    if (mapEl && typeof L !== 'undefined') {
      const smap = L.map('dash-state-map', { zoomControl: false, attributionControl: false }).setView([BASE_LAT, BASE_LNG], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(smap);
      stateParcels.slice(0, 40).forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 4, color: colorForStatus(p.status), fillOpacity: 0.85, weight: 1 }).addTo(smap);
      });
    }

    const ctx = document.getElementById('chart-state-districts');
    if (ctx && typeof Chart !== 'undefined') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: DISTRICTS.slice(0, 5),
          datasets: [
            {
              label: isHi ? 'सत्यापित खसरे' : 'Verified Parcels',
              data: [18, 12, 14, 9, 11],
              backgroundColor: '#198754'
            },
            {
              label: isHi ? 'सत्यापनधीन खसरे' : 'Pending Parcels',
              data: [4, 6, 3, 5, 2],
              backgroundColor: '#f59e0b'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { font: { size: 10.5 } } } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } } }
        }
      });
    }
  }, 100);
}

/* ==================== 3. DISTRICT AUTHORITY DASHBOARD ==================== */
function renderDistrictDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const userDistrict = CURRENT_USER.district || 'Bhopal';
  const districtProjects = (DB.projects || []).filter(p => p.location === userDistrict || p.district === userDistrict);
  const districtParcels = (DB.parcels || []).filter(p => !p.district || p.district === userDistrict);
  
  const pendingVerif = districtParcels.filter(p => p.status === 'Under Verification').length;
  const pendingApprovals = (DB.cases || []).filter(k => k.status === 'OBJECTION_REVIEW').length;
  const pendingComp = (DB.compensation || []).filter(x => x.paymentStatus !== 'Paid').length;
  const fieldPending = (DB.fieldTasks || []).filter(t => t.status === 'Submitted').length;

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? `ज़िला समाहर्ता एवं CALA डैशबोर्ड — ${userDistrict}` : `District Authority & CALA Dashboard — ${userDistrict}`}</h2>
        <div class="muted small">${isHi ? 'सक्षम प्राधिकारी भू-अधिग्रहण • आरएफसीटीएलएआरआर अधिनियम २०१३ • राजस्व न्यायालय एवं अवार्ड संवीक्षा' : 'Competent Authority Land Acquisition (CALA) • RFCTLARR Act 2013 • Field Scrutiny & Award Court'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-saffron" onclick="navigate('field-review')">📋 ${isHi ? `क्षेत्रीय रिपोर्ट (${fieldPending})` : `Field Reviews (${fieldPending})`}</button>
        <button class="btn btn-sm btn-primary" onclick="navigate('cases')">📑 ${isHi ? 'प्रकरण देखें' : 'View Cases'}</button>
      </div>
    </div>

    <!-- District Operational Metrics -->
    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'सक्रिय ज़िला परियोजनाएं' : 'Active District Projects', districtProjects.length || 3, isHi ? `${userDistrict} क्षेत्राधिकार` : `${userDistrict} Jurisdiction`, '', 'stripe-navy')}
      ${statCard(isHi ? 'सत्यापनधीन खसरे' : 'Pending Verification', pendingVerif, isHi ? 'राजस्व अभिलेख जांच' : 'Revenue RoR Scrutiny', '', 'stripe-sky')}
      ${statCard(isHi ? 'धारा 15 संस्वीकृति लंबित' : 'Pending Approvals', pendingApprovals, isHi ? 'आपत्ति सुनवाई पश्चात' : 'Objection Hearings', '', 'stripe-saffron')}
      ${statCard(isHi ? 'प्रतिकर अंतरण लंबित' : 'Pending Compensation', pendingComp, isHi ? 'डीबीटी भुगतान शेष' : 'PFMS DBT Tranches', '', 'stripe-clay')}
    </div>

    <div class="grid g4" style="margin-bottom:18px;">
      ${statCard(isHi ? 'क्षेत्रीय रिपोर्ट समीक्षा' : 'Field Submissions Review', fieldPending, isHi ? 'सर्वेक्षक रिपोर्ट प्रतीक्षित' : 'Awaiting CALA Sign-off', '', 'stripe-saffron')}
      ${statCard(isHi ? 'कब्जा हस्तांतरण शेष' : 'Possession Handover Pending', districtParcels.filter(p => p.possessionStatus !== 'Possession Handed Over (Sec 38)').length, isHi ? 'धारा 38 प्रमाण पत्र' : 'Sec 38 Certificates', '', 'stripe-navy')}
      ${statCard(isHi ? 'पुनर्वासन (R&R) पात्र' : 'R&R Eligible Families', districtParcels.filter(p => p.affectedFamily?.isDisplaced).length, isHi ? 'आवासीय भूखंड आवंटन' : 'Schedule II Packages', '', 'stripe-green')}
      ${statCard(isHi ? 'सतर्कता अलर्ट' : 'Compliance Alerts', (DB.alerts || []).filter(a => !a.resolved).length, isHi ? 'सक्रिय विधिक सूचनाएं' : 'Active Statutory Flags', '', 'stripe-clay')}
    </div>

    <!-- Field Submissions Awaiting CALA Review Banner -->
    ${fieldPending > 0 ? `
      <div class="card stat-card stripe-saffron" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:16px;padding:12px 18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-weight:700;color:#92400e;font-size:13px;">📍 ${isHi ? 'क्षेत्रीय सर्वेक्षकों द्वारा प्रस्तुत सत्यापन रिपोर्ट समीक्षा हेतु उपलब्ध' : 'Field Surveyor Ground Submissions Awaiting District Review'}</div>
            <div class="small" style="color:#78350f;margin-top:2px;">
              ${fieldPending} ${isHi ? 'खसरों का जीपीएस निर्देशांक व भू-फोटो सत्यापन प्रस्तुत हुआ है। कृपया समीक्षा कर संस्वीकृति प्रदान करें।' : 'parcel ground reports with GPS coordinates, photos, and boundary checklists are ready for CALA approval.'}
            </div>
          </div>
          <button class="btn btn-sm btn-saffron" onclick="navigate('field-review')">${isHi ? 'समीक्षा करें व संस्वीकृति दें →' : 'Review & Approve →'}</button>
        </div>
      </div>
    ` : ''}

    <!-- District GIS & Workflow Chart -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card">
        <div class="card-title">${isHi ? `ज़िला कैडस्ट्रल नक्शा (${userDistrict})` : `District Cadastral GIS Map (${userDistrict})`}</div>
        <div id="dash-district-map" style="height:270px;border-radius:2px;overflow:hidden;"></div>
      </div>
      <div class="card">
        <div class="card-title">${isHi ? 'आरएफसीटीएलएआरआर चरण अनुसार खसरा विभाजन' : 'Parcels by RFCTLARR Stage'}</div>
        <canvas id="chart-district-stages" height="220"></canvas>
      </div>
    </div>

    <!-- Active Proceedings & Recent Audit Logs -->
    <div class="grid g2">
      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'नवीनतम वैधानिक कार्यवाहियां' : 'Recent Statutory Actions'}</h3>
          <a class="small" onclick="navigate('audit')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'ऑडिट ट्रेल →' : 'Audit Trail →'}</a>
        </div>
        ${(DB.auditLogs || []).slice(-5).reverse().map(a => `
          <div class="timeline-item" style="padding:6px 0;">
            <div class="timeline-dot"></div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--gov-navy);">${escapeHtml(a.action)}</div>
              <div class="small muted">${escapeHtml(a.user)} &bull; ${escapeHtml(a.entityId)} &bull; ${fmtDate(a.timestamp)}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'ज़िला एआई अंतर्दृष्टि' : 'District AI Bottleneck Radar'}</h3>
          <a class="small" onclick="navigate('bottlenecks')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'पूर्ण रडार →' : 'Full Radar →'}</a>
        </div>
        <div style="font-size:12px;color:var(--gov-text);line-height:1.6;">
          • <b>Section 11 Notice Pipeline:</b> 14 survey numbers in Huzur Tehsil have completed JMS verification and are ready for Section 11(1) publication.<br>
          • <b>PFMS Mandate Compliance:</b> 94% of beneficiary bank mandates successfully validated with Aadhaar NPCI mapper.<br>
          • <b>Schedule II R&R Colony:</b> 12 residential plots demarcated at Ratanpur rehabilitation cluster.
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const mapEl = document.getElementById('dash-district-map');
    if (mapEl && typeof L !== 'undefined') {
      const dmap = L.map('dash-district-map', { zoomControl: false, attributionControl: false }).setView([BASE_LAT, BASE_LNG], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(dmap);
      districtParcels.forEach(p => {
        L.circleMarker([p.lat, p.lng], { radius: 4, color: colorForStatus(p.status), fillOpacity: 0.85, weight: 1 }).addTo(dmap);
      });
    }

    const ctx = document.getElementById('chart-district-stages');
    if (ctx && typeof Chart !== 'undefined') {
      const counts = PARCEL_STATUSES.map(s => districtParcels.filter(p => p.status === s).length);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: PARCEL_STATUSES,
          datasets: [{ data: counts, backgroundColor: PARCEL_STATUSES.map(colorForStatus) }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,.05)' } }, x: { ticks: { font: { size: 9 } } } }
        }
      });
    }
  }, 100);
}

/* ==================== 4. PROJECT AGENCY / REQUIRING BODY DASHBOARD ==================== */
function renderProjectAgencyDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const agencyName = CURRENT_USER.agency || 'NHAI';
  const agencyProjects = (DB.projects || []).filter(p => p.agency === agencyName || p.department.includes(agencyName));
  const proposals = (DB.proposals || []).filter(pr => pr.agency === agencyName);
  
  const landReq = agencyProjects.reduce((s, p) => s + p.requiredArea, 0);
  const landAcq = agencyProjects.reduce((s, p) => s + p.acquiredArea, 0);
  const compAss = agencyProjects.reduce((s, p) => s + p.compensationAssessed, 0);
  const compDis = agencyProjects.reduce((s, p) => s + p.compensationDisbursed, 0);
  const avgPossession = Math.round(agencyProjects.reduce((s, p) => s + (p.possessionProgressPct || 0), 0) / Math.max(agencyProjects.length, 1));
  const avgRR = Math.round(agencyProjects.reduce((s, p) => s + (p.rrProgressPct || 0), 0) / Math.max(agencyProjects.length, 1));

  const pendingClarifications = agencyProjects.flatMap(p => p.clarifications || []).filter(c => c.status === 'Pending');

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? `परियोजना एजेंसी पोर्टल — ${agencyName}` : `Project Agency Dashboard — ${agencyName}`}</h2>
        <div class="muted small">${isHi ? 'भू-अपेक्षी निकाय • प्रस्ताव प्रस्तुति, डीपीआर संरेखण, एवं कब्जा हैंडओवर निगरानी' : 'Land Requiring Body Portal • Proposal Submission, Alignment Tracking & Corridor Possession'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="openNewProposalModal()">+ ${isHi ? 'नया भू-अधिग्रहण प्रस्ताव प्रस्तुत करें' : 'Submit Land Proposal'}</button>
      </div>
    </div>

    <!-- Important Notice Regarding Permissions -->
    <div class="card stat-card stripe-navy" style="background:#f0f7fd;border:1px solid #bae6fd;margin-bottom:16px;padding:10px 16px;">
      <div style="font-size:11.5px;color:#0369a1;line-height:1.5;">
        ℹ️ <b>Statutory Governance Notice:</b> Project Agencies can create proposals, upload DPRs, respond to clarifications, and track acquisition progress. Government statutory sanctions, revenue verifications, and compensation awards are executed by District Authorities (CALA) and Land Acquisition Officers under RFCTLARR Act 2013.
      </div>
    </div>

    <!-- Agency Metrics 4-Card Grid -->
    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'प्रस्तुत प्रस्ताव' : 'Proposals Submitted', proposals.length + agencyProjects.length, isHi ? 'राष्ट्रीय गलियारे' : 'Corridor Alignments', '', 'stripe-navy')}
      ${statCard(isHi ? 'आवश्यक भूमि' : 'Target Land Required', landReq.toFixed(1) + ' ac', isHi ? 'स्वीकृत डीपीआर' : 'Sanctioned Corridors', '', 'stripe-sky')}
      ${statCard(isHi ? 'अधिग्रहीत भूमि' : 'Land Acquired', landAcq.toFixed(1) + ' ac', Math.round((landAcq/Math.max(landReq,1))*100) + '% ' + (isHi ? 'हस्तांतरित' : 'Vested'), '', 'stripe-green')}
      ${statCard(isHi ? 'प्रतिकर जमा / वितरण' : 'Compensation Disbursed', fmtINR(compDis), isHi ? `कुल ${fmtINR(compAss)} में से` : `of ${fmtINR(compAss)}`, '', 'stripe-saffron')}
    </div>

    <div class="grid g3" style="margin-bottom:18px;">
      ${statCard(isHi ? 'भौतिक कब्जा (निर्माण हेतु)' : 'Physical Possession Handover', avgPossession + '%', isHi ? 'निर्माण प्रारंभ योग्य' : 'Ready for Construction', '', 'stripe-green')}
      ${statCard(isHi ? 'पुनर्वासन (R&R) प्रगति' : 'R&R Progress', avgRR + '%', isHi ? 'कॉलोनी एवं अनुदान' : 'Resettlement Completed', '', 'stripe-navy')}
      ${statCard(isHi ? 'लंबित स्पष्टीकरण' : 'Clarification Queries', pendingClarifications.length, isHi ? 'राजस्व विभाग द्वारा वांछित' : 'Awaiting Agency Response', '', 'stripe-saffron')}
    </div>

    <!-- Proposals & Clarifications Section -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'प्रस्ताव प्रस्तुति एवं संवीक्षा स्थिति' : 'Proposal Pipeline & Scrutiny Status'}</h3>
          <button class="btn btn-sm btn-primary" onclick="openNewProposalModal()">+ ${isHi ? 'नया प्रस्ताव' : 'New Proposal'}</button>
        </div>
        ${proposals.map(pr => `
          <div class="timeline-item" style="padding:10px 0;">
            <div class="timeline-dot" style="background:var(--gov-blue);"></div>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <b style="font-size:12.5px;color:var(--gov-navy);">${pr.title}</b>
                <span class="badge ${pr.status === 'Sanctioned' ? 'badge-pos' : 'badge-available'}">${pr.status}</span>
              </div>
              <div class="small muted" style="margin-top:2px;">${pr.district}, ${pr.state} &bull; ${pr.requiredArea} acres &bull; Submitted: ${fmtDate(pr.submittedDate)}</div>
              <div class="small" style="color:var(--gov-navy);margin-top:4px;">"${pr.scrutinyRemarks}"</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'स्पष्टीकरण एवं पत्राचार इनबॉक्स' : 'Authority Clarifications & Inquiry Box'}</h3>
        </div>
        ${pendingClarifications.length ? pendingClarifications.map(cl => `
          <div style="background:#f8fafc;border:1px solid var(--gov-border);padding:10px 12px;border-radius:3px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;color:var(--gov-navy);">
              <span>Query: ${cl.requestedBy}</span>
              <span class="badge badge-disputed">Pending Response</span>
            </div>
            <p style="font-size:11.5px;color:var(--gov-text);margin:4px 0 8px;">"${cl.query}"</p>
            <button class="btn btn-sm btn-saffron" onclick="openReplyClarificationModal('${cl.id}')">${isHi ? 'उत्तर प्रेषित करें' : 'Respond to Clarification'}</button>
          </div>
        `).join('') : `
          <div style="background:#f8fafc;border:1px solid var(--gov-border);padding:12px;border-radius:3px;font-size:11.5px;color:var(--gov-text-muted);">
            ✓ ${isHi ? 'वर्तमान में राजस्व प्राधिकारियों द्वारा कोई स्पष्टीकरण लंबित नहीं है।' : 'No active clarification queries pending from District/State authorities.'}
          </div>
        `}
      </div>
    </div>

    <!-- Agency Corridors Table -->
    <div class="card" style="padding:0;">
      <div class="section-head" style="padding:14px 18px 0;margin-bottom:8px;">
        <h3 style="font-size:14px;color:var(--gov-navy);margin:0;">${isHi ? `${agencyName} राष्ट्रीय अवसंरचना गलियारे` : `${agencyName} Infrastructure Corridors`}</h3>
      </div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'गलियारा नाम' : 'Corridor Name'}</th>
              <th>${isHi ? 'राज्य / स्थान' : 'State / District'}</th>
              <th>${isHi ? 'आवश्यक भूमि' : 'Required Land'}</th>
              <th>${isHi ? 'अधिग्रहीत भूमि' : 'Acquired Land'}</th>
              <th>${isHi ? 'कब्जा स्थिति' : 'Possession Status'}</th>
              <th>${isHi ? 'आर एंड आर' : 'R&R Progress'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${agencyProjects.map(p => `
              <tr>
                <td><b>${p.name}</b></td>
                <td>${p.location}, ${p.state}</td>
                <td>${p.requiredArea} ac</td>
                <td><b>${p.acquiredArea} ac</b> (${Math.round((p.acquiredArea/p.requiredArea)*100)}%)</td>
                <td><span class="badge ${p.possessionProgressPct >= 80 ? 'badge-pos' : 'badge-available'}">${p.possessionProgressPct || 65}% Handed Over</span></td>
                <td>${p.rrProgressPct || 70}% Complete</td>
                <td><button class="btn btn-sm btn-primary" onclick="navigate('project-detail', '${p.id}')">${isHi ? 'संरेखण देखें' : 'View Corridor'}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==================== 5. ACQUISITION OFFICER (LAO) DASHBOARD ==================== */
function renderAcquisitionOfficerDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const userDistrict = CURRENT_USER.district || 'Bhopal';
  const cases = (DB.cases || []);
  const documents = (DB.documents || []);
  const comp = (DB.compensation || []);

  const pendingDocs = documents.filter(d => d.status === 'Uploaded' || d.status === 'Under Review');
  const pendingAwards = cases.filter(k => k.status === 'APPROVAL' || k.status === 'NOTICE_ISSUED');
  const pendingDBT = comp.filter(x => x.paymentStatus !== 'Paid');
  const fieldPending = (DB.fieldTasks || []).filter(t => t.status === 'Assigned' || t.status === 'Re-verification Requested');

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'भू-अधिग्रहण अधिकारी (LAO) कार्य निष्पादन डेस्क' : 'Land Acquisition Officer (LAO) Operational Desk'}</h2>
        <div class="muted small">${isHi ? 'भोपाल वृत्त-I • वैधानिक संवीक्षा, धारा 11-19 अधिसूचना, एवार्ड निर्धारण एवं डीबीटी वितरण' : 'Bhopal Circle-I • Statutory Scrutiny, Sections 11-19 Gazetting, Sec 23 Awards & PFMS DBT'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-saffron" onclick="navigate('documents')">📄 ${isHi ? `दस्तावेज़ (${pendingDocs.length})` : `Verify Docs (${pendingDocs.length})`}</button>
        <button class="btn btn-sm btn-primary" onclick="navigate('compensation')">💳 ${isHi ? 'डीबीटी भुगतान' : 'DBT Payouts'}</button>
      </div>
    </div>

    <!-- 10-Stage Pipeline Overview Bar -->
    <div class="card stat-card stripe-navy" style="margin-bottom:16px;padding:12px 16px;overflow-x:auto;">
      <div style="font-weight:700;font-size:12.5px;color:var(--gov-navy);margin-bottom:8px;">
        ⚖️ ${isHi ? '१०-चरणीय सांविधिक भू-अधिग्रहण जीवनचक्र (RFCTLARR अधिनियम २०१३)' : '10-Stage Statutory Acquisition Lifecycle (RFCTLARR Act 2013 Pipeline)'}
      </div>
      ${renderStepper('VERIFICATION')}
    </div>

    <!-- LAO Operational Metrics -->
    <div class="grid g4" style="margin-bottom:14px;">
      ${statCard(isHi ? 'सक्रिय अधिग्रहण प्रकरण' : 'Active Cases in Circle', cases.length, isHi ? 'राजस्व प्रकरण' : 'Circle Dossiers', '', 'stripe-navy')}
      ${statCard(isHi ? 'दस्तावेज़ संवीक्षा लंबित' : 'Docs Awaiting Scrutiny', pendingDocs.length, isHi ? 'एआई विसंगति जांच' : 'AI Discrepancy Checks', '', 'stripe-sky')}
      ${statCard(isHi ? 'एवार्ड निर्धारण प्रतीक्षित' : 'Awards Pending (Sec 23)', pendingAwards.length, isHi ? '१००% सोलेशियम गणना' : '100% Solatium Calc', '', 'stripe-saffron')}
      ${statCard(isHi ? 'डीबीटी वितरण लंबित' : 'DBT Tranches Ready', pendingDBT.length, fmtINR(pendingDBT.reduce((s,x)=>s+x.total,0)), '', 'stripe-green')}
    </div>

    <!-- Operational Queues -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'दस्तावेज़ सत्यापन एवं AI OCR विसंगति कतार' : 'Document Verification & AI OCR Discrepancy Queue'}</h3>
          <a class="small" onclick="navigate('documents')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'सभी देखें →' : 'All Docs →'}</a>
        </div>
        ${pendingDocs.slice(0, 4).map(d => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--gov-border);">
            <div>
              <b style="font-size:12px;color:var(--gov-navy);">${d.type}</b>
              <div class="small muted">Parcel: <b>${d.parcelId}</b> &bull; Uploaded: ${fmtDate(d.uploadedAt)}</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="navigate('documents')">${isHi ? 'सत्यापित करें' : 'Verify OCR'}</button>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="section-head" style="margin-bottom:8px;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);margin:0;">${isHi ? 'क्षेत्रीय सत्यापन कार्य निगरानी (सर्वेक्षक)' : 'Field Surveyor Assignment Tracker'}</h3>
          <a class="small" onclick="navigate('field-review')" style="cursor:pointer;color:var(--gov-navy);font-weight:600;">${isHi ? 'क्षेत्रीय कार्य →' : 'Field Tasks →'}</a>
        </div>
        ${(DB.fieldTasks || []).slice(0, 4).map(t => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--gov-border);">
            <div>
              <b style="font-size:12px;color:var(--gov-navy);">${t.parcelId}</b>
              <div class="small muted">${t.assignedOfficer} &bull; ${t.status}</div>
            </div>
            <span class="badge ${t.status === 'Approved' ? 'badge-pos' : 'badge-available'}">${t.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ==================== 6. FIELD OFFICER / SURVEYOR DASHBOARD ==================== */
function renderFieldOfficerDashboard(c) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const myTasks = filterFieldTasksByRole(CURRENT_USER);
  const assigned = myTasks.filter(t => t.status === 'Assigned' || t.status === 'Re-verification Requested');
  const submitted = myTasks.filter(t => t.status === 'Submitted');
  const approved = myTasks.filter(t => t.status === 'Approved');

  c.innerHTML = `
    <!-- Mobile & Responsive Optimized Field Officer Hub -->
    <div class="section-head">
      <div>
        <h2>${isHi ? 'क्षेत्रीय सत्यापन एवं भू-सर्वेक्षण मोबाइल हब' : 'Field Verification & Ground Survey Hub'}</h2>
        <div class="muted small">${isHi ? 'राजस्व निरीक्षक एवं भू-सर्वेक्षक • जीपीएस निर्देशांक कैप्चर, फोटो अपलोड एवं भूखंड सत्यापन' : 'Revenue Inspector & Geo-Surveyor • On-ground GPS Tagging, Photo Upload & Boundary Verification'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-sm btn-secondary" onclick="Device.toggleMode()">📱 ${isHi ? 'मोबाइल दृश्य' : 'Toggle Mobile'}</button>
      </div>
    </div>

    <!-- Mobile-First Instructions Card -->
    <div class="card stat-card stripe-saffron" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:16px;padding:12px 16px;">
      <div style="font-size:12px;color:#92400e;line-height:1.5;">
        📍 <b>Field Protocol Instructions:</b> Arrive at the cadastral parcel boundary. Click <b>"Verify on Ground"</b> to capture sub-meter live GPS coordinates, snap a geo-tagged photograph, verify boundary demarcation pegs, and submit for District CALA sign-off.
      </div>
    </div>

    <!-- Field Metrics Grid -->
    <div class="grid g3" style="margin-bottom:18px;">
      ${statCard(isHi ? 'सत्यापन हेतु लंबित कार्य' : 'Tasks Pending Verification', assigned.length, isHi ? 'भू-टैगिंग शेष' : 'Action Required', '', 'stripe-saffron')}
      ${statCard(isHi ? 'प्रस्तुत (CALA समीक्षाधीन)' : 'Submitted for CALA Review', submitted.length, isHi ? 'समीक्षाधीन' : 'Awaiting Approval', '', 'stripe-navy')}
      ${statCard(isHi ? 'स्वीकृत / पूर्ण कार्य' : 'Approved & Verified', approved.length, isHi ? 'सत्यापित भूखंड' : 'Ground Truth Verified', '', 'stripe-green')}
    </div>

    <!-- Assigned Tasks List -->
    <div class="card" style="padding:0;">
      <div class="section-head" style="padding:14px 18px 0;margin-bottom:8px;">
        <h3 style="font-size:14px;color:var(--gov-navy);margin:0;">${isHi ? 'आवंटित खसरा सत्यापन कार्य सूची' : 'Assigned Cadastral Verification Tasks'}</h3>
        <span class="small muted">${myTasks.length} ${isHi ? 'कार्य आवंटित' : 'Tasks Assigned'}</span>
      </div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'कार्य क्रमांक' : 'Task ID'}</th>
              <th>${isHi ? 'खसरा भूखंड' : 'Parcel ID'}</th>
              <th>${isHi ? 'ग्राम / तहसील' : 'Village / Tehsil'}</th>
              <th>${isHi ? 'क्षेत्रफल' : 'Area'}</th>
              <th>${isHi ? 'लक्ष्य जीपीएस' : 'Target Coordinates'}</th>
              <th>${isHi ? 'स्थिति' : 'Status'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${myTasks.map(t => {
              const p = parcelById(t.parcelId);
              return `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${t.taskId}</td>
                  <td><b>${t.parcelId}</b></td>
                  <td>${p ? `${p.village}, ${p.tehsil}` : 'Bhopal'}</td>
                  <td>${p ? `${p.area} acres` : '3.5 acres'}</td>
                  <td style="font-family:var(--font-mono);font-size:11px;">${t.gpsTarget ? `${t.gpsTarget.lat.toFixed(4)}, ${t.gpsTarget.lng.toFixed(4)}` : '23.2599, 77.4126'}</td>
                  <td><span class="badge ${t.status === 'Approved' ? 'badge-pos' : (t.status === 'Submitted' ? 'badge-available' : 'badge-disputed')}">${t.status}</span></td>
                  <td>
                    <button class="btn btn-sm ${t.status === 'Approved' ? 'btn-secondary' : 'btn-saffron'}" onclick="openFieldVerificationModal('${t.taskId}')">
                      ${t.status === 'Approved' ? (isHi ? 'अभिलेख देखें' : 'View Report') : (isHi ? '📍 सत्यापन प्रारंभ करें' : '📍 Verify on Ground')}
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==================== MODALS & ACTIONS ==================== */

function openNewProposalModal() {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  openModal(`
    <div class="modal-header">
      <div class="modal-title">${isHi ? 'नया भू-अधिग्रहण प्रस्ताव प्रस्तुत करें' : 'Submit New Land Acquisition Proposal'}</div>
      <button class="modal-close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <p style="font-size:11.5px;color:var(--gov-text-muted);margin-bottom:12px;">
        ${isHi ? 'परियोजना एजेंसी (NHAI/Railways) द्वारा लोक प्रयोजन हेतु सांविधिक भूमि अधिग्रहण प्रस्ताव का प्रारूप:' : 'Statutory land acquisition proposal submission by Land Requiring Body under Section 4 of RFCTLARR Act 2013:'}
      </p>
      <div class="formrow">
        <label>${isHi ? 'परियोजना / गलियारे का नाम' : 'Infrastructure Project Title'} <span class="req-star">*</span></label>
        <input id="prop-title" placeholder="e.g. NH-46 Expressway Feeder Link (Phase-III)" value="NH-46 Expressway Feeder Link (Phase-III)">
      </div>
      <div class="two-col">
        <div class="formrow">
          <label>${isHi ? 'क्षेत्र / मंत्रालय' : 'Sector / Department'}</label>
          <select id="prop-dept">${DEPARTMENTS.map(d => `<option>${d}</option>`).join('')}</select>
        </div>
        <div class="formrow">
          <label>${isHi ? 'राज्य' : 'State'}</label>
          <select id="prop-state">${STATES.map(s => `<option ${s === 'Madhya Pradesh' ? 'selected' : ''}>${s}</option>`).join('')}</select>
        </div>
      </div>
      <div class="two-col">
        <div class="formrow">
          <label>${isHi ? 'ज़िला' : 'District'}</label>
          <select id="prop-dist">${DISTRICTS.map(d => `<option>${d}</option>`).join('')}</select>
        </div>
        <div class="formrow">
          <label>${isHi ? 'आवश्यक भूमि (एकड़)' : 'Required Land (Acres)'} <span class="req-star">*</span></label>
          <input id="prop-area" type="number" value="38.5">
        </div>
      </div>
      <div class="formrow">
        <label>${isHi ? 'प्रस्ताव का लोक प्रयोजन एवं औचित्य' : 'Public Purpose Justification & Summary'} <span class="req-star">*</span></label>
        <textarea id="prop-just" rows="3">Greenfield corridor required to provide high-speed industrial freight connectivity from dry port to national highway trunk network.</textarea>
      </div>
      <div class="formrow">
        <label>${isHi ? 'संलग्न डीपीआर व संरेखण दस्तावेज़' : 'Attach Detailed Project Report (DPR / KML Alignment)'}</label>
        <input type="text" value="DPR_Feeder_Link_2026_Final.pdf (14.2 MB Uploaded)" disabled style="background:#f1f5f9;">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-primary btn-sm" onclick="submitProposalForm()">${isHi ? 'प्रस्ताव प्रेषित करें →' : 'Submit Proposal →'}</button>
    </div>
  `);
}

function submitProposalForm() {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const title = document.getElementById('prop-title').value.trim() || 'New Corridor Proposal';
  const area = parseFloat(document.getElementById('prop-area').value) || 25.0;
  const dept = document.getElementById('prop-dept').value;
  const state = document.getElementById('prop-state').value;
  const dist = document.getElementById('prop-dist').value;
  const just = document.getElementById('prop-just').value;

  const newProp = {
    id: 'PROP-2026-' + String((DB.proposals || []).length + 1).padStart(2, '0'),
    title: title,
    agency: CURRENT_USER.agency || 'NHAI',
    department: dept,
    state: state,
    district: dist,
    requiredArea: area,
    estimatedCost: Math.round(area * 3200000),
    justification: just,
    submittedDate: todayISO(),
    status: 'Under Scrutiny',
    scrutinyRemarks: 'Proposal received in Central Digital Repository. Dispatched to District CALA for preliminary scrutiny.',
    clarifications: []
  };

  DB.proposals.push(newProp);
  addAudit('Land Proposal Submitted', 'proposal', newProp.id, `${title} (${area} acres in ${dist}) submitted by ${CURRENT_USER.agency || 'Agency'}`);
  saveDB();
  closeModal();
  toast(isHi ? 'प्रस्ताव सफलतापूर्वक प्रस्तुत किया गया।' : 'Proposal submitted successfully to District CALA.');
  navigate('dashboard');
}

function openReplyClarificationModal(clarificationId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  openModal(`
    <div class="modal-header">
      <div class="modal-title">${isHi ? 'स्पष्टीकरण का उत्तर प्रेषित करें' : 'Respond to Authority Clarification Query'}</div>
      <button class="modal-close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="formrow">
        <label>${isHi ? 'स्पष्टीकरण उत्तर एवं अतिरिक्त विवरण' : 'Clarification Explanation / Supporting Statement'} <span class="req-star">*</span></label>
        <textarea id="clar-reply-text" rows="4" placeholder="Enter formal technical response to the authority query...">Revised survey alignment polygon coordinates updated in GIS database. 30-meter buffer around forest pillar established as per guideline.</textarea>
      </div>
      <div class="formrow">
        <label>${isHi ? 'संलग्न अतिरिक्त प्रमाण पत्र / नक्शा' : 'Attach Supplementary Document'}</label>
        <input type="text" value="Revised_Cadastral_Overlay_V2.pdf (4.8 MB)" disabled style="background:#f1f5f9;">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-saffron btn-sm" onclick="submitClarificationReply('${clarificationId}')">${isHi ? 'उत्तर प्रेषित करें →' : 'Submit Response →'}</button>
    </div>
  `);
}

function submitClarificationReply(clarificationId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const text = document.getElementById('clar-reply-text').value;

  (DB.projects || []).forEach(p => {
    (p.clarifications || []).forEach(cl => {
      if (cl.id === clarificationId) {
        cl.status = 'Resolved';
        cl.response = text;
        cl.respondedAt = todayISO();
      }
    });
  });

  addAudit('Clarification Response Submitted', 'clarification', clarificationId, text);
  saveDB();
  closeModal();
  toast(isHi ? 'स्पष्टीकरण उत्तर सफलतापूर्वक प्रेषित किया गया।' : 'Clarification response submitted to District CALA.');
  navigate('dashboard');
}

function openFieldVerificationModal(taskId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const task = (DB.fieldTasks || []).find(t => t.taskId === taskId) || DB.fieldTasks[0];
  const parcel = parcelById(task.parcelId) || DB.parcels[0];
  const owner = (DB.owners || []).find(o => o.id === parcel.ownerId);

  openModal(`
    <div class="modal-header">
      <div class="modal-title">📍 ${isHi ? `क्षेत्रीय सत्यापन फॉर्म — खसरा ${parcel.id}` : `Field Ground Verification — Parcel ${parcel.id}`}</div>
      <button class="modal-close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" style="max-height:75vh;overflow-y:auto;">
      <!-- Parcel & Owner Summary Card -->
      <div style="background:#f8fafc;border:1px solid var(--gov-border);padding:10px 14px;border-radius:4px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:var(--gov-navy);font-size:13px;">${parcel.id} (Khasra ${parcel.surveyNumber})</b>
          <span class="badge badge-active">${parcel.landType}</span>
        </div>
        <div class="small muted" style="margin-top:2px;">
          ${parcel.village}, ${parcel.tehsil}, ${parcel.district} &bull; Area: <b>${parcel.area} acres</b> &bull; Owner: <b>${owner ? owner.name : 'Amit Kumar'}</b>
        </div>
      </div>

      <!-- Step 1: Live GPS Capture -->
      <div style="border:1px solid var(--gov-border);border-radius:4px;padding:12px;margin-bottom:12px;">
        <div style="font-weight:700;font-size:12.5px;color:var(--gov-navy);display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span>1. 📍 Live GPS Coordinates Capture</span>
          <button class="btn btn-sm btn-saffron" id="btn-capture-gps" onclick="simulateGpsCapture(${parcel.lat}, ${parcel.lng})">
            📡 Capture Live GPS
          </button>
        </div>
        <div id="gps-display" style="background:#f1f5f9;padding:8px 12px;border-radius:3px;font-family:var(--font-mono);font-size:11.5px;color:#0f172a;">
          ${task.gpsCaptured ? `Lat: ${task.gpsCaptured.lat}, Lng: ${task.gpsCaptured.lng} (Accuracy: ±${task.gpsCaptured.accuracyMeters}m) [Captured ${task.gpsCaptured.capturedAt}]` : 'Awaiting GPS capture at parcel boundary...'}
        </div>
      </div>

      <!-- Step 2: Geo-Tagged Photo Capture -->
      <div style="border:1px solid var(--gov-border);border-radius:4px;padding:12px;margin-bottom:12px;">
        <div style="font-weight:700;font-size:12.5px;color:var(--gov-navy);display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span>2. 📸 Geo-Tagged Boundary Photo</span>
          <button class="btn btn-sm btn-primary" id="btn-capture-photo" onclick="simulatePhotoCapture()">
            📷 Snap / Upload Photo
          </button>
        </div>
        <div id="photo-display" style="text-align:center;">
          ${task.photoUrl ? `
            <img src="${task.photoUrl}" style="max-height:140px;border-radius:3px;border:1px solid var(--gov-border);margin-top:4px;">
            <div class="small muted" style="font-size:10px;margin-top:2px;">${task.photoTimestamp || 'Geo-Tagged Photo Attached'}</div>
          ` : `
            <div style="background:#f8fafc;border:1px dashed var(--gov-border);padding:18px;border-radius:3px;font-size:11px;color:var(--gov-text-muted);">
              No photo captured yet. Click "Snap / Upload Photo" to attach camera frame with GPS timestamp.
            </div>
          `}
        </div>
      </div>

      <!-- Step 3: On-Ground Verification Checklist -->
      <div style="border:1px solid var(--gov-border);border-radius:4px;padding:12px;margin-bottom:12px;">
        <div style="font-weight:700;font-size:12.5px;color:var(--gov-navy);margin-bottom:8px;">3. 📋 Ground Inspection Checklist</div>
        <div style="font-size:12px;display:flex;flex-direction:column;gap:6px;">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="chk-boundary" checked> <span>Boundary pillars demarcated and verified against RoR village map</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="chk-landuse" checked> <span>Physical land use matches cadastral record (${parcel.landType})</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="chk-encumbrance" checked> <span>No unauthorized structures, religious sites, or disputed encroachments</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="chk-doc" checked> <span>Landowner possession and identity verified on site</span>
          </label>
        </div>
      </div>

      <!-- Step 4: Remarks -->
      <div class="formrow">
        <label>${isHi ? 'सर्वेक्षक टिप्पणी एवं निष्कर्ष' : 'Field Surveyor Remarks & Observations'} <span class="req-star">*</span></label>
        <textarea id="field-remarks-input" rows="2">${task.fieldRemarks || 'Boundary demarcated as per 7/12 cadastral polygon. Clear possession with zero standing dispute.'}</textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">${isHi ? 'बंद करें' : 'Close'}</button>
      <button class="btn btn-saffron btn-sm" id="btn-submit-field-verif" onclick="submitFieldVerification('${task.taskId}')">
        📤 ${isHi ? 'सत्यापन प्रस्तुत करें (CALA समीक्षा हेतु) →' : 'Submit Verification to District CALA →'}
      </button>
    </div>
  `);
}

function simulateGpsCapture(baseLat, baseLng) {
  const disp = document.getElementById('gps-display');
  if (!disp) return;
  const lat = +(baseLat + (Math.random() - 0.5) * 0.0002).toFixed(6);
  const lng = +(baseLng + (Math.random() - 0.5) * 0.0002).toFixed(6);
  const acc = +(1.2 + Math.random() * 0.8).toFixed(1);
  const now = new Date().toLocaleTimeString('en-IN', { hour12: false });
  disp.innerHTML = `<span style="color:var(--gov-green);font-weight:700;">✓ GPS Lock (3D Fix):</span> Lat: ${lat}, Lng: ${lng} (Accuracy: ±${acc}m) [Captured at ${now} IST]`;
  toast('📍 Live GPS Coordinates Captured (±' + acc + 'm accuracy)');
}

function simulatePhotoCapture() {
  const disp = document.getElementById('photo-display');
  if (!disp) return;
  disp.innerHTML = `
    <img src="images/slide2.jpg" style="max-height:140px;border-radius:3px;border:1px solid var(--gov-border);margin-top:4px;">
    <div class="small muted" style="font-size:10.5px;color:var(--gov-green);font-weight:700;margin-top:2px;">
      ✓ Geo-Tagged Photo Attached: 23.2599° N, 77.4126° E [Timestamped IST]
    </div>
  `;
  toast('📷 Geo-tagged photograph captured and attached');
}

function submitFieldVerification(taskId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const task = (DB.fieldTasks || []).find(t => t.taskId === taskId);
  const remarks = document.getElementById('field-remarks-input')?.value || 'Field verified.';

  if (task) {
    task.status = 'Submitted';
    task.fieldRemarks = remarks;
    task.submittedAt = todayISO() + ' ' + new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
    task.checklist = {
      boundaryDemarcated: document.getElementById('chk-boundary')?.checked ?? true,
      landUseVerified: document.getElementById('chk-landuse')?.checked ?? true,
      encumbrancesChecked: document.getElementById('chk-encumbrance')?.checked ?? true,
      documentMatchedOnSite: document.getElementById('chk-doc')?.checked ?? true
    };
    if (!task.gpsCaptured) {
      task.gpsCaptured = { lat: 23.259912, lng: 77.412634, accuracyMeters: 1.4, capturedAt: task.submittedAt };
    }
    if (!task.photoUrl) {
      task.photoUrl = 'images/slide2.jpg';
      task.photoTimestamp = task.submittedAt;
    }

    const p = parcelById(task.parcelId);
    if (p) {
      p.fieldTask = task;
    }
  }

  addAudit('Field Verification Submitted', 'field_task', taskId, `Parcel ${task?.parcelId} verified on-ground by ${CURRENT_USER.name}`);
  saveDB();
  closeModal();
  toast(isHi ? 'क्षेत्रीय सत्यापन सफलतापूर्वक प्रस्तुत! ज़िला समाहर्ता (CALA) समीक्षा हेतु प्रेषित।' : 'Field verification submitted! Queued for District CALA review.');
  navigate('dashboard');
}