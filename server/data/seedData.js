// GeoSetu-India Benchmark In-Memory Seed Data Fallback

const SEED_USERS = [
  { id: 'U-ADMIN', username: 'admin', email: 'admin@geosetu.gov.in', password: 'password123', full_name: 'S. Nair', role: 'ADMIN', designation: 'District Nodal Administrator', phone: '9826011111' },
  { id: 'U-OFFICER', username: 'officer', email: 'officer@geosetu.gov.in', password: 'password123', full_name: 'R. Chouhan', role: 'LAND_OFFICER', designation: 'Land Acquisition Officer (Bhopal Circle)', phone: '9826022222' },
  { id: 'U-AUTHORITY', username: 'authority', email: 'authority@geosetu.gov.in', password: 'password123', full_name: 'A. Deshmukh', role: 'PROJECT_AUTHORITY', designation: 'Project Director, NHAI Cell', phone: '9826033333' },
  { id: 'U-OWNER', username: 'citizen', email: 'citizen@geosetu.gov.in', password: 'password123', full_name: 'Amit Kumar', role: 'LAND_OWNER', designation: 'Verified Khatedar / Citizen', phone: '9826012345' }
];

const SEED_OWNERS = [
  { id: 'OWN-001', full_name: 'Amit Kumar', phone: '9826012345', email: 'amit.kumar@example.in', aadhaar_masked: 'XXXX-XXXX-8492', village: 'Bairagarh Kalan', tehsil: 'Huzur', district: 'Bhopal', state: 'Madhya Pradesh', bank_account_no: '918273645102', bank_ifsc: 'SBIN0001234' },
  { id: 'OWN-002', full_name: 'Sunita Devi', phone: '9425098712', email: 'sunita.devi@example.in', aadhaar_masked: 'XXXX-XXXX-6124', village: 'Bairagarh Kalan', tehsil: 'Huzur', district: 'Bhopal', state: 'Madhya Pradesh', bank_account_no: '827364519201', bank_ifsc: 'PUNB0123400' },
  { id: 'OWN-003', full_name: 'Rakesh Sharma', phone: '9179012389', email: 'rakesh.sharma@example.in', aadhaar_masked: 'XXXX-XXXX-5521', village: 'Kolar Sub-div', tehsil: 'Berasia', district: 'Bhopal', state: 'Madhya Pradesh', bank_account_no: '736451928301', bank_ifsc: 'CNRB0002345' },
  { id: 'OWN-004', full_name: 'Vikram Singh', phone: '9893011223', email: 'vikram.singh@example.in', aadhaar_masked: 'XXXX-XXXX-3319', village: 'Govindpura', tehsil: 'Govindpura', district: 'Bhopal', state: 'Madhya Pradesh', bank_account_no: '645192837402', bank_ifsc: 'HDFC0000987' }
];

const SEED_PROJECTS = [
  { id: 'PRJ-001', name: 'Bhopal-Indore Economic Corridor (NH-46)', type: 'National Highway Expansion (NHAI)', department: 'Ministry of Road Transport & Highways', location_district: 'Bhopal', state: 'Madhya Pradesh', required_area_acres: 120.00, acquired_area_acres: 84.50, utilized_area_acres: 42.00, estimated_budget_inr: 450000000.00, start_date: '2025-01-15', target_date: '2027-12-31', status: 'In Progress' },
  { id: 'PRJ-002', name: 'Bhopal Outer Ring Road (Phase-II)', type: 'National Highway Expansion (NHAI)', department: 'Urban Development Authority', location_district: 'Bhopal', state: 'Madhya Pradesh', required_area_acres: 80.00, acquired_area_acres: 32.00, utilized_area_acres: 10.00, estimated_budget_inr: 280000000.00, start_date: '2025-06-01', target_date: '2028-03-31', status: 'In Progress' },
  { id: 'PRJ-003', name: 'Metro Rail Feeder Depot (Sub-Circle)', type: 'Urban Transit Infrastructure', department: 'Urban Development Authority', location_district: 'Bhopal', state: 'Madhya Pradesh', required_area_acres: 35.00, acquired_area_acres: 35.00, utilized_area_acres: 28.00, estimated_budget_inr: 190000000.00, start_date: '2024-03-01', target_date: '2026-10-31', status: 'In Progress' }
];

