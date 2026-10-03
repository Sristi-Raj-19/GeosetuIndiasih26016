/* ==================== ALERTS ==================== */
ROUTES['alerts'] = function(c){
  let showResolved = false;
  function draw(){
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const rows = DB.alerts.filter(a=> showResolved || !a.resolved);
    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'सतर्कता व विधिक सूचनाएं' : 'Vigilance & Compliance Alerts'}</h2>
          <div class="muted small">${isHi ? 'RFCTLARR अधिनियम 2013 के अंतर्गत वैधानिक समय-सीमा की निगरानी' : 'Auto-monitored under RFCTLARR Act 2013 Statutory Deadlines'}</div>
        </div>
        <label class="small" style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="show-resolved" ${showResolved?'checked':''}> ${isHi ? 'निस्तारित प्रकरण भी दिखाएं' : 'Show Resolved'}</label>
      </div>
      <div class="card">
      ${rows.length? rows.map(a=>`
        <div class="timeline-item" style="padding:10px 0;">
          <div class="timeline-dot" style="background:${a.resolved?'var(--gov-green)':'var(--clay)'};"></div>
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;"><div style="font-weight:700;font-size:13px;color:${a.resolved?'var(--gov-green)':'var(--clay)'};">${escapeHtml(a.type)}</div><div class="small muted">${fmtDate(a.createdAt)}</div></div>
            <div class="small muted" style="margin-top:2px;">${escapeHtml(a.message)}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            <button class="btn btn-sm btn-primary" data-goto="${a.entityType}:${a.entityId}">${isHi ? 'अभिलेख देखें' : 'View Record'}</button>
            ${!a.resolved? `<button class="btn btn-sm btn-saffron" data-resolve="${a.id}">${isHi ? 'निस्तारित करें' : 'Resolve'}</button>`:''}
          </div>
        </div>`).join('') : `<div class="empty small">${isHi ? 'कोई सतर्कता सूचना लंबित नहीं है।' : 'No active vigilance alerts.'}</div>`}
      </div>
    `;
    document.getElementById('show-resolved').addEventListener('change', e=>{ showResolved=e.target.checked; draw(); });
    c.querySelectorAll('[data-resolve]').forEach(b=>b.addEventListener('click', ()=>{
      const a = DB.alerts.find(x=>x.id===b.dataset.resolve); a.resolved=true;
      addAudit('Vigilance alert resolved', 'alert', a.id, a.type); saveDB(); toast(isHi ? 'सतर्कता प्रकरण निस्तारित किया गया।' : 'Alert resolved.'); draw();
    }));
    c.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click', ()=>{
      const [type,eid] = b.dataset.goto.split(':');
      if(type==='parcel') navigate('parcel-detail', eid);
      else if(type==='case') navigate('case-detail', eid);
      else if(type==='project') navigate('project-detail', eid);
      else if(type==='document') navigate('documents');
      else toast(isHi ? 'विवरण उपलब्ध नहीं है।' : 'No detail view available.');
    }));
  }
  draw();
};

/* ==================== AUDIT TRAIL ==================== */
ROUTES['audit'] = function(c){
  let q='';
  function draw(){
    const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
    const rows = DB.auditLogs.filter(a=> !q || (a.action+a.entityId+a.user).toLowerCase().includes(q.toLowerCase())).slice().reverse();
    c.innerHTML = `
      <div class="section-head">
        <div>
          <h2>${isHi ? 'अपरिवर्तनीय डिजिटल ऑडिट ट्रेल' : 'Immutable Audit Trail'}</h2>
          <div class="muted small">${DB.auditLogs.length} ${isHi ? 'डिजिटल लॉग प्रविष्टियां • समय-मुद्रित शासकीय लॉग' : 'Digital Log Entries • Timestamped Official Logs'}</div>
        </div>
      </div>
      <div class="filterbar"><input type="text" id="aud-q" placeholder="${isHi ? 'कार्यवाही / अधिकारी / अभिलेख संख्या खोजें...' : 'Search Action, Officer or Record ID...'}" value="${escapeHtml(q)}"></div>
      <div class="card" style="padding:0;"><div class="overflow-x"><table>
        <thead><tr>
          <th>${isHi ? 'समय व दिनांक' : 'Timestamp'}</th>
          <th>${isHi ? 'कार्यवाही' : 'Official Action'}</th>
          <th>${isHi ? 'सक्षम प्राधिकारी' : 'Officer'}</th>
          <th>${isHi ? 'अभिलेख संदर्भ' : 'Entity Reference'}</th>
          <th>${isHi ? 'टिप्पणी' : 'Remarks'}</th>
        </tr></thead>
        <tbody>${rows.slice(0,150).map(a=>`<tr>
          <td style="font-family:var(--font-mono);font-size:11px;white-space:nowrap;color:var(--gov-navy);font-weight:600;">${fmtDate(a.timestamp)}</td>
          <td><b>${escapeHtml(a.action)}</b></td>
          <td>${escapeHtml(a.user)}</td>
          <td style="font-family:var(--font-mono);">${escapeHtml(a.entity)} &bull; ${escapeHtml(a.entityId)}</td>
          <td class="small muted">${escapeHtml(a.remarks||'')}</td>
        </tr>`).join('') || `<tr><td colspan="5"><div class="empty">${isHi ? 'कोई ऑडिट प्रविष्टि नहीं मिली।' : 'No audit entries found.'}</div></td></tr>`}</tbody>
      </table></div></div>
    `;
    document.getElementById('aud-q').addEventListener('input', e=>{ q=e.target.value; draw(); });
  }
  draw();
};

/* ==================== USER & ROLE MANAGEMENT ==================== */
ROUTES['users'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'प्रयोक्ता एवं कार्यक्षेत्र प्रबंधन' : 'User & Role Management'}</h2>
        <div class="muted small">${isHi ? 'प्राधिकृत अधिकारियों एवं नागरिक पोर्टल्स की शासकीय निर्देशिका' : 'Government Directory of Authorized Officers & Citizen Portals'}</div>
      </div>
    </div>
    <div class="card stat-card stripe-navy" style="margin-bottom:16px;padding:0;">
      <div class="overflow-x"><table><thead><tr>
        <th>${isHi ? 'नाम' : 'Name'}</th>
        <th>${isHi ? 'प्रयोक्ता नाम' : 'Username'}</th>
        <th>${isHi ? 'ईमेल' : 'Email'}</th>
        <th>${isHi ? 'पद / भूमिका' : 'Role'}</th>
        <th>${isHi ? 'कार्यक्षेत्र' : 'Jurisdiction'}</th>
        <th>${isHi ? 'पासवर्ड' : 'Password'}</th>
      </tr></thead>
      <tbody>${DB.users.map(u=>`<tr>
        <td><b>${escapeHtml(u.name)}</b></td>
        <td><code>${escapeHtml(u.username||'—')}</code></td>
        <td>${escapeHtml(u.email||'—')}</td>
        <td><span class="badge badge-available">${(typeof getRoleLabel === 'function') ? getRoleLabel(u.role) : ROLES[u.role].label}</span></td>
        <td>${escapeHtml(u.title)}</td>
        <td><span class="muted small"><code>${escapeHtml(u.password||'password123')}</code></span></td>
      </tr>`).join('')}</tbody></table></div>
    </div>
    <div class="grid g2">
      <div class="card"><div class="card-title">${isHi ? 'भू-अधिग्रहण अधिकारी — अधिकार क्षेत्र' : 'Land Acquisition Officer — Jurisdiction'}</div><ul class="small" style="margin:0;padding-left:18px;line-height:1.9;">
        ${isHi ? `
          <li>खसरा व खातेदार अभिलेखों का राजस्व सत्यापन</li>
          <li>दस्तावेज़ अपलोड व AI आधारित विसंगति पहचान</li>
          <li>अधिग्रहण प्रकरणों का पंजीयन व धारा 11-19 वैधानिक कार्य</li>
          <li>प्रतिकर निर्धारण व डीबीटी अंतरण का संपादन</li>
        ` : `
          <li>Verification of cadastral and landowner land records</li>
          <li>Document upload and AI-assisted discrepancy checking</li>
          <li>Registration of cases and statutory execution under Sections 11-19</li>
          <li>Compensation determination and DBT payment disbursals</li>
        `}
      </ul></div>
      <div class="card"><div class="card-title">${isHi ? 'सक्षम परियोजना प्राधिकारी — अधिकार क्षेत्र' : 'Project Authority — Jurisdiction'}</div><ul class="small" style="margin:0;padding-left:18px;line-height:1.9;">
        ${isHi ? `
          <li>राष्ट्रीय अवसंरचना परियोजनाओं का पंजीयन व संपादन</li>
          <li>धारा 15 आपत्ति सुनवाई व अंतिम संस्वीकृति आदेश</li>
          <li>प्रगति (PRAGATI) आधारित भौतिक व वित्तीय प्रगति अद्यतन</li>
          <li>भू-चयन निर्णय सहायता प्रणाली का उपयोग</li>
        ` : `
          <li>Registration and oversight of national infrastructure projects</li>
          <li>Section 15 objection disposal and competent approval orders</li>
          <li>PRAGATI-aligned physical and financial milestone monitoring</li>
          <li>Access to parcel decision support scoring system</li>
        `}
      </ul></div>
    </div>
  `;
};

