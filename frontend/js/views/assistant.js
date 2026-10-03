/* ==================== AI ASSISTANT ==================== */
function aiExtractDocument(text){
  const t = text || '';
  const owner = (t.match(/owner[:\s]+([a-zA-Z .]+?)(?:\.|,|$)/i)||[])[1];
  const survey = (t.match(/survey\s*no\.?\s*([0-9]+\/[0-9]+)/i)||[])[1];
  const village = (t.match(/village\s+([a-zA-Z ]+?)(?:\.|,|$)/i)||[])[1];
  const areaMatch = t.match(/area\s+([0-9]+(?:\.[0-9]+)?)/i);
  return { owner: owner? owner.trim():null, survey: survey||null, village: village? village.trim():null, area: areaMatch? parseFloat(areaMatch[1]) : null };
}

function aiDetectDiscrepancy(parcel, extracted){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const out = [];
  if(extracted.area!=null && Math.abs(extracted.area - parcel.area) > 0.3){
    out.push(isHi 
      ? `क्षेत्रफल विसंगति: राजस्व अभिलेख में ${parcel.area} एकड़ है किंतु दस्तावेज़ में ${extracted.area} एकड़ दर्ज है।`
      : `Area Discrepancy: Central registry records ${parcel.area} acres, but document indicates ${extracted.area} acres.`);
  }
  if(extracted.survey && extracted.survey !== parcel.surveyNumber){
    out.push(isHi 
      ? `खसरा संख्या विसंगति: राजस्व अभिलेख में ${parcel.surveyNumber} है, दस्तावेज़ में ${extracted.survey} है।`
      : `Survey Number Discrepancy: Registry has ${parcel.surveyNumber}, document has ${extracted.survey}.`);
  }
  if(extracted.village && parcel.village && !parcel.village.toLowerCase().includes(extracted.village.toLowerCase().slice(0,5))){
    out.push(isHi 
      ? `ग्राम नाम विसंगति: दस्तावेज़ का ग्राम ("${extracted.village}") राजस्व अभिलेख ("${parcel.village}") से मेल नहीं खाता।`
      : `Village Name Mismatch: Document village ("${extracted.village}") differs from cadastral record ("${parcel.village}").`);
  }
  return out;
}

function aiAnswerQuery(q){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const s = q.toLowerCase();
  const countBy = (arr)=>arr.length;
  if(s.includes('pending compensation') || (s.includes('compensation') && s.includes('pending')) || s.includes('प्रतिकर')){
    const n = countBy(DB.compensation.filter(c=>c.paymentStatus!=='Paid'));
    const tot = fmtINR(DB.compensation.filter(c=>c.paymentStatus!=='Paid').reduce((sum,c)=>sum+c.total,0));
    return isHi 
      ? `${n} भू-अधिग्रहण प्रकरणों में डीबीटी प्रतिकर भुगतान प्रक्रियाधीन है, कुल देय राशि ${tot} है।`
      : `${n} land acquisition cases have pending DBT compensation disbursements, totaling ${tot}.`;
  }
  if(s.includes('disputed') || s.includes('विवाद')){
    const n = DB.parcels.filter(p=>p.status==='Disputed').length;
    return isHi 
      ? `${n} खसरा भूखंड वर्तमान में राजस्व न्यायालय या विधिक विवाद के अंतर्गत दर्ज हैं।`
      : `${n} land parcels are currently flagged under litigation or court dispute.`;
  }
  if(s.includes('verification') || s.includes('सत्यापन')){
    const n = DB.parcels.filter(p=>p.status==='Under Verification').length;
    return isHi 
      ? `${n} खसरों का राजस्व अभिलेख सत्यापन वर्तमान में प्रक्रियाधीन है।`
      : `${n} parcels are currently undergoing revenue verification.`;
  }
  if(s.includes('alert') || s.includes('सूचना')){
    const n = DB.alerts.filter(a=>!a.resolved).length;
    return isHi 
      ? `सिस्टम में वर्तमान में ${n} सतर्कता सूचनाएं सक्रिय हैं।`
      : `${n} active statutory vigilance alerts are currently pending.`;
  }
  if(s.includes('acquired') || s.includes('अधिग्रहीत')){
    const lines = DB.projects.map(p=> isHi ? `${p.name}: ${p.acquiredArea}/${p.requiredArea} एकड़ अधिग्रहीत` : `${p.name}: ${p.acquiredArea}/${p.requiredArea} acres acquired`);
    return lines.join('\n');
  }
  return isHi 
    ? `मैं राष्ट्रीय भू-अधिग्रहण पोर्टल से संबंधित प्रश्नों के उत्तर दे सकता हूँ। आप पूछ सकते हैं: "कितने प्रकरणों में प्रतिकर लंबित है?", "विवादित खसरों की संख्या?", "सत्यापनधीन भूखंड?" आदि।`
    : `I can answer queries regarding national land acquisition proceedings. You can ask: "Pending compensation cases", "How many disputed parcels?", "Acquisition progress", etc.`;
}

