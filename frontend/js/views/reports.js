/* ==========================================================================
   EXECUTIVE & MIS STATUTORY REPORTS
   Role 1: CENTRAL, Role 2: STATE, Role 3: DISTRICT
   ========================================================================== */

ROUTES['reports'] = function(container) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const projects = filterProjectsByRole(DB.projects, user);
  const totalRequired = projects.reduce((s, p) => s + p.requiredArea, 0);
  const totalAcquired = projects.reduce((s, p) => s + p.acquiredArea, 0);
  const totalUtilized = projects.reduce((s, p) => s + p.utilizedArea, 0);
  const compRecords = DB.compensation || [];
  const totalComp = compRecords.reduce((s, c) => s + c.total, 0);
  const disbursedComp = compRecords.filter(c => c.paymentStatus === 'Paid').reduce((s, c) => s + c.total, 0);

  container.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'कार्यकारी एवं एमआईएस वैधानिक प्रतिवेदन' : 'Executive & MIS Statutory Reports'}</h2>
        <div class="muted small">${isHi ? 'नीति आयोग एवं पीएम गतिशक्ति समन्वय हेतु राष्ट्रीय प्रगति प्रतिवेदन' : 'High-Level Monitoring Reports for Ministry, PM GatiShakti & State Nodal Agencies'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="window.print()">
          🖨️ ${isHi ? 'प्रतिवेदन प्रिंट करें' : 'Print / Export PDF'}
        </button>
        <button class="btn btn-primary btn-sm" onclick="toast('${isHi ? 'एक्सेल स्प्रेडशीट निर्यात की गई।' : 'Excel MIS Workbook generated.'}')">
          📥 ${isHi ? 'एक्सेल निर्यात' : 'Export Excel'}
        </button>
      </div>
    </div>

    <!-- Executive KPI Grid -->
    <div class="grid g4" style="margin-bottom:16px;">
      <div class="card stat-card stripe-navy">
        <div class="card-title">${isHi ? 'कुल परियोजनाएं' : 'Monitored Projects'}</div>
        <div class="stat-val">${projects.length}</div>
        <div class="small muted">${isHi ? 'राष्ट्रीय अवसंरचना गलियारे' : 'National Corridors'}</div>
      </div>
      <div class="card stat-card stripe-saffron">
        <div class="card-title">${isHi ? 'भूमि अधिग्रहण पूर्णता' : 'Acquisition Progress'}</div>
        <div class="stat-val">${totalRequired ? Math.round((totalAcquired / totalRequired) * 100) : 0}%</div>
        <div class="small muted">${totalAcquired.toFixed(1)} / ${totalRequired.toFixed(1)} ac</div>
      </div>
      <div class="card stat-card stripe-green">
        <div class="card-title">${isHi ? 'डीबीटी वितरण दक्षता' : 'DBT Disbursal Ratio'}</div>
        <div class="stat-val">${totalComp ? Math.round((disbursedComp / totalComp) * 100) : 0}%</div>
        <div class="small muted">${fmtINR(disbursedComp)} / ${fmtINR(totalComp)}</div>
      </div>
      <div class="card stat-card stripe-sky">
        <div class="card-title">${isHi ? 'औसत प्रकरण निस्तारण' : 'Avg Case Velocity'}</div>
        <div class="stat-val">34 ${isHi ? 'दिवस' : 'Days'}</div>
        <div class="small muted" style="color:var(--gov-green);font-weight:600;">✓ 42% faster than 2023</div>
      </div>
    </div>

    <!-- State / District Performance Breakdown -->
    <div class="card stat-card stripe-navy" style="margin-bottom:16px;">
      <div class="card-title">📊 ${isHi ? 'राज्य एवं ज़िला-वार भौतिक व वित्तीय निष्पादन' : 'State / District-Wise Physical & Financial Acquisition Matrix'}</div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'राज्य / अधिकार क्षेत्र' : 'State / Jurisdiction'}</th>
              <th>${isHi ? 'परियोजना संख्या' : 'Projects'}</th>
              <th>${isHi ? 'आवश्यक भूमि' : 'Required Area'}</th>
              <th>${isHi ? 'अधिग्रहीत भूमि' : 'Acquired Area'}</th>
              <th>${isHi ? 'भौतिक प्रगति' : 'Physical Progress'}</th>
              <th>${isHi ? 'स्वीकृत प्रतिकर' : 'Award Assessed'}</th>
              <th>${isHi ? 'वितरित राशि (DBT)' : 'Disbursed (DBT)'}</th>
              <th>${isHi ? 'दक्षता सूचकांक' : 'Efficiency Index'}</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { state: 'Madhya Pradesh', prj: 3, req: 185.0, acq: 122.4, comp: 34500000, paid: 28900000, eff: '94.2%' },
              { state: 'Maharashtra', prj: 1, req: 65.0, acq: 48.5, comp: 18200000, paid: 16500000, eff: '91.0%' },
              { state: 'Uttar Pradesh', prj: 1, req: 80.0, acq: 32.0, comp: 22000000, paid: 14000000, eff: '78.5%' },
              { state: 'Gujarat', prj: 1, req: 45.0, acq: 38.0, comp: 15400000, paid: 15400000, eff: '98.0%' },
              { state: 'Karnataka', prj: 1, req: 30.0, acq: 12.0, comp: 9800000, paid: 6200000, eff: '72.4%' }
            ].map(row => `
              <tr>
                <td><b>${row.state}</b></td>
                <td>${row.prj}</td>
                <td>${row.req} ac</td>
                <td>${row.acq} ac</td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <div class="progress-track" style="width:80px;height:6px;"><div class="progress-fill" style="width:${Math.round(row.acq/row.req*100)}%;"></div></div>
                    <span class="small font-mono">${Math.round(row.acq/row.req*100)}%</span>
                  </div>
                </td>
                <td class="font-mono">${fmtINR(row.comp)}</td>
                <td class="font-mono" style="color:var(--gov-green);font-weight:700;">${fmtINR(row.paid)}</td>
                <td><span class="badge badge-pos">${row.eff}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statutory Pipeline Compliance Table -->
    <div class="grid g2">
      <div class="card stat-card stripe-saffron">
        <div class="card-title">⚖️ ${isHi ? 'वैधानिक समय-सीमा अनुपालन (RFCTLARR Act 2013)' : 'Statutory Timeline Compliance (RFCTLARR Act 2013)'}</div>
        <div class="kv"><span>Section 4 to Section 11 (Max 12 Months)</span><span><span class="badge badge-pos">Avg 4.2 Mos</span></span></div>
        <div class="kv"><span>Section 15 Objection Hearings</span><span><span class="badge badge-pos">100% Disposed</span></span></div>
        <div class="kv"><span>Section 26-30 Award Determination</span><span><span class="badge badge-pos">Avg 28 Days</span></span></div>
        <div class="kv"><span>Section 38 Physical Possession</span><span><span class="badge badge-warn">8 Cases Delayed</span></span></div>
        <div class="kv"><span>Section 31 R&R Entitlements</span><span><span class="badge badge-pos">96% Compliant</span></span></div>
      </div>

      <div class="card stat-card stripe-sky">
        <div class="card-title">🤖 ${isHi ? 'एआई निर्णय सारांश' : 'AI Strategic Summary (Llama 3.2 Synthesis)'}</div>
        <p class="small" style="line-height:1.6;color:var(--gov-text-muted);margin:0 0 10px;">
          ${isHi 
            ? 'मध्य प्रदेश एवं गुजरात राज्यों में डीबीटी भुगतान तथा भू-अधिग्रहण गति राष्ट्रीय औसत से 24% अधिक है। उत्तर प्रदेश एवं कर्नाटक में धारा 38 के अंतर्गत भौतिक आधिपत्य एवं संरचना मुल्यांकन में विलंब चिन्हित किया गया है, जिसके समाधान हेतु अतिरिक्त संयुक्त माप सर्वेक्षण दल (JMS) तैनात करने की अनुशंसा की जाती है।'
            : 'Acquisition velocity and DBT compensation disbursements in Madhya Pradesh and Gujarat exceed national benchmarks by 24%. In Uttar Pradesh and Karnataka, physical possession under Section 38 is experiencing structural assessment delays. Deployment of additional Joint Measurement Survey (JMS) teams is recommended.'}
        </p>
        <button class="btn btn-saffron btn-sm" onclick="navigate('bottlenecks')">
          ⚡ ${isHi ? 'विस्तृत बॉटलनेक विश्लेषण' : 'View AI Bottleneck Radar'}
        </button>
      </div>
    </div>
  `;
};
