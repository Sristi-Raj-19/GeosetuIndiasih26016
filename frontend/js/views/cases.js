/* ==================== CASES & DETAIL ==================== */
ROUTES['cases'] = function(c){
  let filter = '';
  function draw(){
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const user = CURRENT_USER;
    const scopedCases = filterCasesByRole(DB.cases, user);
    const rows = scopedCases.filter(k=> !filter || k.status===filter);
    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'भू-अधिग्रहण प्रकरण (RFCTLARR 2013)' : 'Land Acquisition Cases (RFCTLARR 2013)'}</h2>
          <div class="muted small">${rows.length} ${isHi ? 'सक्रिय प्रकरण • 10-चरणीय वैधानिक निगरानी' : 'Active Statutory Cases • 10-Stage Pipeline'}</div>
        </div>
      </div>
      <div class="filterbar">
        <select id="case-filter"><option value="">${isHi ? 'सभी चरण' : 'All Stages'}</option>${WORKFLOW_STATES.map(s=>`<option value="${s}" ${filter===s?'selected':''}>${(typeof getWorkflowLabel === 'function') ? getWorkflowLabel(s) : WORKFLOW_LABELS[s]}</option>`).join('')}</select>
      </div>
      <div class="card" style="padding:0;"><div class="overflow-x"><table>
        <thead><tr>
          <th>${isHi ? 'प्रकरण संख्या' : 'Case ID'}</th>
          <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
          <th>${isHi ? 'अवसंरचना परियोजना' : 'Infrastructure Project'}</th>
          <th>${isHi ? 'खातेदार' : 'Landowner'}</th>
          <th>${isHi ? 'अधिग्रहण चरण' : 'Acquisition Stage'}</th>
          <th>${isHi ? 'अधिसूचना तिथि' : 'Notification Date'}</th>
          <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
        </tr></thead>
        <tbody>${rows.map(k=>{ const p=parcelById(k.parcelId); return `
          <tr><td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${k.id}</td><td><b>${k.parcelId}</b></td><td>${projectName(k.projectId)}</td>
          <td>${ownerName(p.ownerId)}</td><td>${workflowBadge(k.status)}</td><td>${fmtDate(k.createdAt)}</td>
          <td><button class="btn btn-sm btn-primary" data-open="${k.id}">${isHi ? 'प्रकरण देखें' : 'View Case'}</button></td></tr>`; }).join('') || `<tr><td colspan="7"><div class="empty">${isHi ? 'इस चरण में कोई प्रकरण नहीं है।' : 'No cases found in this stage.'}</div></td></tr>`}
        </tbody></table></div></div>
    `;
    c.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click', ()=>navigate('case-detail', b.dataset.open)));
    document.getElementById('case-filter').addEventListener('change', e=>{ filter=e.target.value; draw(); });
  }
  draw();
};

ROUTES['case-detail'] = function(c, id){
  const k = caseById(id);
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if(!k){ c.innerHTML=`<div class="empty">${isHi ? 'प्रकरण नहीं मिला।' : 'Case not found.'}</div>`; return; }
  draw();
  function draw(){
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const p = parcelById(k.parcelId);
    const docs = docsForCase(k.id);
    const approvals = approvalsForCase(k.id);
    const comp = compForCase(k.id);
    const next = WORKFLOW_NEXT[k.status];
    const canAdvance = hasPermission(PERMISSIONS.UPDATE_WORKFLOW, CURRENT_USER) || hasPermission(PERMISSIONS.MANAGE_APPROVALS, CURRENT_USER) || CURRENT_USER.role === 'ADMIN';
    const blockers = [];
    if(!canAdvance) blockers.push(isHi ? 'आपके पद को इस चरण को अग्रसारित करने की अनुमति नहीं है।' : 'Your role is not authorized to advance statutory milestones.');
    if(k.status==='VERIFICATION' && docs.some(d=>d.status!=='Verified')) blockers.push(isHi ? 'दस्तावेज़ सत्यापन पूर्ण होना अनिवार्य है।' : 'All statutory documents must be verified first.');
    if(k.status==='OBJECTION_REVIEW' && !hasPermission(PERMISSIONS.MANAGE_APPROVALS, CURRENT_USER) && CURRENT_USER.role!=='ADMIN') blockers.push(isHi ? 'सक्षम प्राधिकारी ही इस चरण का अनुमोदन कर सकते हैं।' : 'Only Competent Authority can approve this milestone.');

    const nextLabel = next ? ((typeof getWorkflowLabel === 'function') ? getWorkflowLabel(next) : WORKFLOW_LABELS[next]) : '';

    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'प्रकरण संख्या' : 'Case ID'}: ${k.id}</h2>
          <div class="muted small">${isHi ? 'खसरा' : 'Parcel'} ${p.id} &bull; ${projectName(k.projectId)} &bull; ${isHi ? 'खातेदार' : 'Owner'}: ${ownerName(p.ownerId)}</div>
        </div>
        <div style="display:flex;gap:8px;">${workflowBadge(k.status)}<button class="btn btn-sm btn-primary" id="btn-parcel">${isHi ? 'खसरा विवरण' : 'View Parcel'}</button></div>
      </div>
      <div class="card stat-card stripe-navy" style="margin-bottom:14px;overflow-x:auto;">
        <div class="card-title">${isHi ? 'वैधानिक चरण प्रगति' : 'Statutory Workflow Progression'}</div>
        ${renderStepper(k.status)}
        ${next ? `<div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
          <button class="btn btn-saffron btn-sm" id="btn-advance" ${!canAdvance||blockers.length?'disabled':''}>${isHi ? `अगले चरण “${nextLabel}” पर अग्रसारित करें` : `Advance to Stage: “${nextLabel}”`}</button>
          ${blockers.length? `<span class="small" style="color:var(--clay);font-weight:600;">⚠ ${blockers[0]}</span>`:''}
        </div>` : `<div class="small" style="color:var(--gov-green);margin-top:10px;font-weight:700;">${isHi ? '✓ यह प्रकरण पूर्ण हो चुका है (अधिग्रहण एवं हस्तांतरण संपन्न)।' : '✓ Acquisition & Handover Completed.'}</div>`}
      </div>
      <div class="grid g2">
        <div class="card">
          <div class="card-title">${isHi ? 'कार्यवाही इतिहास' : 'Action History'}</div>
          ${k.history.map(h=>`<div class="timeline-item"><div class="timeline-dot"></div><div style="flex:1;"><div style="font-size:12.5px;font-weight:700;color:var(--gov-navy);">${(typeof getWorkflowLabel === 'function') ? getWorkflowLabel(h.status) : WORKFLOW_LABELS[h.status]}</div><div class="small muted">${escapeHtml(h.user)} &bull; ${fmtDate(h.date)}</div></div></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-title">${isHi ? `संलग्न राजस्व दस्तावेज़ (${docs.length})` : `Attached Revenue Documents (${docs.length})`}</div>
          ${docs.map(d=>`<div class="kv" data-doc="${d.id}"><span>${d.type}</span><span>${docStatusBadge(d.status)}</span></div>`).join('') || `<div class="small muted">${isHi ? 'कोई दस्तावेज़ संलग्न नहीं है।' : 'No documents attached.'}</div>`}
          <button class="btn btn-sm btn-primary" style="margin-top:10px;" id="btn-goto-docs">${isHi ? 'दस्तावेज़ सत्यापन पोर्टल' : 'Document Verification Portal'}</button>
        </div>
      </div>
      <div class="grid g2" style="margin-top:14px;">
        <div class="card">
          <div class="card-title">${isHi ? 'सक्षम अनुमोदन' : 'Competent Authority Approvals'}</div>
          ${approvals.length? approvals.map(a=>`<div class="kv"><span>${a.approver}</span><span>${a.decision} &bull; ${fmtDate(a.date)}</span></div>`).join('') : `<div class="small muted">${isHi ? 'अनुमोदन अभी शेष है।' : 'Approval pending.'}</div>`}
          ${approvals.length? `<div class="small muted" style="margin-top:8px;">"${escapeHtml(approvals[0].remarks)}"</div>`:''}
        </div>
        <div class="card">
          <div class="card-title">${isHi ? 'प्रतिकर आकलन व भुगतान' : 'Compensation Award & DBT'}</div>
          ${comp ? `
            <div class="kv"><span>${isHi ? 'भूमि का मूल्य' : 'Base Land Value'}</span><span>${fmtINR(comp.landValue)}</span></div>
            <div class="kv"><span>${isHi ? 'परिसंपत्ति / संरचना मूल्य' : 'Structure Value'}</span><span>${fmtINR(comp.structureValue)}</span></div>
            <div class="kv"><span>${isHi ? 'सोलेशियम व अतिरिक्त भत्ते' : '100% Solatium & Assets'}</span><span>${fmtINR(comp.additional)}</span></div>
            <div class="kv"><span><b>${isHi ? 'कुल प्रतिकर एवार्ड' : 'Total Award'}</b></span><span><b>${fmtINR(comp.total)}</b></span></div>
            <div class="kv"><span>${isHi ? 'डीबीटी स्थिति' : 'DBT Status'}</span><span>${docStatusBadge(comp.paymentStatus==='Paid'?'Verified':(comp.paymentStatus==='Processing'?'Under Review':'Pending'))} ${comp.paymentStatus}</span></div>
          ` : `<div class="small muted">${isHi ? 'प्रतिकर आकलन चरण 6 पर निर्धारित होगा।' : 'Compensation will be assessed at Stage 6.'}</div>`}
        </div>
      </div>
    `;
    document.getElementById('btn-parcel').addEventListener('click', ()=>navigate('parcel-detail', p.id));
    document.getElementById('btn-goto-docs').addEventListener('click', ()=>navigate('documents'));
    const advBtn = document.getElementById('btn-advance');
    if(advBtn) advBtn.addEventListener('click', ()=> advanceCase(k, draw));
  }
};

function advanceCase(k, redraw){
  const next = WORKFLOW_NEXT[k.status];
  if(!next) return;
  const prevStatus = k.status;
  k.status = next;
  const today = todayISO();
  k.history.push({status:next, date:today, user:CURRENT_USER.name});
  const p = parcelById(k.parcelId);
  p.status = WORKFLOW_TO_PARCEL_STATUS[next];
  const nextLbl = (typeof getWorkflowLabel === 'function') ? getWorkflowLabel(next) : WORKFLOW_LABELS[next];
  addAudit(`Case moved to ${nextLbl}`, 'acquisition_case', k.id, `Parcel ${p.id}`);

  if(prevStatus==='OBJECTION_REVIEW' && next==='APPROVAL'){
    DB.approvals.push({ id:uid('APR'), caseId:k.id, approver:CURRENT_USER.name, decision:'Approved', date:today, remarks:'Section 15 objections resolved; acquisition approved.' });
    addAudit('Competent approval recorded', 'approval', k.id, `Approved by ${CURRENT_USER.name}`);
  }
  if(next==='COMPENSATION_ASSESSED' && !compForCase(k.id)){
    const landValue = Math.round(p.area * (rint ? rint(600000,1200000) : 800000));
    const structureValue = Math.random()<0.5 ? Math.round(landValue*0.1) : 0;
    const additional = Math.random()<0.3 ? Math.round(landValue*0.05) : 0;
    const total = landValue+structureValue+additional;
    DB.compensation.push({ id:uid('COMP'), caseId:k.id, landValue, structureValue, additional, total, paymentStatus:'Pending', paymentDate:null });
    addAudit('Compensation award calculated', 'compensation', k.id, `Award of ${fmtINR(total)} issued under RFCTLARR.`);
    addAlert('Compensation Delay', 'medium', `Case ${k.id} compensation award of ${fmtINR(total)} pending PFMS transfer.`, 'case', k.id);
  }
  if(next==='PAYMENT_COMPLETED'){
    const comp = compForCase(k.id);
    if(comp){ comp.paymentStatus='Paid'; comp.paymentDate=today; addAudit('DBT payment completed', 'compensation', k.id, fmtINR(comp.total)+' transferred to bank account.'); }
  }
  if(next==='LAND_ACQUIRED'){
    const proj = projectById(k.projectId);
    if(proj){ proj.acquiredArea = +(proj.acquiredArea + p.area).toFixed(2); }
    addAlert('Land Acquired', 'low', `Parcel ${p.id} acquired and possessed under Sec 38 for ${projectName(k.projectId)}.`, 'case', k.id);
  }
  if(next==='PROJECT_UTILIZATION'){
    const proj = projectById(k.projectId);
    if(proj){ proj.utilizedArea = +(proj.utilizedArea + p.area*0.6).toFixed(2); }
  }
  saveDB();
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  toast(isHi ? `प्रकरण “${nextLbl}” पर अग्रसारित किया गया।` : `Case advanced to "${nextLbl}".`);
  redraw();
};

/* ==================== POSSESSION & R&R (SECTION 38 & 31) ==================== */
ROUTES['possession-rr'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const cases = filterCasesByRole(DB.cases, user);
  const possessed = cases.filter(k => k.status === 'LAND_ACQUIRED' || k.status === 'PROJECT_UTILIZATION');
  const pendingPossession = cases.filter(k => k.status === 'PAYMENT_COMPLETED');
  const totalParcels = cases.length;

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'भौतिक आधिपत्य एवं पुनर्वास व पुनर्व्यवस्थापन (R&R)' : 'Physical Possession & Rehabilitation & Resettlement (R&R)'}</h2>
        <div class="muted small">${isHi ? 'RFCTLARR अधिनियम 2013 — धारा 38 (कब्ज़ा) व धारा 31 (पुनर्वास)' : 'RFCTLARR Act 2013 — Section 38 (Possession) & Section 31 (R&R Statutory Entitlements)'}</div>
      </div>
      ${hasPermission(PERMISSIONS.MANAGE_POSSESSION, user) ? `
        <button class="btn btn-primary btn-sm" onclick="toast('${isHi ? 'आधिपत्य ज्ञापन तैयार किया जा रहा है...' : 'Generating Sec 38 Possession Panchnama...'}')">
          📜 ${isHi ? 'धारा 38 आधिपत्य आदेश' : 'Issue Sec 38 Possession Order'}
        </button>
      ` : ''}
    </div>

    <!-- Metrics -->
    <div class="grid g4" style="margin-bottom:16px;">
      <div class="card stat-card stripe-green">
        <div class="card-title">${isHi ? 'हस्तांतरित भूखंड (Sec 38)' : 'Possession Transferred'}</div>
        <div class="stat-val">${possessed.length} / ${totalParcels}</div>
        <div class="small muted" style="color:var(--gov-green);font-weight:600;">${totalParcels ? Math.round((possessed.length/totalParcels)*100) : 0}% Handed Over</div>
      </div>
      <div class="card stat-card stripe-saffron">
        <div class="card-title">${isHi ? 'आधिपत्य लंबित भूखंड' : 'Possession Pending'}</div>
        <div class="stat-val">${pendingPossession.length}</div>
        <div class="small muted" style="color:var(--clay);">${isHi ? 'डीबीटी भुगतान पूर्ण • कब्जा शेष' : 'DBT Paid • Handover Due'}</div>
      </div>
      <div class="card stat-card stripe-navy">
        <div class="card-title">${isHi ? 'प्रभावित परिवार (PAF)' : 'Affected Families'}</div>
        <div class="stat-val">128 PAF</div>
        <div class="small muted">${isHi ? 'सर्वेक्षण सत्यापित' : 'SIA Baseline Surveyed'}</div>
      </div>
      <div class="card stat-card stripe-sky">
        <div class="card-title">${isHi ? 'विस्थापित परिवार (PDF)' : 'Displaced Families'}</div>
        <div class="stat-val">34 PDF</div>
        <div class="small muted">${isHi ? 'आवास भूखंड आवंटित' : 'R&R Plots Allotted'}</div>
      </div>
    </div>

    <!-- R&R Entitlements Summary -->
    <div class="grid g2" style="margin-bottom:16px;">
      <div class="card stat-card stripe-navy">
        <div class="card-title">🏡 ${isHi ? 'पुनर्वास एवं पुनर्व्यवस्थापन पैकेज (द्वितीय अनुसूची)' : 'R&R Statutory Entitlements Matrix (Second Schedule)'}</div>
        <div class="kv"><span>${isHi ? 'आवासीय भूखंड आवंटन' : 'Constructed House / Plot (Rural: 50 sqm)'}</span><span><span class="badge badge-pos">34 / 34 Allotted</span></span></div>
        <div class="kv"><span>${isHi ? 'एकमुश्त पुनर्वास अनुदान (₹50,000)' : 'One-Time Resettlement Allowance (₹50,000)'}</span><span><span class="badge badge-pos">100% Disbursed</span></span></div>
        <div class="kv"><span>${isHi ? 'पशुशाला / परिसंपत्ति परिवहन भत्ता' : 'Cattle Shed & Transport Allowance (₹50,000)'}</span><span><span class="badge badge-pos">28 Disbursed</span></span></div>
        <div class="kv"><span>${isHi ? 'कारीगर / व्यापारी एकमुश्त सहायता' : 'Artisan / Trader Grant (₹25,000)'}</span><span><span class="badge badge-pos">12 Disbursed</span></span></div>
      </div>

      <div class="card stat-card stripe-saffron">
        <div class="card-title">🚜 ${isHi ? 'धारा 38 वैधानिक पूर्व-शर्तें' : 'Section 38 Statutory Pre-requisites for Possession'}</div>
        <ul class="small" style="padding-left:18px;line-height:1.8;margin:0;">
          <li><b>Condition 1:</b> 100% of assessed compensation award (Base + Solatium + Interest) deposited into beneficiary bank account via PFMS DBT.</li>
          <li><b>Condition 2:</b> R&R monetary benefits and physical plot possession certificates handed over to Project Displaced Families (PDF).</li>
          <li><b>Condition 3:</b> 48-hour formal notice of taking possession served to occupant and Gram Panchayat.</li>
        </ul>
      </div>
    </div>

    <!-- Possession Cases Table -->
    <div class="card stat-card stripe-navy" style="padding:0;">
      <div class="card-title" style="padding:14px 18px 0;">📋 ${isHi ? 'प्रकरणवार भौतिक आधिपत्य स्थिति' : 'Case-Wise Handover & Physical Possession Register'}</div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'प्रकरण संख्या' : 'Case ID'}</th>
              <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
              <th>${isHi ? 'परियोजना' : 'Infrastructure Project'}</th>
              <th>${isHi ? 'खातेदार' : 'Landowner'}</th>
              <th>${isHi ? 'प्रतिकर स्थिति' : 'DBT Award'}</th>
              <th>${isHi ? 'आधिपत्य स्थिति' : 'Possession Status'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${cases.slice(0, 30).map(k => {
              const p = parcelById(k.parcelId) || {};
              const comp = compForCase(k.id);
              const isHandedOver = k.status === 'LAND_ACQUIRED' || k.status === 'PROJECT_UTILIZATION';
              return `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${k.id}</td>
                  <td><b>${k.parcelId}</b></td>
                  <td>${projectName(k.projectId)}</td>
                  <td>${ownerName(p.ownerId)}</td>
                  <td>
                    ${comp ? `<span class="badge ${comp.paymentStatus === 'Paid' ? 'badge-pos' : 'badge-warn'}">${comp.paymentStatus}: ${fmtINR(comp.total)}</span>` : '<span class="small muted">Pending</span>'}
                  </td>
                  <td>
                    <span class="badge ${isHandedOver ? 'badge-pos' : 'badge-neutral'}">
                      ${isHandedOver ? 'Possession Handed Over' : 'Pre-Possession'}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="navigate('case-detail', '${k.id}')">
                      ${isHi ? 'प्रकरण विवरण' : 'View Dossier'}
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
};