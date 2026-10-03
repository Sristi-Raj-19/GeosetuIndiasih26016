/* ==================== GIS MAP ==================== */
ROUTES['map'] = function(c){
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  c.innerHTML = `
    <div class="section-head">
      <div>
        <h2>${isHi ? 'भू-स्थानिक कैडस्ट्रल नक्शा' : 'GIS Land Cadastral Map'}</h2>
        <div class="muted small">${isHi ? 'राष्ट्रीय सुदूर संवेदन केंद्र (NRSC) • भू-नक्शा स्थानिक एकीकरण' : 'National Remote Sensing Centre (NRSC) / Bhunaksha Spatial Integration'}</div>
      </div>
    </div>
    <div class="map-wrap">
      <div id="leaflet-map"></div>
      <div class="map-search">
        <input type="text" id="map-search-input" placeholder="${isHi ? 'खसरा संख्या / ग्राम खोजें...' : 'Search Parcel ID, Survey No., Village...'}">
        <button class="btn btn-sm btn-primary" id="map-search-btn">${isHi ? 'खोजें' : 'Search'}</button>
      </div>
      <div class="map-legend" id="map-legend"></div>
      <div id="map-parcel-panel"></div>
    </div>
  `;
  const legend = document.getElementById('map-legend');
  legend.innerHTML = `<div style="font-weight:700;margin-bottom:4px;color:var(--gov-navy);">${isHi ? 'खसरा स्थिति संकेतक' : 'Cadastral Legend'}</div>` + 
    PARCEL_STATUSES.map(s=>`<div><span class="legend-dot" style="background:${colorForStatus(s)}"></span>${s}</div>`).join('');

  const userParcels = filterParcelsByRole(DB.parcels, CURRENT_USER);
  const initialParcel = userParcels[0] || DB.parcels[0];
  const centerLat = initialParcel ? initialParcel.lat : BASE_LAT;
  const centerLng = initialParcel ? initialParcel.lng : BASE_LNG;

  const map = L.map('leaflet-map').setView([centerLat, centerLng], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18, attribution:'&copy; OpenStreetMap &bull; NIC Govt. Portal'}).addTo(map);

  const layers = {};
  userParcels.forEach(p=>{
    const poly = L.polygon(p.polygon, { color:colorForStatus(p.status), weight:1.4, fillOpacity:.55 }).addTo(map);
    poly.on('click', ()=> showParcelPanel(p.id, map, poly));
    layers[p.id] = poly;
  });

  function showParcelPanel(id){
    const p = parcelById(id);
    if (!p) return;
    const panel = document.getElementById('map-parcel-panel');
    panel.innerHTML = `<div class="parcel-panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h3 style="font-size:14px;color:var(--gov-navy);">${p.id}</h3>${parcelStatusBadge(p.status)}
      </div>
      <div class="kv"><span>${isHi ? 'खातेदार' : 'Landowner'}</span><span>${ownerName(p.ownerId)}</span></div>
      <div class="kv"><span>${isHi ? 'क्षेत्रफल' : 'Area'}</span><span>${p.area} ${p.areaUnit}</span></div>
      <div class="kv"><span>${isHi ? 'भूमि प्रकार' : 'Land Type'}</span><span>${p.landType}</span></div>
      <div class="kv"><span>${isHi ? 'स्थान' : 'Location'}</span><span>${p.village}, ${p.district}</span></div>
      <div class="kv"><span>${isHi ? 'खसरा नं.' : 'Survey No.'}</span><span>${p.surveyNumber}</span></div>
      <div class="kv"><span>${isHi ? 'दस्तावेज़' : 'Documents'}</span><span>${docStatusBadge(p.documentStatus)}</span></div>
      <div class="kv"><span>${isHi ? 'परियोजना' : 'Project'}</span><span>${p.projectId? projectName(p.projectId):'—'}</span></div>
      <div class="kv"><span>${isHi ? 'प्रतिकर' : 'Compensation'}</span><span>${p.caseId && compForCase(p.caseId) ? fmtINR(compForCase(p.caseId).total) : '—'}</span></div>
      <button class="btn btn-primary btn-sm" style="width:100%;margin-top:12px;" id="panel-open-detail">${isHi ? 'राजस्व अभिलेख खोलें' : 'Open Parcel Dossier'}</button>
    </div>`;
    document.getElementById('panel-open-detail').addEventListener('click', ()=> navigate('parcel-detail', p.id));
  }
  if (initialParcel) {
    showParcelPanel(initialParcel.id);
    map.setView([initialParcel.lat, initialParcel.lng], 12);
  }

  document.getElementById('map-search-btn').addEventListener('click', doSearch);
  document.getElementById('map-search-input').addEventListener('keydown', e=>{ if(e.key==='Enter') doSearch(); });
  function doSearch(){
    const q = document.getElementById('map-search-input').value.trim().toLowerCase();
    if(!q) return;
    const p = DB.parcels.find(p=> p.id.toLowerCase().includes(q) || p.village.toLowerCase().includes(q) || p.surveyNumber.toLowerCase().includes(q));
    if(p){ map.setView([p.lat,p.lng], 14); showParcelPanel(p.id); } else toast(isHi ? 'कोई मेल खाता खसरा नहीं मिला।' : 'No matching parcel found.');
  }
};