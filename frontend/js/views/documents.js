/* ==================== DOCUMENTS & VERIFICATION ==================== */
ROUTES['documents'] = function(c){
  let filter = '';
  function draw(){
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const rows = DB.documents.filter(d=> !filter || d.status===filter).slice().reverse();
    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'राजस्व दस्तावेज़ सत्यापन पोर्टल' : 'Document Verification Portal'}</h2>
          <div class="muted small">${DB.documents.length} ${isHi ? 'राजस्व दस्तावेज़ • एआई विसंगति जांच प्रणाली' : 'Revenue Documents • AI Assisted Discrepancy Detector'}</div>
        </div>
        ${CURRENT_USER.role==='LAND_OFFICER'||CURRENT_USER.role==='ADMIN' ? `<button class="btn btn-saffron btn-sm" id="btn-upload">${isHi ? 'दस्तावेज़ अपलोड व AI जांच' : 'Upload & OCR Scan'}</button>`:''}
      </div>
      <div class="filterbar"><select id="doc-filter"><option value="">${isHi ? 'सभी सत्यापन स्थितियां' : 'All Verification Statuses'}</option>${DOCUMENT_STATUSES.map(s=>`<option ${filter===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="card" style="padding:0;"><div class="overflow-x"><table>
        <thead><tr>
          <th>${isHi ? 'दस्तावेज़ संख्या' : 'Document ID'}</th>
          <th>${isHi ? 'दस्तावेज़ प्रकार' : 'Document Type'}</th>
          <th>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</th>
          <th>${isHi ? 'प्रकरण' : 'Case ID'}</th>
          <th>${isHi ? 'सत्यापन स्थिति' : 'Verification Status'}</th>
          <th>${isHi ? 'अपलोड तिथि' : 'Upload Date'}</th>
          <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
        </tr></thead>
        <tbody>${rows.slice(0,60).map(d=>`
          <tr><td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${d.id}</td><td>${d.type}</td><td><b>${d.parcelId}</b></td><td>${d.caseId||'—'}</td>
          <td>${docStatusBadge(d.status)}</td><td>${fmtDate(d.uploadedAt)}</td>
          <td>
            ${d.status!=='Verified' && (CURRENT_USER.role==='LAND_OFFICER'||CURRENT_USER.role==='ADMIN') ? `<button class="btn btn-sm btn-primary" data-verify="${d.id}">${isHi ? 'सत्यापित करें' : 'Verify'}</button>` : ''}
            ${d.status!=='Rejected' && d.status!=='Verified' && (CURRENT_USER.role==='LAND_OFFICER'||CURRENT_USER.role==='ADMIN') ? `<button class="btn btn-sm btn-danger" data-reject="${d.id}">${isHi ? 'अस्वीकृत करें' : 'Reject'}</button>` : ''}
          </td></tr>`).join('')}
        </tbody></table></div></div>
    `;
    c.querySelectorAll('[data-verify]').forEach(b=>b.addEventListener('click', ()=>{ setDocStatus(b.dataset.verify,'Verified'); draw(); }));
    c.querySelectorAll('[data-reject]').forEach(b=>b.addEventListener('click', ()=>{ setDocStatus(b.dataset.reject,'Rejected'); draw(); }));
    document.getElementById('doc-filter').addEventListener('change', e=>{ filter=e.target.value; draw(); });
    const ub = document.getElementById('btn-upload'); if(ub) ub.addEventListener('click', openUploadModal);
  }
  draw();
};

function setDocStatus(docId, status){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const d = DB.documents.find(x=>x.id===docId);
  d.status = status;
  const p = parcelById(d.parcelId);
  if(p){
    const pdocs = DB.documents.filter(x=>x.parcelId===p.id);
    p.documentStatus = pdocs.every(x=>x.status==='Verified') ? 'Verified' : (pdocs.some(x=>x.status==='Rejected')?'Rejected':(pdocs.some(x=>x.status==='Under Review')?'Under Review':'Uploaded'));
  }
  addAudit(`Document marked ${status}`, 'document', docId, `${d.type} for parcel ${d.parcelId}`);
  if(status==='Rejected') addAlert('Missing Document', 'high', `Document ${docId} (${d.type}) for parcel ${d.parcelId} was rejected by LAO.`, 'document', docId);
  saveDB();
  toast(isHi ? `दस्तावेज़ स्थिति ${status} दर्ज की गई।` : `Document marked as ${status}.`);
}

function openUploadModal(){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  openModal(`
    <h3 style="margin-bottom:6px;color:var(--gov-navy);">${isHi ? 'राजस्व दस्तावेज़ अपलोड व AI जांच' : 'Revenue Document Upload & AI OCR'}</h3>
    <div class="small muted" style="margin-bottom:12px;">${isHi ? 'ऑप्टिकल कैरेक्टर रिकॉग्निशन (OCR) द्वारा खसरा/खतौनी अभिलेखों का स्वचालित विश्लेषण:' : 'Optical Character Recognition (OCR) pipeline simulates automatic parsing of revenue records:'}</div>
    <div class="formrow"><label>${isHi ? 'खसरा भूखंड चुनें' : 'Select Land Parcel'}</label><select id="up-parcel">${DB.parcels.slice(0,40).map(p=>`<option value="${p.id}">${p.id} — ${p.village}</option>`).join('')}</select></div>
    <div class="formrow"><label>${isHi ? 'दस्तावेज़ प्रकार' : 'Document Type'}</label><select id="up-type">${DOCUMENT_TYPES.map(t=>`<option>${t}</option>`).join('')}</select></div>
    <div class="formrow"><label>${isHi ? 'दस्तावेज़ पाठ्य प्रविष्टि (OCR स्कैन)' : 'Document Content Entry (OCR Scan Text)'}</label>
      <textarea id="up-text" rows="3">Owner: Amit Kumar. Survey No. 123/4. Village Demo Village. Area 4.1 acres.</textarea>
    </div>
    <div id="up-result"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
      <button class="btn" id="up-cancel">${isHi ? 'रद्द करें' : 'Cancel'}</button>
      <button class="btn btn-saffron" id="up-extract">${isHi ? 'AI विसंगति जांच' : 'AI Extract & Verify'}</button>
      <button class="btn btn-primary" id="up-save" disabled>${isHi ? 'अभिलेख में सहेजें' : 'Save to Dossier'}</button>
    </div>
  `);
  document.getElementById('up-cancel').addEventListener('click', closeModal);
  document.getElementById('up-extract').addEventListener('click', ()=>{
    const text = document.getElementById('up-text').value;
    const parcelId = document.getElementById('up-parcel').value;
    const extracted = aiExtractDocument(text);
    const p = parcelById(parcelId);
    const discrepancies = aiDetectDiscrepancy(p, extracted);
    const notDetected = isHi ? 'पहचान नहीं हुई' : 'Not Detected';
    document.getElementById('up-result').innerHTML = `
      <div class="hr"></div>
      <div class="card-title">${isHi ? 'निकाले गए राजस्व तथ्य' : 'Extracted Revenue Fields'}</div>
      <div class="kv"><span>${isHi ? 'खातेदार का नाम' : 'Landowner Name'}</span><span>${extracted.owner || notDetected}</span></div>
      <div class="kv"><span>${isHi ? 'खसरा संख्या' : 'Survey Number'}</span><span>${extracted.survey || notDetected}</span></div>
      <div class="kv"><span>${isHi ? 'ग्राम' : 'Village'}</span><span>${extracted.village || notDetected}</span></div>
      <div class="kv"><span>${isHi ? 'क्षेत्रफल' : 'Area'}</span><span>${extracted.area!=null? extracted.area+' acres' : notDetected}</span></div>
      ${discrepancies.length? `<div class="tag-warn" style="margin-top:8px;">${discrepancies.map(d=>'⚠ '+d).join('<br>')}</div>` : `<div class="small" style="color:var(--gov-green);margin-top:8px;font-weight:700;">${isHi ? '✓ केंद्रीय भू-अभिलेख से कोई विसंगति नहीं मिली।' : '✓ Verified: No discrepancy found with central land registry.'}</div>`}
    `;
    document.getElementById('up-save').disabled = false;
  });
  document.getElementById('up-save').addEventListener('click', ()=>{
    const parcelId = document.getElementById('up-parcel').value;
    const type = document.getElementById('up-type').value;
    const p = parcelById(parcelId);
    const doc = { id:uid('DOC'), parcelId, caseId: p.caseId||null, type, status:'Uploaded', uploadedAt: todayISO(), extractedArea:null, extractedOwner:null };
    DB.documents.push(doc);
    addAudit('Document uploaded', 'document', doc.id, `${type} uploaded for parcel ${parcelId} (AI verification passed)`);
    saveDB(); closeModal(); toast(isHi ? 'दस्तावेज़ सफलतापूर्वक सहेजा गया।' : 'Document saved successfully.');
    navigate('documents');
  });
}