const SEED_PARCELS = [
  { id: 'MP-BH-001', survey_number: '142/1', district: 'Bhopal', tehsil: 'Huzur', village: 'Bairagarh Kalan', area_acres: 4.20, land_type: 'Agricultural (Irrigated)', owner_id: 'OWN-001', project_id: 'PRJ-001', circle_rate_per_acre_inr: 2950000.00, status: 'Under Acquisition', document_status: 'Verified', lat: 23.2550, lng: 77.4080, polygon_json: [[23.255, 77.408], [23.255, 77.412], [23.259, 77.412], [23.259, 77.408]] },
  { id: 'MP-BH-002', survey_number: '88/2', district: 'Bhopal', tehsil: 'Huzur', village: 'Bairagarh Kalan', area_acres: 2.80, land_type: 'Agricultural (Un-irrigated)', owner_id: 'OWN-002', project_id: 'PRJ-001', circle_rate_per_acre_inr: 2780000.00, status: 'Under Acquisition', document_status: 'Verified', lat: 23.2550, lng: 77.4130, polygon_json: [[23.255, 77.413], [23.255, 77.417], [23.259, 77.417], [23.259, 77.413]] },
  { id: 'MP-BH-003', survey_number: '215/3', district: 'Bhopal', tehsil: 'Berasia', village: 'Kolar Sub-div', area_acres: 5.10, land_type: 'Agricultural (Commercial Road-facing)', owner_id: 'OWN-001', project_id: 'PRJ-002', circle_rate_per_acre_inr: 3620000.00, status: 'Under Acquisition', document_status: 'Verified', lat: 23.2600, lng: 77.4180, polygon_json: [[23.260, 77.418], [23.260, 77.423], [23.265, 77.423], [23.265, 77.418]] },
  { id: 'MP-BH-004', survey_number: '304/1', district: 'Bhopal', tehsil: 'Govindpura', village: 'Bairagarh Kalan', area_acres: 1.95, land_type: 'Non-Agricultural Commercial', owner_id: 'OWN-004', project_id: 'PRJ-003', circle_rate_per_acre_inr: 4710000.00, status: 'Under Acquisition', document_status: 'Verified', lat: 23.2600, lng: 77.4240, polygon_json: [[23.260, 77.424], [23.260, 77.428], [23.264, 77.428], [23.264, 77.424]] }
];

const SEED_CASES = [
  { id: 'CASE-001', case_number: 'LAO-BHP-2026-001', parcel_id: 'MP-BH-001', project_id: 'PRJ-001', current_stage: 'PAYMENT_PENDING', sec_4_sia_date: '2025-02-10', sec_11_notice_date: '2025-05-15', sec_15_objection_deadline: '2025-07-15', sec_19_declaration_date: '2025-11-20', sec_23_award_date: '2026-03-10', officer_remarks: 'Statutory award passed; E-Agreement executed. DBT payment release pending.' },
  { id: 'CASE-002', case_number: 'LAO-BHP-2026-002', parcel_id: 'MP-BH-002', project_id: 'PRJ-001', current_stage: 'COMPENSATION_ASSESSED', sec_4_sia_date: '2025-03-01', sec_11_notice_date: '2025-06-10', sec_15_objection_deadline: '2025-08-10', sec_19_declaration_date: '2025-12-05', sec_23_award_date: '2026-04-01', officer_remarks: 'Compensation assessed; Landowner Aadhaar e-Sign executed.' },
  { id: 'CASE-003', case_number: 'LAO-BHP-2026-003', parcel_id: 'MP-BH-003', project_id: 'PRJ-002', current_stage: 'NOTICE_ISSUED', sec_4_sia_date: '2025-08-15', sec_11_notice_date: '2025-11-01', sec_15_objection_deadline: '2026-01-05', sec_19_declaration_date: null, sec_23_award_date: null, officer_remarks: 'Preliminary notification issued under Section 11(1).' },
  { id: 'CASE-004', case_number: 'LAO-BHP-2026-004', parcel_id: 'MP-BH-004', project_id: 'PRJ-003', current_stage: 'VERIFICATION', sec_4_sia_date: '2026-01-10', sec_11_notice_date: null, sec_15_objection_deadline: null, sec_19_declaration_date: null, sec_23_award_date: null, officer_remarks: 'Survey and field dossier verification in progress.' }
];

