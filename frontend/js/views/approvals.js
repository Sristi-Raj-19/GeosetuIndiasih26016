/* ==================== APPROVALS ==================== */
ROUTES['approvals'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const pending = DB.cases.filter(k=>k.status==='OBJECTION_REVIEW');
  const decided = DB.approvals;
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'सक्षम प्राधिकारी अनुमोदन' : 'Competent Authority Approvals'}</h2>
        <div class="muted small">${isHi ? 'धारा 15 आपत्ति सुनवाई एवं धारा 19 संस्वीकृति घोषणा' : 'Section 15 Objection Hearing & Section 19 Declarations'}</div>
      </div>
    </div>
    <div class="card stat-card stripe-saffron" style="margin-bottom:16px;">
      <div class="card-title">${isHi ? `अनुमोदन हेतु लंबित प्रकरण (${pending.length})` : `Awaiting Competent Decision (${pending.length})`}</div>
      ${pending.length? `<div class="overflow-x"><table><thead><tr>
        <th>${isHi ? 'प्रकरण संख्या' : 'Case ID'}</th>
        <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
        <th>${isHi ? 'राष्ट्रीय परियोजना' : 'Infrastructure Project'}</th>
        <th>${isHi ? 'सुनवाई तिथि' : 'Hearing Date'}</th>
        <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
      </tr></thead><tbody>
        ${pending.map(k=>`<tr><td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${k.id}</td><td><b>${k.parcelId}</b></td><td>${projectName(k.projectId)}</td><td>${fmtDate(k.history[k.history.length-1].date)}</td>
        <td>${(CURRENT_USER.role==='PROJECT_AUTHORITY'||CURRENT_USER.role==='ADMIN') ? `
          <button class="btn btn-sm btn-primary" data-approve="${k.id}">${isHi ? 'अनुमोदित करें' : 'Approve'}</button>
          <button class="btn btn-sm btn-danger" data-deny="${k.id}">${isHi ? 'अस्वीकृत करें' : 'Reject'}</button>` : `<span class="small muted">${isHi ? 'प्राधिकारी लॉगिन प्रतीक्षित' : 'Awaiting Authority'}</span>`}</td></tr>`).join('')}
      </tbody></table></div>` : `<div class="empty small">${isHi ? 'वर्तमान में कोई प्रकरण अनुमोदन हेतु लंबित नहीं है।' : 'No cases currently pending competent approval.'}</div>`}
    </div>
    <div class="card">
      <div class="card-title">${isHi ? `अनुमोदन निर्णय इतिहास (${decided.length})` : `Decision Archive (${decided.length})`}</div>
      ${decided.slice().reverse().map(a=>`<div class="timeline-item"><div class="timeline-dot"></div><div><div style="font-size:12.5px;font-weight:700;color:var(--gov-navy);">${a.caseId} — ${a.decision}</div><div class="small muted">${escapeHtml(a.approver)} &bull; ${fmtDate(a.date)} &bull; "${escapeHtml(a.remarks)}"</div></div></div>`).join('') || `<div class="empty small">${isHi ? 'कोई निर्णय इतिहास नहीं है।' : 'No decision archive recorded.'}</div>`}
    </div>
  `;
  c.querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click', ()=>decideCase(b.dataset.approve,'Approved')));
  c.querySelectorAll('[data-deny]').forEach(b=>b.addEventListener('click', ()=>decideCase(b.dataset.deny,'Rejected')));
};

function decideCase(caseId, decision){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const k = caseById(caseId);
  const today = todayISO();
  DB.approvals.push({ id:uid('APR'), caseId, approver:CURRENT_USER.name, decision, date:today, remarks: decision==='Approved' ? (isHi ? 'धारा 15 पश्चात आपत्ति निस्तारित; संस्वीकृति आदेश जारी।' : 'Section 15 objections resolved; approval order issued.') : (isHi ? 'आपत्ति मान्य; प्रकरण निरस्त किया गया।' : 'Objection upheld; case dismissed.') });
  addAudit('Approval decision: '+decision, 'approval', caseId, '');
  if(decision==='Approved'){
    k.status='APPROVAL'; k.history.push({status:'APPROVAL', date:today, user:CURRENT_USER.name});
    const p = parcelById(k.parcelId); p.status='Approved';
  } else {
    const p = parcelById(k.parcelId); p.status='Disputed';
    addAlert('Ownership Dispute', 'high', `Case ${k.id} rejected by Competent Authority — Parcel ${p.id} marked disputed.`, 'case', k.id);
  }
  saveDB();
  toast(isHi ? `प्रकरण ${decision === 'Approved' ? 'अनुमोदित' : 'अस्वीकृत'} किया गया।` : `Case ${decision}.`);
  navigate('approvals');
}