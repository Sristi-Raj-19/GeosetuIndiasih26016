/* ==================== COMPENSATION & DBT ==================== */
ROUTES['compensation'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const rows = DB.compensation;
  const total = rows.reduce((s,x)=>s+x.total,0);
  const paid = rows.filter(x=>x.paymentStatus==='Paid').reduce((s,x)=>s+x.total,0);
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'प्रतिकर निर्धारण व प्रत्यक्ष लाभ अंतरण (डीबीटी)' : 'Compensation Award & Direct Benefit Transfer (DBT)'}</h2>
        <div class="muted small">${rows.length} ${isHi ? 'प्रकरणों का प्रतिकर आकलन • सार्वजनिक वित्तीय प्रबंधन प्रणाली (PFMS)' : 'Statutory Cases Assessed • Public Financial Management System (PFMS)'}</div>
      </div>
    </div>
    <div class="grid g4" style="margin-bottom:16px;">
      ${statCard(isHi ? 'कुल प्रतिकर राशि' : 'Total Compensation', fmtINR(total), isHi ? `${rows.length} प्रकरण मूल्यांकित` : `${rows.length} Cases Assessed`, '', 'stripe-navy')}
      ${statCard(isHi ? 'डीबीटी भुगतान संपन्न' : 'DBT Disbursed', fmtINR(paid), Math.round(paid/Math.max(total,1)*100)+'% '+(isHi ? 'भुगतान संपन्न' : 'of Total Award'), '', 'stripe-green')}
      ${statCard(isHi ? 'भुगतान हेतु लंबित' : 'Pending DBT', fmtINR(total-paid), isHi ? `${rows.filter(x=>x.paymentStatus!=='Paid').length} प्रकरण प्रक्रियाधीन` : `${rows.filter(x=>x.paymentStatus!=='Paid').length} Pending PFMS`, '', 'stripe-saffron')}
      ${statCard(isHi ? 'औसत प्रतिकर दर' : 'Average Award', fmtINR(total/Math.max(rows.length,1)), isHi ? 'प्रति खातेदार औसत' : 'Per Khatedar Award', '', 'stripe-sky')}
    </div>
    <div class="card" style="padding:0;"><div class="overflow-x"><table>
      <thead><tr>
        <th>${isHi ? 'प्रकरण संख्या' : 'Case ID'}</th>
        <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
        <th>${isHi ? 'भूमि मूल्य' : 'Land Value'}</th>
        <th>${isHi ? 'संरचना मूल्य' : 'Structure Value'}</th>
        <th>${isHi ? 'सोलेशियम व अन्य' : 'Solatium & Assets'}</th>
        <th>${isHi ? 'कुल प्रतिकर' : 'Total Award'}</th>
        <th>${isHi ? 'डीबीटी स्थिति' : 'DBT Status'}</th>
        <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
      </tr></thead>
      <tbody>${rows.map(r=>{ const k=caseById(r.caseId); return `
        <tr><td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${r.caseId}</td><td><b>${k?k.parcelId:'—'}</b></td><td>${fmtINR(r.landValue)}</td><td>${fmtINR(r.structureValue)}</td><td>${fmtINR(r.additional)}</td>
        <td><b>${fmtINR(r.total)}</b></td><td><span class="${statusBadgeClass(r.paymentStatus)}">${r.paymentStatus}</span></td>
        <td>${r.paymentStatus!=='Paid' && (CURRENT_USER.role==='ADMIN'||CURRENT_USER.role==='LAND_OFFICER') ? `<button class="btn btn-sm btn-saffron" data-pay="${r.id}">${isHi ? 'डीबीटी भुगतान करें' : 'Release DBT'}</button>`:''}</td></tr>`; }).join('') || `<tr><td colspan="8"><div class="empty">${isHi ? 'कोई प्रतिकर आकलन नहीं मिला।' : 'No compensation awards found.'}</div></td></tr>`}
      </tbody></table></div></div>
  `;
  c.querySelectorAll('[data-pay]').forEach(b=>b.addEventListener('click', ()=>{
    const r = DB.compensation.find(x=>x.id===b.dataset.pay);
    r.paymentStatus='Paid'; r.paymentDate=todayISO();
    const k = caseById(r.caseId);
    if(k && k.status==='PAYMENT_PENDING'){ k.status='PAYMENT_COMPLETED'; k.history.push({status:'PAYMENT_COMPLETED', date:todayISO(), user:CURRENT_USER.name}); const p=parcelById(k.parcelId); p.status='Acquired'; }
    addAudit('Compensation payment released', 'compensation', r.id, fmtINR(r.total)+' transferred via PFMS.');
    saveDB(); toast(isHi ? 'डीबीटी भुगतान अंतरण सफल।' : 'DBT payment transfer released.'); navigate('compensation');
  }));
};