const SEED_AGREEMENTS = [
  { id: 'EAGR-2026-001', agreement_number: 'IN-MP-AGR-2026-001', case_id: 'CASE-001', parcel_id: 'MP-BH-001', project_id: 'PRJ-001', owner_id: 'OWN-001', total_amount_inr: 26288000.00, rehab_terms: 'RFCTLARR Schedule II R&R Entitlement Card issued.', status: 'Completed', draft_date: '2026-09-02', sent_date: '2026-09-06', signed_date: '2026-09-10T11:34:22+05:30', completed_date: '2026-09-12T15:42:08+05:30', owner_sign_method: 'Aadhaar e-Sign (UIDAI OTP)', owner_sign_cert_hash: 'SHA256:7f9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', officer_dsc_token_serial: 'DSC-CLASS3-NIC-882910', estamp_certificate_no: 'IN-MP-ESTAMP-2026-88192' },
  { id: 'EAGR-2026-002', agreement_number: 'IN-MP-AGR-2026-002', case_id: 'CASE-002', parcel_id: 'MP-BH-002', project_id: 'PRJ-001', owner_id: 'OWN-002', total_amount_inr: 16536000.00, rehab_terms: 'One-time resettlement allowance ₹50,000.', status: 'Signed', draft_date: '2026-09-08', sent_date: '2026-09-12', signed_date: '2026-09-15T14:18:40+05:30', completed_date: null, owner_sign_method: 'Aadhaar e-Sign (UIDAI OTP)', owner_sign_cert_hash: 'SHA256:6e8f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9', officer_dsc_token_serial: null, estamp_certificate_no: 'IN-MP-ESTAMP-2026-88193' },
  { id: 'EAGR-2026-003', agreement_number: 'IN-MP-AGR-2026-003', case_id: 'CASE-003', parcel_id: 'MP-BH-003', project_id: 'PRJ-002', owner_id: 'OWN-001', total_amount_inr: 39220000.00, rehab_terms: 'Mandatory RFCTLARR Schedule II Package.', status: 'Sent', draft_date: '2026-09-14', sent_date: '2026-09-16', signed_date: null, completed_date: null, owner_sign_method: null, owner_sign_cert_hash: null, officer_dsc_token_serial: null, estamp_certificate_no: 'IN-MP-ESTAMP-2026-88194' },
  { id: 'EAGR-2026-004', agreement_number: 'IN-MP-AGR-2026-004', case_id: 'CASE-004', parcel_id: 'MP-BH-004', project_id: 'PRJ-003', owner_id: 'OWN-004', total_amount_inr: 19504000.00, rehab_terms: 'Monetary compensation package in lieu of rehabilitation.', status: 'Draft', draft_date: '2026-09-17', sent_date: null, signed_date: null, completed_date: null, owner_sign_method: null, owner_sign_cert_hash: null, officer_dsc_token_serial: null, estamp_certificate_no: 'IN-MP-ESTAMP-2026-88195' }
];

const SEED_COMPENSATION = [
  { id: 'CMP-001', case_id: 'CASE-001', parcel_id: 'MP-BH-001', owner_id: 'OWN-001', circle_rate_inr: 2950000.00, land_area_acres: 4.20, base_market_value_inr: 12390000.00, solatium_amount_inr: 12390000.00, interest_amount_inr: 1508000.00, total_award_inr: 26288000.00, pfms_status: 'Sanctioned (Pending Release)', pfms_txn_ref: 'PFMS-2026-MP-091823' },
  { id: 'CMP-002', case_id: 'CASE-002', parcel_id: 'MP-BH-002', owner_id: 'OWN-002', circle_rate_inr: 2780000.00, land_area_acres: 2.80, base_market_value_inr: 7784000.00, solatium_amount_inr: 7784000.00, interest_amount_inr: 968000.00, total_award_inr: 16536000.00, pfms_status: 'Calculation Approved', pfms_txn_ref: null }
];