/* ==================== ROLE-SCOPED NOTIFICATIONS ==================== */
ROUTES['notifications'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const notifications = filterNotificationsByRole(DB.notifications || [], user);

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'विधिक एवं शासकीय सूचनाएं' : 'Role Notifications & Official Alerts'}</h2>
        <div class="muted small">${notifications.length} ${isHi ? 'अधिसूचनाएं • पद-आधारित सतर्कता एवं समय-सीमा ट्रैकर' : 'Role-Scoped Notifications & Statutory Deadline Alerts'}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="toast('${isHi ? 'सभी सूचनाएं पढ़ी गईं दर्ज की गईं।' : 'All notifications marked as read.'}')">
        ✓ ${isHi ? 'सभी पढ़ी गईं मार्क करें' : 'Mark All as Read'}
      </button>
    </div>

    <!-- Notification Cards -->
    <div class="card" style="padding:0;">
      ${notifications.map(n => {
        const typeIcon = n.type === 'ACTION_REQUIRED' ? '🔴' : (n.type === 'ALERT' ? '⚠️' : 'ℹ️');
        const badgeColor = n.type === 'ACTION_REQUIRED' ? 'badge-neg' : (n.type === 'ALERT' ? 'badge-warn' : 'badge-pos');
        return `
          <div style="border-bottom:1px solid var(--gov-border);padding:14px 18px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
              <div style="font-size:20px;margin-top:2px;">${typeIcon}</div>
              <div>
                <div style="font-weight:700;font-size:13px;color:var(--gov-navy);margin-bottom:2px;">
                  ${escapeHtml(n.title)}
                </div>
                <div class="small" style="color:var(--gov-text);line-height:1.5;margin-bottom:4px;">
                  ${escapeHtml(n.message)}
                </div>
                <div class="small muted" style="font-size:11px;">
                  ${fmtDate(n.date || todayISO())} &bull; ${n.role ? `Audience: ${n.role}` : 'General Notification'}
                </div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
              <span class="badge ${badgeColor}">${n.type.replace('_', ' ')}</span>
              ${n.link ? `
                <button class="btn btn-sm btn-primary" onclick="navigate('${n.link}')">
                  ${isHi ? 'कार्रवाई करें' : 'Open View →'}
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('') || `<div class="empty">${isHi ? 'कोई नई सूचना उपलब्ध नहीं है।' : 'No notifications found for your role.'}</div>`}
    </div>
  `;
};