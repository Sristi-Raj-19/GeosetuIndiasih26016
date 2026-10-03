/* ==========================================================================
   GEOLOCATION & FIELD OPERATIONS (Field Officer & District Review Hub)
   Role 6: FIELD OFFICER & Role 3: DISTRICT AUTHORITY
   ========================================================================== */

ROUTES['field-tasks'] = function(container) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const tasks = filterFieldTasksByRole(DB.fieldTasks || [], user);
  
  container.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'मैदानी सत्यापन एवं सर्वेक्षण कार्य' : 'Field Operations & Ground Verification'}</h2>
        <div class="muted small">${tasks.length} ${isHi ? 'सत्यापन कार्य आवंटित • जीपीएस व फोटोग्राफिक सत्यापन' : 'Assigned Verification Tasks • Geo-Tagged Cadastral Validation'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        ${user.role === 'FIELD_OFFICER' ? `
          <button class="btn btn-primary btn-sm" id="btn-gps-locate">
            📍 ${isHi ? 'वर्तमान जीपीएस स्थिति' : 'Acquire Current GPS'}
          </button>
        ` : ''}
        ${canRoleAccess(['DISTRICT', 'ACQUISITION_OFFICER', 'CENTRAL', 'STATE'], user) ? `
          <button class="btn btn-secondary btn-sm" onclick="navigate('field-review')">
            📋 ${isHi ? 'ज़िला समीक्षा कतार' : 'Review Submissions Queue'}
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Quick Metrics Strip -->
    <div class="grid g4" style="margin-bottom:16px;">
      <div class="card stat-card stripe-navy">
        <div class="card-title">${isHi ? 'कुल आवंटित कार्य' : 'Total Field Tasks'}</div>
        <div class="stat-val">${tasks.length}</div>
        <div class="small muted">${isHi ? 'भू-सत्यापन लक्ष्य' : 'Ground Surveys Assigned'}</div>
      </div>
      <div class="card stat-card stripe-saffron">
        <div class="card-title">${isHi ? 'लंबित सत्यापन' : 'Pending Verification'}</div>
        <div class="stat-val">${tasks.filter(t => t.status === 'Pending' || t.status === 'Re-verification').length}</div>
        <div class="small muted" style="color:var(--clay);font-weight:600;">${isHi ? 'तत्काल कार्रवाई आवश्यक' : 'Action Required on Site'}</div>
      </div>
      <div class="card stat-card stripe-sky">
        <div class="card-title">${isHi ? 'समीक्षा हेतु प्रेषित' : 'Submitted for Review'}</div>
        <div class="stat-val">${tasks.filter(t => t.status === 'Submitted').length}</div>
        <div class="small muted">${isHi ? 'ज़िला प्राधिकारी स्तर पर' : 'Awaiting District Approval'}</div>
      </div>
      <div class="card stat-card stripe-green">
        <div class="card-title">${isHi ? 'अनुमोदित सर्वेक्षण' : 'Approved Surveys'}</div>
        <div class="stat-val">${tasks.filter(t => t.status === 'Approved').length}</div>
        <div class="small muted" style="color:var(--gov-green);font-weight:600;">${isHi ? 'सत्यापन पूर्ण' : 'Fully Verified & Locked'}</div>
      </div>
    </div>

    <!-- Tasks List / Grid -->
    <div class="card" style="padding:0;">
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'कार्य क्रमांक' : 'Task ID'}</th>
              <th>${isHi ? 'खसरा / भूखंड' : 'Parcel / Survey No.'}</th>
              <th>${isHi ? 'ग्राम व ज़िला' : 'Village & District'}</th>
              <th>${isHi ? 'क्षेत्रफल' : 'Area'}</th>
              <th>${isHi ? 'आवंटित अधिकारी' : 'Assigned Officer'}</th>
              <th>${isHi ? 'स्थिति' : 'Task Status'}</th>
              <th>${isHi ? 'कार्यवाही' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => {
              const p = parcelById(t.parcelId) || {};
              const badgeClass = t.status === 'Approved' ? 'badge-pos' : (t.status === 'Submitted' ? 'badge-warn' : (t.status === 'Re-verification' ? 'badge-neg' : 'badge-neutral'));
              return `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${t.id}</td>
                  <td>
                    <b>${t.parcelId}</b>
                    <div class="small muted">${isHi ? 'सर्वेक्षण' : 'Survey'}: ${p.surveyNumber || '104/A'}</div>
                  </td>
                  <td>
                    <div>${t.village || p.village || 'Bhopal Rural'}</div>
                    <div class="small muted">${t.district || p.district || 'Bhopal'}</div>
                  </td>
                  <td>${t.area || p.area || 3.5} ac</td>
                  <td>${t.assignedTo || 'Sunil Verma'}</td>
                  <td>
                    <span class="badge ${badgeClass}">${t.status}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="btn btn-sm btn-primary" onclick="navigate('field-verify', '${t.id}')">
                        ${user.role === 'FIELD_OFFICER' ? (isHi ? 'सत्यापन करें' : 'Verify Ground') : (isHi ? 'विवरण देखें' : 'View Details')}
                      </button>
                      <button class="btn btn-sm btn-secondary" onclick="navigate('parcel-detail', '${t.parcelId}')">
                        🗺️ ${isHi ? 'खसरा' : 'Parcel'}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('') || `<tr><td colspan="7"><div class="empty">${isHi ? 'कोई कार्य उपलब्ध नहीं है।' : 'No field tasks found.'}</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const gpsBtn = document.getElementById('btn-gps-locate');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        toast(isHi ? 'जीपीएस उपग्रह सिग्नल प्राप्त किया जा रहा है...' : 'Acquiring high-precision GPS satellite fix...');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            const acc = pos.coords.accuracy.toFixed(1);
            toast(isHi ? `जीपीएस स्थिति प्राप्त: ${lat}, ${lng} (सटीकता ±${acc}m)` : `GPS Fix Acquired: ${lat}, ${lng} (Accuracy ±${acc}m)`);
          },
          (err) => {
            toast(isHi ? 'जीपीएस सिमुलेशन सक्रिय: 23.259933° N, 77.412615° E (सटीकता ±1.2m)' : 'Simulated DGPS Fix: 23.259933° N, 77.412615° E (Accuracy ±1.2m)');
          }
        );
      } else {
        toast(isHi ? 'जीपीएस सिमुलेशन: 23.259933° N, 77.412615° E' : 'Simulated DGPS Fix: 23.259933° N, 77.412615° E');
      }
    });
  }
};

ROUTES['field-verify'] = function(container, taskId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const task = (DB.fieldTasks || []).find(t => t.id === taskId) || (DB.fieldTasks || [])[0];
  
  if (!task) {
    container.innerHTML = `<div class="empty">${isHi ? 'सत्यापन कार्य नहीं मिला।' : 'Field task not found.'}</div>`;
    return;
  }

  const p = parcelById(task.parcelId) || {};
  const isLocked = task.status === 'Approved';

  container.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'मैदानी सत्यापन प्रपत्र' : 'On-Ground Parcel Verification Form'}</h2>
        <div class="muted small">${isHi ? 'कार्य क्रमांक' : 'Task ID'}: ${task.id} &bull; ${isHi ? 'खसरा' : 'Parcel'}: ${task.parcelId} &bull; ${task.village}, ${task.district}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="badge ${task.status === 'Approved' ? 'badge-pos' : 'badge-warn'}">${task.status}</span>
        <button class="btn btn-secondary btn-sm" onclick="navigate('field-tasks')">
          ← ${isHi ? 'कार्यों की सूची' : 'Back to Tasks'}
        </button>
      </div>
    </div>

    <!-- Verification Workspace Grid -->
    <div class="grid g2" style="margin-bottom:16px;">
      
      <!-- Left Column: Ground Checklist & Evidence Capture -->
      <div class="card stat-card stripe-navy">
        <div class="card-title">📱 ${isHi ? 'भौतिक स्थल सत्यापन जांच सूची' : 'Physical Ground Inspection Checklist'}</div>
        <p class="small muted" style="margin-bottom:12px;">
          ${isHi ? 'मैदानी अधिकारी द्वारा स्थल पर उपस्थित होकर प्रत्येक बिंदु की पुष्टि अनिवार्य है:' : 'Field Officer must verify each statutory condition physically at the parcel site:'}
        </p>

        <form id="field-verify-form">
          <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">
            <label class="gov-checkbox-wrap" style="align-items:flex-start;">
              <input type="checkbox" id="chk-boundary" ${task.checklist?.boundaryMatched ? 'checked' : ''} ${isLocked ? 'disabled' : 'required'}>
              <div style="margin-left:6px;">
                <div style="font-weight:700;font-size:12px;">${isHi ? '1. सीमांकन एवं सीमा स्तंभ (Boundary Pillars & Demarcation)' : '1. Boundary Pillars & Cadastral Demarcation'}</div>
                <div class="small muted">${isHi ? 'राजस्व नक्शे के अनुसार सीमाएं सही पाई गईं एवं कोई अतिक्रमण नहीं है।' : 'Physical boundary stones match official RoR revenue map without unauthorized encroachment.'}</div>
              </div>
            </label>

            <label class="gov-checkbox-wrap" style="align-items:flex-start;">
              <input type="checkbox" id="chk-occupancy" ${task.checklist?.khatedarOccupancy ? 'checked' : ''} ${isLocked ? 'disabled' : 'required'}>
              <div style="margin-left:6px;">
                <div style="font-weight:700;font-size:12px;">${isHi ? '2. खातेदार आधिपत्य एवं कब्ज़ा (Khatedar Physical Occupancy)' : '2. Khatedar Physical Occupancy & Identity'}</div>
                <div class="small muted">${isHi ? 'अभिलेख में दर्ज वास्तविक खातेदार अथवा वैध वारिसान मौके पर उपस्थित हैं।' : 'Verified lawful occupancy and presence of recorded Khatedar or legal heirs on site.'}</div>
              </div>
            </label>

            <label class="gov-checkbox-wrap" style="align-items:flex-start;">
              <input type="checkbox" id="chk-structures" ${task.checklist?.structuresVerified ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
              <div style="margin-left:6px;">
                <div style="font-weight:700;font-size:12px;">${isHi ? '3. परिसंपत्ति एवं वृक्ष गणना (Structures, Trees & Assets)' : '3. Structures, Wells & Standing Crops Inventory'}</div>
                <div class="small muted">${isHi ? 'मौके पर स्थित कुएं, नलकूप, आवासीय ढांचे अथवा वृक्षों की गणना पूर्ण।' : 'Inventoried built-up residential structures, borewells, and fruit-bearing trees for compensation.'}</div>
              </div>
            </label>

            <label class="gov-checkbox-wrap" style="align-items:flex-start;">
              <input type="checkbox" id="chk-dispute" ${task.checklist?.noDispute ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
              <div style="margin-left:6px;">
                <div style="font-weight:700;font-size:12px;">${isHi ? '4. विधिक / सार्वजनिक विवाद का अभाव (No Active Ground Dispute)' : '4. No Active Physical Possession Dispute'}</div>
                <div class="small muted">${isHi ? 'पारिवारिक बंटवारे अथवा सीमा को लेकर कोई कानून-व्यवस्था की स्थिति नहीं है।' : 'No violent boundary litigation, stay order or public law & order obstruction.'}</div>
              </div>
            </label>
          </div>

          <!-- GPS Coordinates Input / Auto-Fetch -->
          <div class="formrow">
            <label style="font-weight:700;font-size:12px;">📍 ${isHi ? 'जीपीएस निर्देशांक (GPS Geo-Coordinates)' : 'DGPS Geo-Coordinates (Lat, Long)'}</label>
            <div style="display:flex;gap:8px;">
              <input type="text" id="fv-gps" value="${task.gpsCaptured || (p.lat && p.lng ? `${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}` : '23.259933, 77.412615')}" class="gov-input" ${isLocked ? 'readonly' : ''} required>
              ${!isLocked ? `<button type="button" class="btn btn-sm btn-primary" id="btn-fetch-gps">📡 ${isHi ? 'जीपीएस लें' : 'Auto Fix'}</button>` : ''}
            </div>
            <div class="small muted" style="margin-top:2px;">${isHi ? 'सटीकता: ±1.2 मीटर • उपग्रह लॉक: 11 सैटेलाइट' : 'Accuracy: ±1.2 meters • Sub-meter DGPS Differential'}</div>
          </div>

          <!-- Photo Attachment / Camera Simulation -->
          <div class="formrow">
            <label style="font-weight:700;font-size:12px;">📷 ${isHi ? 'भूखंड की जियो-टैग्ड फोटो (Geo-Tagged On-Site Photo)' : 'Geo-Tagged Site Inspection Photo'}</label>
            <div style="border:1px dashed var(--gov-border);padding:10px;border-radius:4px;background:#f8fafc;text-align:center;">
              <div id="photo-preview-wrap">
                <div style="font-size:24px;margin-bottom:4px;">📸</div>
                <div class="small" style="font-weight:600;color:var(--gov-navy);">${task.photoUploaded ? (isHi ? '✓ फोटो संलग्न (अक्षांश/देशांतर मुद्रित)' : '✓ Geo-tagged photo attached (Watermarked)') : (isHi ? 'स्थल की ताज़ा तस्वीर अपलोड करें' : 'Capture / Upload Site Photograph')}</div>
                <div class="small muted" style="font-size:11px;">${isHi ? 'दिनांक, समय व जीपीएस निर्देशांक स्वचालित रूप से फोटो पर मुद्रित होंगे।' : 'Timestamp, Surveyor ID and GPS watermark embedded on upload.'}</div>
              </div>
              ${!isLocked ? `
                <div style="margin-top:8px;display:flex;gap:8px;justify-content:center;">
                  <button type="button" class="btn btn-sm btn-saffron" id="btn-mock-photo">📷 ${isHi ? 'कैमरा से फोटो लें' : 'Capture Site Photo'}</button>
                  <button type="button" class="btn btn-sm btn-secondary" id="btn-mock-doc">📎 ${isHi ? 'पंचनामा जोड़ें' : 'Attach Panchnama'}</button>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Field Remarks -->
          <div class="formrow">
            <label style="font-weight:700;font-size:12px;">📝 ${isHi ? 'मैदानी टिप्पणी एवं निष्कर्ष' : 'Field Surveyor Remarks & Recommendation'}</label>
            <textarea id="fv-remarks" rows="3" class="gov-input" placeholder="${isHi ? 'मौके की स्थिति, फसल की किस्म, खातेदार की सहमति आदि दर्ज करें...' : 'Enter ground observations, crop stage, Khatedar consent, and recommendation...'}" ${isLocked ? 'readonly' : ''}>${task.remarks || 'Ground boundary verified with RoR survey sheet. Two neem trees and one tube-well recorded. Khatedar confirmed possession.'}</textarea>
          </div>

          ${!isLocked ? `
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;">
              <button type="button" class="btn btn-secondary" onclick="navigate('field-tasks')">${isHi ? 'रद्द करें' : 'Cancel'}</button>
              <button type="submit" class="btn btn-primary" id="btn-submit-verification">
                ✓ ${isHi ? 'सत्यापन प्रस्तुत करें (ज़िला समीक्षा)' : 'Submit for District Authority Review'}
              </button>
            </div>
          ` : `
            <div class="tag-pos" style="margin-top:12px;text-align:center;">
              ✓ ${isHi ? 'यह सत्यापन ज़िला प्राधिकारी द्वारा अनुमोदित हो चुका है।' : 'This verification has been Approved by District Authority & Locked.'}
            </div>
          `}
        </form>
      </div>

      <!-- Right Column: Parcel Reference & Audit Context -->
      <div>
        <div class="card stat-card stripe-saffron" style="margin-bottom:14px;">
          <div class="card-title">📜 ${isHi ? 'अभिलेखीय संदर्भ (RoR Cadastral Reference)' : 'Cadastral & RoR Registry Baseline'}</div>
          <div class="kv"><span>${isHi ? 'खसरा संख्या' : 'Parcel ID'}</span><span><b>${task.parcelId}</b></span></div>
          <div class="kv"><span>${isHi ? 'सर्वे नंबर' : 'Survey Number'}</span><span>${p.surveyNumber || '104/2B'}</span></div>
          <div class="kv"><span>${isHi ? 'ग्राम / ज़िला' : 'Village / District'}</span><span>${task.village}, ${task.district}</span></div>
          <div class="kv"><span>${isHi ? 'दर्ज क्षेत्रफल' : 'RoR Area'}</span><span>${task.area || p.area || 3.5} acres</span></div>
          <div class="kv"><span>${isHi ? 'भू-उपयोग' : 'Land Classification'}</span><span>${p.landType || 'Agricultural (Double Cropped)'}</span></div>
          <div class="kv"><span>${isHi ? 'खातेदार का नाम' : 'Recorded Owner'}</span><span>${ownerName(p.ownerId)}</span></div>
          <div class="kv"><span>${isHi ? 'आधार स्थिति' : 'Aadhaar Seeding'}</span><span><span class="badge badge-pos">✓ Verified</span></span></div>
        </div>

        <div class="card stat-card stripe-sky">
          <div class="card-title">⚖️ ${isHi ? 'सत्यापन प्रोटोकॉल (SOP RFCTLARR)' : 'Statutory Verification Protocol (SOP)'}</div>
          <ul class="small muted" style="margin:0;padding-left:16px;line-height:1.7;">
            <li><b>Section 12:</b> Power to enter and survey lands for public infrastructure alignment.</li>
            <li><b>Section 26(1):</b> Physical verification of market values, standing trees, and built improvements.</li>
            <li><b>Panchnama:</b> Spot signature of adjacent plot owners (Chauhaddi) must be recorded.</li>
            <li><b>Audit Compliance:</b> Tamper-proof timestamp, geo-coordinates, and officer digital identity logged.</li>
          </ul>
        </div>
      </div>

    </div>
  `;

  // Hook form submit
  const form = document.getElementById('field-verify-form');
  if (form && !isLocked) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const gps = document.getElementById('fv-gps').value.trim();
      const remarks = document.getElementById('fv-remarks').value.trim();
      
      task.status = 'Submitted';
      task.gpsCaptured = gps;
      task.photoUploaded = true;
      task.remarks = remarks;
      task.checklist = {
        boundaryMatched: document.getElementById('chk-boundary')?.checked || false,
        khatedarOccupancy: document.getElementById('chk-occupancy')?.checked || false,
        structuresVerified: document.getElementById('chk-structures')?.checked || false,
        noDispute: document.getElementById('chk-dispute')?.checked || false
      };
      task.submittedAt = todayISO();
      task.submittedBy = user.name;

      if (p) {
        p.status = 'Under Verification';
      }

      addAudit(`Field verification submitted for parcel ${task.parcelId}`, 'field_task', task.id, `GPS: ${gps}, Surveyor: ${user.name}`);
      addAlert('Field Submission Pending Review', 'medium', `Field Officer ${user.name} submitted ground survey for Parcel ${task.parcelId} (${task.village}). Awaiting District Authority review.`, 'field_task', task.id);
      
      saveDB();
      toast(isHi ? '✓ मैदानी सत्यापन सफलतापूर्वक ज़िला प्राधिकारी समीक्षा हेतु प्रेषित किया गया।' : '✓ Field verification submitted to District Authority for statutory review.');
      navigate('field-tasks');
    });
  }

  // Hook Auto GPS Fix
  const fetchGpsBtn = document.getElementById('btn-fetch-gps');
  if (fetchGpsBtn) {
    fetchGpsBtn.addEventListener('click', () => {
      toast(isHi ? 'उपग्रह से डीजीपीएस निर्देशांक प्राप्त हो रहे हैं...' : 'Acquiring DGPS fix from satellite...');
      const lat = (23.2500 + Math.random()*0.02).toFixed(6);
      const lng = (77.4100 + Math.random()*0.02).toFixed(6);
      document.getElementById('fv-gps').value = `${lat}, ${lng}`;
      toast(isHi ? `जीपीएस लॉक: ${lat}, ${lng} (±1.1m)` : `DGPS Fix Locked: ${lat}, ${lng} (±1.1m)`);
    });
  }

  // Hook Camera Button
  const photoBtn = document.getElementById('btn-mock-photo');
  if (photoBtn) {
    photoBtn.addEventListener('click', () => {
      const wrap = document.getElementById('photo-preview-wrap');
      if (wrap) {
        wrap.innerHTML = `
          <div style="background:#e2e8f0;padding:8px;border-radius:4px;border:1px solid #cbd5e1;margin-bottom:4px;">
            <div style="font-weight:700;color:var(--gov-navy);font-size:12px;">📷 PHOTO-GEO-2026-MP${task.parcelId}.JPG</div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--gov-text-muted);margin-top:2px;">
              LAT: 23.259933° N | LNG: 77.412615° E | ALT: 492m<br>
              TIMESTAMP: ${new Date().toISOString()} | SURVEYOR: ${user.name}
            </div>
          </div>
        `;
      }
      toast(isHi ? '✓ स्थल की जियो-टैग्ड फोटो कैप्चर व मुद्रित की गई।' : '✓ Geo-tagged ground photo captured with watermark metadata.');
    });
  }

  // Hook Doc Button
  const docBtn = document.getElementById('btn-mock-doc');
  if (docBtn) {
    docBtn.addEventListener('click', () => {
      toast(isHi ? '✓ स्थल पंचनामा (हस्ताक्षरित) संलग्न किया गया।' : '✓ Signed Spot Panchnama with neighbor witness signatures attached.');
    });
  }
};

/* ==========================================================================
   DISTRICT AUTHORITY FIELD REVIEW QUEUE
   Role 3: DISTRICT AUTHORITY
   ========================================================================== */

ROUTES['field-review'] = function(container) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const submissions = (DB.fieldTasks || []).filter(t => t.status === 'Submitted' || t.status === 'Approved' || t.status === 'Re-verification');

  container.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'ज़िला प्राधिकारी मैदानी समीक्षा कतार' : 'District Authority Field Verification Review Hub'}</h2>
        <div class="muted small">${submissions.length} ${isHi ? 'सत्यापन समीक्षा हेतु उपलब्ध • सक्षम राजस्व संस्वीकृति' : 'Ground Submissions • Competent Statutory Review & Approval'}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="navigate('field-tasks')">
        ← ${isHi ? 'सभी कार्य' : 'All Tasks'}
      </button>
    </div>

    <!-- Review Queue Table -->
    <div class="card" style="padding:0;">
      <div class="overflow-x">
        <table>
          <thead>
            <tr>
              <th>${isHi ? 'कार्य क्रमांक' : 'Task ID'}</th>
              <th>${isHi ? 'खसरा / भूखंड' : 'Parcel / Village'}</th>
              <th>${isHi ? 'सर्वेक्षक' : 'Field Surveyor'}</th>
              <th>${isHi ? 'जीपीएस एवं फोटो' : 'GPS & Evidence'}</th>
              <th>${isHi ? 'सर्वेक्षक टिप्पणी' : 'Surveyor Remarks'}</th>
              <th>${isHi ? 'समीक्षा स्थिति' : 'Review Status'}</th>
              <th>${isHi ? 'सक्षम निर्णय' : 'Competent Decision'}</th>
            </tr>
          </thead>
          <tbody>
            ${submissions.map(t => {
              const p = parcelById(t.parcelId) || {};
              const isPendingReview = t.status === 'Submitted';
              return `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--gov-navy);">${t.id}</td>
                  <td>
                    <b>${t.parcelId}</b>
                    <div class="small muted">${t.village || p.village || 'Bhopal'}, ${t.district || 'Bhopal'}</div>
                  </td>
                  <td>
                    <div>${t.submittedBy || t.assignedTo || 'Sunil Verma'}</div>
                    <div class="small muted">${fmtDate(t.submittedAt || todayISO())}</div>
                  </td>
                  <td>
                    <div class="small" style="font-family:var(--font-mono);">${t.gpsCaptured || '23.2599, 77.4126'}</div>
                    <div class="small" style="color:var(--gov-green);font-weight:600;">✓ Geo-Photo Verified</div>
                  </td>
                  <td>
                    <div class="small" style="max-width:240px;line-height:1.4;">${t.remarks || 'Ground boundary verified with RoR.'}</div>
                  </td>
                  <td>
                    <span class="badge ${t.status === 'Approved' ? 'badge-pos' : (t.status === 'Submitted' ? 'badge-warn' : 'badge-neg')}">
                      ${t.status}
                    </span>
                  </td>
                  <td>
                    ${isPendingReview ? `
                      <div style="display:flex;gap:6px;">
                        <button class="btn btn-sm btn-primary" onclick="approveFieldVerification('${t.id}')">
                          ✓ ${isHi ? 'स्वीकृत करें' : 'Approve'}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="requestReVerification('${t.id}')">
                          ↺ ${isHi ? 'पुनः सत्यापन' : 'Re-verify'}
                        </button>
                      </div>
                    ` : `
                      <button class="btn btn-sm btn-secondary" onclick="navigate('field-verify', '${t.id}')">
                        ${isHi ? 'निरीक्षण देखें' : 'View Record'}
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('') || `<tr><td colspan="7"><div class="empty">${isHi ? 'कोई समीक्षा लंबित नहीं है।' : 'No submissions pending review.'}</div></td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

function approveFieldVerification(taskId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const task = (DB.fieldTasks || []).find(t => t.id === taskId);
  if (!task) return;

  task.status = 'Approved';
  task.approvedBy = CURRENT_USER.name;
  task.approvedAt = todayISO();

  const p = parcelById(task.parcelId);
  if (p) {
    p.status = 'Verified';
    p.documentStatus = 'Verified';
  }

  addAudit(`Field verification approved for parcel ${task.parcelId}`, 'field_task', task.id, `Approved by ${CURRENT_USER.name} (${CURRENT_USER.role})`);
  addAlert('Field Verification Approved', 'low', `District Authority approved field survey for Parcel ${task.parcelId}. Parcel ready for Section 11 declaration.`, 'parcel', task.parcelId);

  saveDB();
  toast(isHi ? '✓ मैदानी सत्यापन स्वीकृत किया गया एवं खसरा वैधानिक रूप से सत्यापित दर्ज हुआ।' : '✓ Field verification Approved. Cadastral record marked as Verified.');
  navigate('field-review');
}

function requestReVerification(taskId) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const task = (DB.fieldTasks || []).find(t => t.id === taskId);
  if (!task) return;

  task.status = 'Re-verification';
  task.remarks += ' [CALA Review: Boundary discrepancy noted with village tri-junction. Re-survey ordered.]';

  addAudit(`Re-verification ordered for parcel ${task.parcelId}`, 'field_task', task.id, `Ordered by ${CURRENT_USER.name}`);
  addAlert('Re-verification Ordered', 'high', `District Authority requested on-site re-verification for Parcel ${task.parcelId}.`, 'field_task', task.id);

  saveDB();
  toast(isHi ? '↺ पुनः सत्यापन का आदेश जारी किया गया।' : '↺ Re-verification request sent to Field Surveyor.');
  navigate('field-review');
}