const SEED_DOCUMENTS = [
  { id: 'DOC-001', parcel_id: 'MP-BH-001', type: 'Land Record (खसरा / खतौनी)', title: 'Khasra P-II Sheet 142/1', uploaded_by: 'Amit Kumar', date: '2026-08-10', status: 'Verified', file_url: '#', remarks: 'Matched with digital MP Bhulekh database.' },
  { id: 'DOC-002', parcel_id: 'MP-BH-001', type: 'Encumbrance Certificate (भारमुक्ति प्रमाण)', title: '13-Year Non-Encumbrance Report', uploaded_by: 'Sub-Registrar Huzur', date: '2026-08-14', status: 'Verified', file_url: '#', remarks: 'Nil mortgage or charge found.' },
  { id: 'DOC-003', parcel_id: 'MP-BH-002', type: 'Identity Document (आधार / ई-केवाईसी)', title: 'UIDAI e-KYC Verification Certificate', uploaded_by: 'Sunita Devi', date: '2026-08-18', status: 'Verified', file_url: '#', remarks: 'Demographic match 99.4%.' },
  { id: 'DOC-004', parcel_id: 'MP-BH-003', type: 'Survey Report (सर्वेक्षण प्रतिवेदन)', title: 'Joint Measurement Survey (JMS) Chart', uploaded_by: 'Revenue Inspector Berasia', date: '2026-08-25', status: 'Under Review', file_url: '#', remarks: 'Boundaries verified with DGPS survey.' }
];

const SEED_APPROVALS = [
  { id: 'APP-001', case_id: 'CASE-001', authority: 'Collector & District Magistrate, Bhopal', type: 'Section 19 Declaration Sanction', status: 'Approved', sanction_date: '2025-11-20', file_number: 'REV/LAO/2025/1192', remarks: 'All Section 15 objections disposed after personal hearing.' },
  { id: 'APP-002', case_id: 'CASE-001', authority: 'Principal Secretary (Revenue), Govt. of MP', type: 'Statutory RFCTLARR Financial Sanction', status: 'Approved', sanction_date: '2026-03-05', file_number: 'FIN/REV/2026/0481', remarks: 'Direct budget debit allocated from National Highway Head.' },
  { id: 'APP-003', case_id: 'CASE-002', authority: 'Competent Authority Land Acquisition (CALA)', type: 'Preliminary Notification Approval (Sec 11)', status: 'Approved', sanction_date: '2025-06-08', file_number: 'CALA/BHP/2025/881', remarks: 'SIA approved without adverse environmental remarks.' }
];

const SEED_ALERTS = [
  { id: 'ALT-001', severity: 'warning', title: 'Section 15 Objection Period Expiring Soon', description: 'Khasra 215/3 (Case LAO-BHP-2026-003) statutory 60-day objection window closes in 4 days.', timestamp: '2026-09-28', entity_type: 'case', entity_id: 'CASE-003' },
  { id: 'ALT-002', severity: 'info', title: 'PFMS DBT Batch Disbursal Scheduled', description: 'Compensation tranche for Case LAO-BHP-2026-001 queued for PFMS authorization batch.', timestamp: '2026-09-30', entity_type: 'compensation', entity_id: 'CMP-001' }
];

const SEED_AUDIT_LOGS = [
  { id: 'AUD-001', user_name: 'System / GeoSetu', action: 'Enterprise Database Schema Synchronized', entity_type: 'system', entity_id: 'SYS-INIT', remarks: 'GeoSetu-India platform initialized with RFCTLARR compliance triggers.', created_at: '2026-09-01T00:00:00.000Z' },
  { id: 'AUD-002', user_name: 'S. Nair (Admin)', action: 'Nodal Administrator Login Session Initiated', entity_type: 'user', entity_id: 'U-ADMIN', remarks: 'Authenticated via Central JanParichay Single Sign-On.', created_at: '2026-09-10T10:00:00.000Z' },
  { id: 'AUD-003', user_name: 'R. Chouhan (LAO)', action: 'E-Agreement Counter-Signed via Class-3 DSC Token', entity_type: 'agreement', entity_id: 'EAGR-2026-001', remarks: 'NIC Digital Signature applied with cryptographic timestamp.', created_at: '2026-09-12T15:42:08.000Z' }
];

module.exports = {
  SEED_USERS,
  SEED_OWNERS,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_CASES,
  SEED_AGREEMENTS,
  SEED_COMPENSATION,
  SEED_DOCUMENTS,
  SEED_APPROVALS,
  SEED_ALERTS,
  SEED_AUDIT_LOGS
};
