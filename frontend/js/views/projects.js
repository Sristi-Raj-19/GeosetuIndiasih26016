/* ==================== PROJECTS & MONITORING ==================== */
ROUTES['projects'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const filteredProjects = filterProjectsByRole(DB.projects, user);
  const canCreate = hasPermission(PERMISSIONS.CREATE_PROJECT, user);

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'राष्ट्रीय अवसंरचना परियोजनाएं' : 'National Infrastructure Projects'}</h2>
        <div class="muted small">${filteredProjects.length} ${isHi ? 'पीएम गतिशक्ति एवं प्राथमिकता अवसंरचना कार्य' : 'PM GatiShakti & Priority Infrastructure Works'}</div>
      </div>
      ${canCreate ? `<button class="btn btn-primary btn-sm" id="btn-new-project">${isHi ? '+ नई परियोजना जोड़ें' : '+ Register New Project'}</button>`:''}
    </div>
    <div class="grid g3">
      ${filteredProjects.map(p=>{
        const pct = Math.min(100, Math.round((p.acquiredArea/p.requiredArea)*100));
        return `<div class="card stat-card stripe-navy">
          <div style="display:flex;justify-content:space-between;"><h3 style="font-size:14px;color:var(--gov-navy);">${p.name}</h3></div>
          <div class="small muted" style="margin-bottom:8px;">${p.department} &bull; ${p.location} ${p.state ? `&bull; ${p.state}` : ''}</div>
          <div class="kv"><span>${isHi ? 'आवश्यक भूमि' : 'Required Land'}</span><span>${p.requiredArea} acres</span></div>
          <div class="kv"><span>${isHi ? 'अधिग्रहीत भूमि' : 'Acquired Land'}</span><span>${p.acquiredArea} acres</span></div>
          <div class="kv"><span>${isHi ? 'उपयोगित भूमि' : 'Utilized Land'}</span><span>${p.utilizedArea} acres</span></div>
          <div class="progress-track" style="margin-top:10px;"><div class="progress-fill" style="width:${pct}%;"></div></div>
          <div class="small muted" style="margin-top:4px;font-weight:600;">${pct}% ${isHi ? 'भूमि अधिग्रहण संपन्न' : 'Land Acquired'}</div>
          <button class="btn btn-sm btn-primary" style="margin-top:10px;width:100%;" data-open="${p.id}">${isHi ? 'परियोजना विवरण देखें' : 'View Project Dossier'}</button>
        </div>`;
      }).join('') || `<div class="empty" style="grid-column:1/-1;">${isHi ? 'कोई अधिकृत परियोजना नहीं मिली।' : 'No authorized projects found for your role.'}</div>`}
    </div>
  `;
  c.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click', ()=>navigate('project-detail', b.dataset.open)));
  const nb = document.getElementById('btn-new-project');
  if(nb) nb.addEventListener('click', openNewProjectModal);
};

/* ==================== PROJECT PROPOSALS ==================== */
ROUTES['proposals'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const proposals = DB.proposals || [];
  const clarifications = DB.clarifications || [];
  const canSubmit = hasPermission(PERMISSIONS.SUBMIT_PROPOSAL, user);

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'भूमि अधिग्रहण प्रस्ताव एवं संस्वीकृति' : 'Land Acquisition Proposals & Digital Scrutiny'}</h2>
        <div class="muted small">${proposals.length} ${isHi ? 'संस्थानिक प्रस्ताव • डिजिटल संवीक्षा एवं स्पष्टीकरण' : 'Institutional Proposals • Scrutiny, Clearances & Clarifications'}</div>
      </div>
      ${canSubmit ? `
        <button class="btn btn-primary btn-sm" id="btn-create-proposal">
          + ${isHi ? 'नया प्रस्ताव प्रस्तुत करें' : 'Submit New Land Proposal'}
        </button>
      ` : ''}
    </div>

    <!-- Summary Metrics -->
    <div class="grid g4" style="margin-bottom:16px;">
      <div class="card stat-card stripe-navy">
        <div class="card-title">${isHi ? 'कुल प्रस्ताव' : 'Total Proposals'}</div>
        <div class="stat-val">${proposals.length}</div>
        <div class="small muted">${isHi ? 'प्रस्तुत संस्वीकृति मांग' : 'Submitted Requirements'}</div>
      </div>
      <div class="card stat-card stripe-saffron">
        <div class="card-title">${isHi ? 'संवीक्षाधीन प्रस्ताव' : 'Under Scrutiny'}</div>
        <div class="stat-val">${proposals.filter(p => p.status === 'Digital Scrutiny' || p.status === 'Submitted').length}</div>
        <div class="small muted" style="color:var(--clay);">${isHi ? 'राजस्व विभाग समीक्षा' : 'Revenue Scrutiny'}</div>
      </div>
      <div class="card stat-card stripe-sky">
        <div class="card-title">${isHi ? 'स्पष्टीकरण लंबित' : 'Clarifications Active'}</div>
        <div class="stat-val">${clarifications.filter(cl => cl.status === 'Pending').length}</div>
        <div class="small muted">${isHi ? 'प्रतिक्रिया प्रतीक्षित' : 'Responses Awaited'}</div>
      </div>
      <div class="card stat-card stripe-green">
        <div class="card-title">${isHi ? 'अनुमोदित प्रस्ताव' : 'Approved Proposals'}</div>
        <div class="stat-val">${proposals.filter(p => p.status === 'Approved').length}</div>
        <div class="small muted" style="color:var(--gov-green);font-weight:600;">${isHi ? 'अधिसूचना हेतु तैयार' : 'Ready for Sec 4'}</div>
      </div>
    </div>

    <!-- Proposals Table -->
    <div class="card stat-card stripe-navy" style="margin-bottom:16px;padding:0;">
      <div class="card-title" style="padding:14px 18px 0;">📋 ${isHi ? 'प्रस्ताव सूची एवं वर्तमान स्थिति' : 'Proposal Pipeline & Approval Lifecycle'}</div>
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'प्रस्ताव क्रमांक' : 'Proposal ID'}</th>
              <th>${isHi ? 'परियोजना शीर्षक' : 'Project Title'}</th>
              <th>${isHi ? 'अध्येता निकाय (Agency)' : 'Requiring Body'}</th>
              <th>${isHi ? 'ज़िला व राज्य' : 'Location'}</th>
              <th>${isHi ? 'मांगी गई भूमि' : 'Target Land'}</th>
              <th>${isHi ? 'स्थिति' : 'Lifecycle Stage'}</th>
              <th>${isHi ? 'प्रस्तुति तिथि' : 'Submitted'}</th>
            </tr>
          </thead>
          <tbody>
            ${proposals.map(p => `
              <tr>
                <td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${p.id}</td>
                <td><b>${p.title}</b></td>
                <td>${p.agency}</td>
                <td>${p.district}, ${p.state}</td>
                <td>${p.areaRequired} ac</td>
                <td><span class="badge ${p.status === 'Approved' ? 'badge-pos' : (p.status === 'Digital Scrutiny' ? 'badge-warn' : 'badge-neutral')}">${p.status}</span></td>
                <td>${fmtDate(p.submittedAt)}</td>
              </tr>
            `).join('') || `<tr><td colspan="7"><div class="empty">${isHi ? 'कोई प्रस्ताव नहीं मिला।' : 'No proposals found.'}</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Clarification Inbox -->
    <div class="card stat-card stripe-saffron">
      <div class="card-title">💬 ${isHi ? 'शासकीय स्पष्टीकरण एवं पृच्छाएं' : 'Statutory Clarifications & Inquiries'}</div>
      ${clarifications.map(cl => `
        <div style="border-bottom:1px dashed var(--gov-border);padding:10px 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:700;font-size:12.5px;color:var(--gov-navy);">${cl.id}: ${cl.subject}</div>
            <span class="badge ${cl.status === 'Pending' ? 'badge-warn' : 'badge-pos'}">${cl.status}</span>
          </div>
          <div class="small muted" style="margin-top:4px;">${cl.query}</div>
          <div class="small" style="font-size:11px;color:var(--gov-text-light);margin-top:2px;">
            ${isHi ? 'प्रेषक' : 'From'}: ${cl.from} &bull; ${isHi ? 'प्राप्तकर्ता' : 'To'}: ${cl.to} &bull; ${fmtDate(cl.date)}
          </div>
          ${cl.status === 'Pending' && (user.role === 'PROJECT_AGENCY' || user.role === 'ADMIN') ? `
            <div style="margin-top:8px;">
              <button class="btn btn-sm btn-saffron" onclick="openClarificationReplyModal('${cl.id}')">
                ✍️ ${isHi ? 'स्पष्टीकरण उत्तर दें' : 'Respond to Inquiry'}
              </button>
            </div>
          ` : ''}
        </div>
      `).join('') || `<div class="empty small">${isHi ? 'कोई स्पष्टीकरण लंबित नहीं है।' : 'No clarifications active.'}</div>`}
    </div>
  `;

  const btnCreate = document.getElementById('btn-create-proposal');
  if (btnCreate) btnCreate.addEventListener('click', openNewProposalModal);
};

function openNewProposalModal() {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  openModal(`
    <h3 style="margin-bottom:12px;color:var(--gov-navy);">📝 ${isHi ? 'नया भू-अधिग्रहण प्रस्ताव प्रस्तुत करें' : 'Submit New Land Acquisition Proposal'}</h3>
    <div class="formrow"><label>${isHi ? 'परियोजना शीर्षक' : 'Project Title'} <span class="req-star">*</span></label><input id="prop-title" placeholder="e.g. NHAI 4-Lane Greenfield Bypass Alignment" required></div>
    <div class="two-col">
      <div class="formrow"><label>${isHi ? 'अध्येता निकाय (Agency)' : 'Requiring Body'}</label><input id="prop-agency" value="${CURRENT_USER.agency || 'NHAI'}" readonly></div>
      <div class="formrow"><label>${isHi ? 'आवश्यक भूमि (एकड़)' : 'Required Area (Acres)'} <span class="req-star">*</span></label><input id="prop-area" type="number" value="65.0" step="0.1" required></div>
    </div>
    <div class="two-col">
      <div class="formrow"><label>${isHi ? 'राज्य' : 'State'}</label><select id="prop-state"><option value="Madhya Pradesh">Madhya Pradesh</option><option value="Maharashtra">Maharashtra</option><option value="Uttar Pradesh">Uttar Pradesh</option><option value="Gujarat">Gujarat</option></select></div>
      <div class="formrow"><label>${isHi ? 'ज़िला' : 'District'}</label><select id="prop-dist"><option value="Bhopal">Bhopal</option><option value="Nagpur">Nagpur</option><option value="Pune">Pune</option><option value="Lucknow">Lucknow</option></select></div>
    </div>
    <div class="formrow"><label>${isHi ? 'परियोजना का औचित्य एवं जन-उद्देश्य' : 'Public Purpose Justification & Scope'}</label><textarea id="prop-just" rows="2" placeholder="State the statutory public purpose under RFCTLARR Act 2013..."></textarea></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;">
      <button class="btn btn-secondary" onclick="closeModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-primary" id="btn-save-prop">✓ ${isHi ? 'प्रस्ताव प्रस्तुत करें' : 'Submit Proposal'}</button>
    </div>
  `);

  document.getElementById('btn-save-prop').addEventListener('click', () => {
    const title = document.getElementById('prop-title').value.trim() || 'New Infrastructure Alignment';
    const area = parseFloat(document.getElementById('prop-area').value) || 50.0;
    const state = document.getElementById('prop-state').value;
    const district = document.getElementById('prop-dist').value;
    const id = uid('PROP');

    DB.proposals.push({
      id,
      title,
      agency: CURRENT_USER.agency || 'NHAI',
      state,
      district,
      areaRequired: area,
      status: 'Digital Scrutiny',
      submittedAt: todayISO(),
      submittedBy: CURRENT_USER.name
    });

    addAudit(`Land proposal ${id} submitted`, 'proposal', id, `${title} in ${district}, ${state}`);
    addAlert('New Land Acquisition Proposal', 'medium', `${CURRENT_USER.agency || 'Project Agency'} submitted new proposal ${id} for ${area} acres in ${district}.`, 'proposal', id);

    saveDB();
    closeModal();
    toast(isHi ? '✓ प्रस्ताव सफलतापूर्वक राजस्व विभाग को प्रस्तुत किया गया।' : '✓ Proposal submitted for Digital Scrutiny.');
    navigate('proposals');
  });
}

function openClarificationReplyModal(clId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const cl = (DB.clarifications || []).find(x => x.id === clId);
  if (!cl) return;

  openModal(`
    <h3 style="margin-bottom:12px;color:var(--gov-navy);">✍️ ${isHi ? 'स्पष्टीकरण उत्तर दर्ज करें' : 'Respond to Statutory Clarification'}</h3>
    <div class="small muted" style="margin-bottom:10px;"><b>${cl.subject}</b></div>
    <div class="small" style="background:#f8fafc;padding:10px;border:1px solid var(--gov-border);margin-bottom:12px;">"${cl.query}"</div>
    <div class="formrow"><label>${isHi ? 'उत्तर एवं संलग्न प्रमाण' : 'Official Response & Clarification'}</label><textarea id="cl-reply" rows="3" placeholder="Provide requested cadastral alignment clarification or revised DPR coordinates..."></textarea></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;">
      <button class="btn btn-secondary" onclick="closeModal()">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-primary" id="btn-submit-cl-reply">✓ ${isHi ? 'उत्तर प्रेषित करें' : 'Send Clarification'}</button>
    </div>
  `);

  document.getElementById('btn-submit-cl-reply').addEventListener('click', () => {
    cl.status = 'Answered';
    cl.response = document.getElementById('cl-reply').value.trim() || 'Clarification furnished.';
    addAudit(`Clarification ${cl.id} answered`, 'clarification', cl.id, `Answered by ${CURRENT_USER.name}`);
    saveDB();
    closeModal();
    toast(isHi ? '✓ स्पष्टीकरण सफलतापूर्वक प्रेषित किया गया।' : '✓ Clarification response submitted.');
    navigate('proposals');
  });
}

function openNewProjectModal(){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  openModal(`
    <h3 style="margin-bottom:14px;color:var(--gov-navy);">${isHi ? 'नई अवसंरचना परियोजना पंजीकृत करें' : 'Register New Infrastructure Project'}</h3>
    <div class="formrow"><label>${isHi ? 'परियोजना का नाम' : 'Project Name'}</label><input id="np-name" placeholder="${isHi ? 'उदा. NH-46 6-लेन एक्सप्रेसवे विस्तार' : 'e.g. NH-46 6-Lane Expressway Extension'}"></div>
    <div class="two-col">
      <div class="formrow"><label>${isHi ? 'क्षेत्र / कार्य' : 'Sector / Type'}</label><select id="np-type">${PROJECT_TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div class="formrow"><label>${isHi ? 'मंत्रालय / विभाग' : 'Ministry / Department'}</label><select id="np-dept">${DEPARTMENTS.map(t=>`<option>${t}</option>`).join('')}</select></div>
    </div>
    <div class="two-col">
      <div class="formrow"><label>${isHi ? 'ज़िला' : 'District'}</label><select id="np-loc">${DISTRICTS.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div class="formrow"><label>${isHi ? 'आवश्यक भूमि (एकड़)' : 'Required Land (Acres)'}</label><input id="np-area" type="number" value="40"></div>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
      <button class="btn" id="np-cancel">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-primary" id="np-submit">${isHi ? 'परियोजना पंजीकृत करें' : 'Register Project'}</button>
    </div>
  `);
  document.getElementById('np-cancel').addEventListener('click', closeModal);
  document.getElementById('np-submit').addEventListener('click', ()=>{
    const name = document.getElementById('np-name').value.trim() || (isHi ? 'अनाम अवसंरचना कार्य' : 'Untitled Infrastructure Work');
    const id = 'PRJ-'+String(DB.projects.length+1).padStart(3,'0');
    const start = todayISO();
    DB.projects.push({ id, name, type:document.getElementById('np-type').value, department:document.getElementById('np-dept').value,
      location:document.getElementById('np-loc').value, requiredArea:+document.getElementById('np-area').value||10, acquiredArea:0, utilizedArea:0,
      startDate:start, targetDate: addDaysISO(start, 500), status:'In Progress' });
    DB.monitoring.push({ projectId:id, landAcquiredPct:0, landUtilizedPct:0, compensationPaidPct:0, plannedProgress:0, expectedProgress:2, actualProgress:0, lastUpdate:start });
    addAudit('Infrastructure project created', 'project', id, name);
    saveDB(); closeModal(); toast(isHi ? 'परियोजना सफलतापूर्वक पंजीकृत।' : 'Project registered successfully.'); navigate('project-detail', id);
  });
}

ROUTES['project-detail'] = function(c, id){
  const p = projectById(id);
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  if(!p){ c.innerHTML=`<div class="empty">${isHi ? 'परियोजना नहीं मिली।' : 'Project not found.'}</div>`; return; }
  const cases = DB.cases.filter(k=>k.projectId===id);
  const m = DB.monitoring.find(x=>x.projectId===id);
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${p.name}</h2>
        <div class="muted small">${p.department} &bull; ${p.location} &bull; ${isHi ? 'लक्ष्य तिथि' : 'Target Date'}: ${fmtDate(p.targetDate)}</div>
      </div>
      <span class="${statusBadgeClass(p.status)}">${p.status}</span>
    </div>
    <div class="grid g4" style="margin-bottom:16px;">
      ${statCard(isHi ? 'आवश्यक भूमि' : 'Target Land', p.requiredArea+' ac', isHi ? 'कुल लक्षित अधिग्रहण' : 'Target Acquisition', '', 'stripe-navy')}
      ${statCard(isHi ? 'अधिग्रहीत भूमि' : 'Acquired Land', p.acquiredArea+' ac', Math.round(p.acquiredArea/p.requiredArea*100)+'% '+(isHi ? 'संपन्न' : 'of Target'), '', 'stripe-green')}
      ${statCard(isHi ? 'उपयोगित भूमि' : 'Utilized Land', p.utilizedArea+' ac', isHi ? 'निर्माणरत' : 'Under Construction', '', 'stripe-sky')}
      ${statCard(isHi ? 'संबद्ध प्रकरण' : 'Active Cases', cases.length, isHi ? 'राजस्व अधिग्रहण प्रकरण' : 'Active Revenue Cases', '', 'stripe-saffron')}
    </div>
    ${m? `<div class="card stat-card stripe-navy" style="margin-bottom:16px;">
      <div class="card-title">${isHi ? 'परियोजना प्रगति डैशबोर्ड (प्रगति)' : 'Project Progress Monitor (PRAGATI)'}</div>
      <div class="grid g3">
        <div><div class="small muted">${isHi ? 'अपेक्षित प्रगति' : 'Expected Progress'}</div><div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${m.expectedProgress}%;background:var(--slate);"></div></div><div class="small" style="margin-top:3px;font-weight:700;">${m.expectedProgress}%</div></div>
        <div><div class="small muted">${isHi ? 'वास्तविक प्रगति' : 'Actual Progress'}</div><div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${m.actualProgress}%;background:var(--gov-green);"></div></div><div class="small" style="margin-top:3px;font-weight:700;">${m.actualProgress}%</div></div>
        <div><div class="small muted">${isHi ? 'प्रतिकर डीबीटी वितरण' : 'DBT Compensation Disbursed'}</div><div class="progress-track" style="margin-top:6px;"><div class="progress-fill" style="width:${m.compensationPaidPct}%;background:var(--gov-saffron);"></div></div><div class="small" style="margin-top:3px;font-weight:700;">${m.compensationPaidPct}%</div></div>
      </div>
      <button class="btn btn-sm btn-primary" style="margin-top:12px;" id="goto-monitor">${isHi ? 'पूर्ण निगरानी डैशबोर्ड खोलें' : 'Open Milestone Monitor'}</button>
    </div>`:''}
    <div class="card" style="padding:0;">
      <div class="card-title" style="padding:14px 18px 0;">${isHi ? 'इस परियोजना से संबद्ध अधिग्रहण प्रकरण' : 'Associated Acquisition Cases'}</div>
      <div class="overflow-x"><table><thead><tr>
        <th>${isHi ? 'प्रकरण संख्या' : 'Case ID'}</th>
        <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
        <th>${isHi ? 'खातेदार' : 'Landowner'}</th>
        <th>${isHi ? 'अधिग्रहण चरण' : 'Acquisition Stage'}</th>
        <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
      </tr></thead>
      <tbody>${cases.map(k=>{ const parc=parcelById(k.parcelId); return `<tr><td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${k.id}</td><td><b>${k.parcelId}</b></td><td>${ownerName(parc.ownerId)}</td><td>${workflowBadge(k.status)}</td><td><button class="btn btn-sm btn-primary" data-open="${k.id}">${isHi ? 'प्रकरण देखें' : 'View Case'}</button></td></tr>`; }).join('') || `<tr><td colspan="5"><div class="empty">${isHi ? 'कोई प्रकरण संबद्ध नहीं है।' : 'No cases associated.'}</div></td></tr>`}</tbody></table></div>
    </div>
  `;
  c.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click', ()=>navigate('case-detail', b.dataset.open)));
  const gm = document.getElementById('goto-monitor'); if(gm) gm.addEventListener('click', ()=>navigate('monitoring'));
};

ROUTES['monitoring'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'परियोजना प्रगति निगरानी (प्रगति)' : 'PRAGATI National Milestone Monitor'}</h2>
        <div class="muted small">${isHi ? 'भौतिक प्रगति बनाम वैधानिक समय-सीमा का वास्तविक समय मूल्यांकन' : 'Real-time Comparison of Physical Progress vs. Statutory Acquisition Timeline'}</div>
      </div>
    </div>
    <div class="grid g3">
    ${DB.monitoring.map(m=>{
      const p = projectById(m.projectId);
      const delayed = m.actualProgress < m.expectedProgress - 10;
      return `<div class="card stat-card ${delayed?'stripe-clay':'stripe-green'}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="font-size:13.5px;color:var(--gov-navy);">${p.name}</h3>
          ${delayed? `<span class="badge badge-disputed">${isHi ? 'प्रगति विलंबित' : 'Delayed'}</span>` : `<span class="badge badge-available">${isHi ? 'प्रगति संतोषजनक' : 'On Track'}</span>`}
        </div>
        <div class="small muted" style="margin-bottom:8px;">${isHi ? 'अंतिम अद्यतन' : 'Last Updated'}: ${fmtDate(m.lastUpdate)}</div>
        <div class="small muted">${isHi ? 'भूमि अधिग्रहण' : 'Land Acquired'}: <b>${m.landAcquiredPct}%</b></div>
        <div class="progress-track" style="margin:3px 0 7px;"><div class="progress-fill" style="width:${m.landAcquiredPct}%;"></div></div>
        <div class="small muted">${isHi ? 'भूमि उपयोगिता' : 'Land Utilized'}: <b>${m.landUtilizedPct}%</b></div>
        <div class="progress-track" style="margin:3px 0 7px;"><div class="progress-fill" style="width:${m.landUtilizedPct}%;background:#6b21a8;"></div></div>
        <div class="small muted">${isHi ? 'प्रतिकर डीबीटी' : 'DBT Compensation'}: <b>${m.compensationPaidPct}%</b></div>
        <div class="progress-track" style="margin:3px 0 7px;"><div class="progress-fill" style="width:${m.compensationPaidPct}%;background:var(--gov-saffron);"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-top:6px;"><span>${isHi ? 'लक्ष्य' : 'Target'}: <b>${m.expectedProgress}%</b></span><span>${isHi ? 'वास्तविक' : 'Actual'}: <b>${m.actualProgress}%</b></span></div>
        ${(CURRENT_USER.role==='PROJECT_AUTHORITY'||CURRENT_USER.role==='ADMIN') ? `
        <div style="display:flex;gap:6px;margin-top:10px;">
          <button class="btn btn-sm" data-adj="${m.projectId}" data-dir="-1">${isHi ? '− प्रगति घटाएं' : '− Adjust'}</button>
          <button class="btn btn-sm btn-primary" data-adj="${m.projectId}" data-dir="1">${isHi ? '+ प्रगति दर्ज करें' : '+ Record Progress'}</button>
        </div>` : ''}
      </div>`;
    }).join('')}
    </div>
  `;
  c.querySelectorAll('[data-adj]').forEach(b=>b.addEventListener('click', ()=>{
    const m = DB.monitoring.find(x=>x.projectId===b.dataset.adj);
    m.actualProgress = Math.max(0, Math.min(100, m.actualProgress + 5*(+b.dataset.dir)));
    m.lastUpdate = todayISO();
    addAudit('Project progress updated', 'project', b.dataset.adj, `Progress set to ${m.actualProgress}%`);
    if(m.actualProgress < m.expectedProgress-10) addAlert('Project Delay','high',`Project ${b.dataset.adj} trails schedule target.`,'project', b.dataset.adj);
    saveDB(); toast(isHi ? 'परियोजना प्रगति अद्यतन की गई।' : 'Project progress updated.'); navigate('monitoring');
  }));
};

/* ==================== DECISION SUPPORT ==================== */
ROUTES['decision-support'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  function draw(projectId){
    const proj = projectById(projectId) || DB.projects[0];
    const candidates = DB.parcels.filter(p=>!p.caseId && p.status!=='Disputed').slice(0,3);
    const scored = candidates.map(p=>{
      const docsComplete = p.documentStatus==='Verified' ? 100 : (p.documentStatus==='Under Review'?70:(p.documentStatus==='Uploaded'?50:20));
      const dist = Math.sqrt(Math.pow(p.lat-BASE_LAT,2)+Math.pow(p.lng-BASE_LNG,2));
      const proximity = Math.max(0, 100 - dist*900);
      const areaFit = Math.max(0, 100 - Math.abs(p.area-10)*6);
      const ownerSimplicity = 90;
      const disputeFree = p.status==='Disputed' ? 0 : 100;
      const factors = [
        {label: isHi ? 'राजस्व दस्तावेज़ पूर्णता (30%)' : 'Document Completeness (30%)', value:Math.round(docsComplete), weight:.3},
        {label: isHi ? 'परियोजना गलियारा निकटता (25%)' : 'Corridor Proximity (25%)', value:Math.round(proximity), weight:.25},
        {label: isHi ? 'क्षेत्रफल अनुकूलता (20%)' : 'Area Fit (20%)', value:Math.round(areaFit), weight:.2},
        {label: isHi ? 'भू-स्वामित्व सरलता (15%)' : 'Ownership Simplicity (15%)', value:Math.round(ownerSimplicity), weight:.15},
        {label: isHi ? 'विवाद मुक्त स्थिति (10%)' : 'Dispute-Free Status (10%)', value:Math.round(disputeFree), weight:.1},
      ];
      const score = Math.round(factors.reduce((s,f)=>s+f.value*f.weight,0));
      return {p, factors, score};
    }).sort((a,b)=>b.score-a.score);

    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'भू-चयन निर्णय सहायता प्रणाली' : 'Parcel Decision Support System'}</h2>
          <div class="muted small">${isHi ? 'परियोजना संरेखण हेतु पारदर्शी, बहु-कारकीय एल्गोरिद्मिक मूल्यांकन' : 'Transparent, Multi-Factor Algorithmic Evaluation for Project Alignment'}</div>
        </div>
        <select id="ds-project">${DB.projects.map(pp=>`<option value="${pp.id}" ${pp.id===proj.id?'selected':''}>${pp.name}</option>`).join('')}</select>
      </div>
      <div class="tag-warn" style="margin-bottom:14px;">${isHi ? 'पारदर्शिता सूचना: स्कोरिंग मानकीकृत भारित मापकों पर आधारित है, जो किसी भी प्रकार के मानवीय पूर्वाग्रह से मुक्त है।' : 'Transparency Notice: Scoring is computed deterministically using objective weighted parameters without manual bias.'}</div>
      <div class="grid g3">
        ${scored.map((s,i)=>`
        <div class="card stat-card ${i===0?'stripe-green':'stripe-navy'}">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <h3 style="font-size:14px;color:var(--gov-navy);">${s.p.id}</h3>
            <div style="font-family:var(--font-heading);font-size:22px;font-weight:800;color:${i===0?'var(--gov-green)':'var(--gov-navy)'};">${s.score} / 100</div>
          </div>
          <div class="small muted" style="margin-bottom:8px;">${s.p.village}, ${s.p.district} &bull; ${s.p.area} ${s.p.areaUnit}</div>
          ${i===0? `<span class="badge badge-available" style="margin-bottom:8px;display:inline-block;">${isHi ? 'सर्वश्रेष्ठ उपयुक्त भूखंड' : 'Recommended Alignment'}</span>`:''}
          ${s.factors.map(f=>`
            <div style="margin:6px 0;">
              <div style="display:flex;justify-content:space-between;font-size:11px;"><span class="muted">${f.label}</span><span>${f.value}</span></div>
              <div class="score-bar-track"><div class="score-bar-fill" style="width:${f.value}%;"></div></div>
            </div>
          `).join('')}
          <button class="btn btn-sm btn-primary" style="width:100%;margin-top:8px;" data-open="${s.p.id}">${isHi ? 'खसरा विवरण देखें' : 'Inspect Parcel'}</button>
        </div>`).join('') || `<div class="empty">${isHi ? 'कोई असंबद्ध खसरा उपलब्ध नहीं है।' : 'No candidate parcels available.'}</div>`}
      </div>
    `;
    document.getElementById('ds-project').addEventListener('change', e=>draw(e.target.value));
    c.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click', ()=>navigate('parcel-detail', b.dataset.open)));
  }
  draw(DB.projects[0].id);
};