ROUTES['ai'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'डिजिटल इंडिया एआई सहायक' : 'Digital India AI Assistant'}</h2>
        <div class="muted small">${isHi ? 'भू-अधिग्रहण अभिलेखों पर स्वाभाविक भाषा पूछताछ हेतु एआई परत' : 'Modular AI Layer for Natural Language Inquiries on Land Acquisition Records'}</div>
      </div>
    </div>
    <div class="grid g2">
      <div class="card stat-card stripe-navy">
        <div class="card-title">${isHi ? 'स्वाभाविक भाषा डाटा पूछताछ' : 'Natural Language Inquiry'}</div>
        <div id="ai-log" style="max-height:270px;overflow-y:auto;margin-bottom:10px;"></div>
        <div style="display:flex;gap:8px;">
          <input type="text" id="ai-input" placeholder='${isHi ? 'उदा. "कितने भूखंड विवादित हैं?" या "लंबित प्रतिकर"' : 'e.g. "Pending compensation cases" or "Disputed parcels"'}' style="flex:1;">
          <button class="btn btn-primary btn-sm" id="ai-send">${isHi ? 'पूछें' : 'Ask'}</button>
        </div>
        <div class="small muted" style="margin-top:8px;">${isHi ? 'सुझाव: लंबित प्रतिकर • विवादित खसरे • सतर्कता सूचनाएं • परियोजना प्रगति' : 'Suggested: Pending compensation • Disputed parcels • Active alerts • Project progress'}</div>
      </div>
      <div class="card stat-card stripe-saffron">
        <div class="card-title">${isHi ? 'दस्तावेज़ विसंगति पहचान प्रणाली' : 'Document OCR Extraction & Validation'}</div>
        <div class="small muted" style="margin-bottom:10px;">${isHi ? 'AI आधारित दस्तावेज़ पार्सिंग का उपयोग राजस्व अभिलेखों में कूटकरण अथवा विसंगति की त्वरित पहचान के लिए किया जाता है।' : 'AI-assisted OCR pipeline automatically detects discrepancies and mismatches between scanned deeds and central cadastral records.'}</div>
        <button class="btn btn-saffron btn-sm" id="ai-open-upload">${isHi ? 'दस्तावेज़ AI जांच पोर्टल खोलें' : 'Open OCR Scanner Portal'}</button>
        <div class="hr"></div>
        <div class="card-title">${isHi ? 'सिस्टम आर्किटेक्चर' : 'System Architecture'}</div>
        <div class="small muted">${isHi ? 'यह मॉड्यूल भारत सरकार के भाषिणी व राष्ट्रीय एआई मिशन के मानकों के अनुकूल एकीकृत होने हेतु निर्मित है।' : 'Engineered to comply with Bhashini Language Mission and National AI Governance Framework.'}</div>
      </div>
    </div>
  `;
  const log = document.getElementById('ai-log');
  function pushMsg(role, text){
    const el = document.createElement('div');
    el.className = 'ai-msg '+role;
    el.textContent = text;
    log.appendChild(el); log.scrollTop = log.scrollHeight;
  }
  pushMsg('bot', isHi 
    ? 'नमस्ते! मैं भूसेतु डिजिटल एआई सहायक हूँ। आप वर्तमान खसरा अभिलेखों, प्रकरणों, प्रतिकर या विधिक विवादों के संबंध में मुझसे पूछ सकते हैं।'
    : 'Hello! I am the GeoSetu-India AI Assistant. You can query me on land records, active acquisition cases, compensation awards, or legal disputes.');
  document.getElementById('ai-send').addEventListener('click', ask);
  document.getElementById('ai-input').addEventListener('keydown', e=>{ if(e.key==='Enter') ask(); });
  function ask(){
    const input = document.getElementById('ai-input');
    const q = input.value.trim(); if(!q) return;
    pushMsg('user', q);
    pushMsg('bot', aiAnswerQuery(q));
    input.value='';
  }
  document.getElementById('ai-open-upload').addEventListener('click', openUploadModal);
};

/* ==================== AI BOTTLENECK DETECTION RADAR ==================== */
ROUTES['bottlenecks'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const user = CURRENT_USER;
  const projects = filterProjectsByRole(DB.projects, user);
  const analyses = projects.map(p => ({
    project: p,
    bottleneck: analyzeProjectBottlenecks(p)
  }));

  const highRisk = analyses.filter(a => a.bottleneck.riskLevel === 'HIGH');
  const mediumRisk = analyses.filter(a => a.bottleneck.riskLevel === 'MEDIUM');

  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'एआई बॉटलनेक संसूचक एवं निर्णय सहायता प्रणाली' : 'AI Bottleneck Detection & Strategic Decision Support'}</h2>
        <div class="muted small">${isHi ? 'मशीन लर्निंग जोखिम मॉडल (Feature Extractor) + लामा 3.2 स्वाभाविक भाषा विश्लेषण' : 'ML Feature Extraction & Risk Scoring Engine + Llama 3.2 Natural-Language Explanation'}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="navigate('dashboard')">
        ← ${isHi ? 'डैशबोर्ड पर लौटें' : 'Back to Dashboard'}
      </button>
    </div>

    <!-- Alert Strip -->
    <div class="card stat-card stripe-saffron" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:26px;">🧠</div>
        <div>
          <div style="font-weight:700;color:var(--gov-navy);font-size:13.5px;">${isHi ? 'राष्ट्रीय निर्णय सहायता सारांश (Llama 3.2 Synthesis)' : 'Algorithmic Bottleneck Evaluation (Strict Feature Extraction Pipeline)'}</div>
          <div class="small" style="color:var(--gov-text-muted);margin-top:2px;">
            ${isHi 
              ? `कुल ${analyses.length} परियोजनाओं में से ${highRisk.length} परियोजनाओं में उच्च जोखिम बॉटलनेक एवं ${mediumRisk.length} में मध्यम जोखिम बॉटलनेक चिन्हित किए गए हैं।`
              : `Out of ${analyses.length} monitored infrastructure corridors, ${highRisk.length} projects exhibit HIGH risk bottlenecks and ${mediumRisk.length} exhibit MEDIUM risk delays.`}
          </div>
        </div>
      </div>
    </div>

    <!-- Project Bottleneck Cards -->
    <div class="grid g2" style="margin-bottom:16px;">
      ${analyses.map(({ project: p, bottleneck: b }) => {
        const llamaExp = explainWithLlama(b, p);
        const riskBadge = b.riskLevel === 'HIGH' ? 'badge-neg' : (b.riskLevel === 'MEDIUM' ? 'badge-warn' : 'badge-pos');
        const stripeClass = b.riskLevel === 'HIGH' ? 'stripe-clay' : (b.riskLevel === 'MEDIUM' ? 'stripe-saffron' : 'stripe-green');
        return `
          <div class="card stat-card ${stripeClass}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
              <div>
                <h3 style="font-size:14px;color:var(--gov-navy);margin:0;">${p.name}</h3>
                <div class="small muted">${p.department} &bull; ${p.location} ${p.state ? `&bull; ${p.state}` : ''}</div>
              </div>
              <span class="badge ${riskBadge}">${b.riskLevel} RISK (Score: ${b.riskScore}/100)</span>
            </div>

            <!-- ML Extracted Factors -->
            <div style="background:#f8fafc;padding:10px;border-radius:4px;border:1px solid var(--gov-border);margin:8px 0;">
              <div style="font-weight:700;font-size:11.5px;color:var(--gov-navy);margin-bottom:4px;">
                ⚡ ${isHi ? 'मुख्य बाधा घटक' : 'Primary Bottleneck'}: <span style="color:var(--clay);">${b.primaryBottleneck}</span>
              </div>
              <ul class="small" style="margin:0;padding-left:16px;line-height:1.6;color:var(--gov-text-muted);">
                ${b.factors.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <!-- Llama 3.2 Explanation -->
            <div style="border-left:3px solid var(--gov-saffron);padding-left:10px;margin-top:8px;">
              <div style="font-size:11px;font-weight:700;color:var(--gov-saffron);text-transform:uppercase;letter-spacing:0.04em;">🤖 Llama 3.2 Strategic Recommendation:</div>
              <p class="small" style="line-height:1.5;color:var(--gov-text);margin:3px 0 8px;">${llamaExp}</p>
            </div>

            <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:10px;">
              <button class="btn btn-sm btn-secondary" onclick="navigate('project-detail', '${p.id}')">
                📁 ${isHi ? 'परियोजना डॉसियर' : 'Project Dossier'}
              </button>
              <button class="btn btn-sm btn-primary" onclick="navigate('cases')">
                ⚖️ ${isHi ? 'प्रकरण देखें' : 'View Cases'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};