-- =====================================================================
-- GeoSetu-India (भूसेतु-भारत) — National Land Acquisition & Management Portal
-- Department of Land Resources, Ministry of Rural Development, Govt of India
-- Production PostgreSQL 15+ & PostGIS 3+ Enterprise Schema
-- Compliant with RFCTLARR Act 2013 & GIGW 3.0 Guidelines
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ---------------------------------------------------------------------
-- 2. ENUMS & DOMAIN TYPES
-- ---------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'ADMIN',
        'LAND_OFFICER',
        'PROJECT_AUTHORITY',
        'LAND_OWNER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE parcel_status AS ENUM (
        'Available',
        'Under Verification',
        'Under Acquisition',
        'Approved',
        'Compensation Pending',
        'Acquired',
        'Disputed',
        'Utilized'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE workflow_stage AS ENUM (
        'IDENTIFIED',
        'VERIFICATION',
        'NOTICE_ISSUED',
        'OBJECTION_REVIEW',
        'APPROVAL',
        'COMPENSATION_ASSESSED',
        'PAYMENT_PENDING',
        'PAYMENT_COMPLETED',
        'LAND_ACQUIRED',
        'PROJECT_UTILIZATION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE agreement_status AS ENUM (
        'Draft',
        'Sent',
        'Signed',
        'Completed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_status AS ENUM (
        'Pending',
        'Uploaded',
        'Under Review',
        'Verified',
        'Rejected'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM (
        'low',
        'medium',
        'high',
        'critical'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------------------------------------------------------------------
-- 3. CORE ENTITIES
-- ---------------------------------------------------------------------

-- Users & Administrative Role-Based Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role user_role NOT NULL,
    designation VARCHAR(128),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Registered Landowners / Khatedars
CREATE TABLE IF NOT EXISTS owners (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(128),
    aadhaar_hash VARCHAR(64),
    aadhaar_masked VARCHAR(20) NOT NULL,
    village VARCHAR(128) NOT NULL,
    tehsil VARCHAR(128),
    district VARCHAR(128) NOT NULL,
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    bank_account_no VARCHAR(34),
    bank_ifsc VARCHAR(16),
    bank_name VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Priority Infrastructure Projects (PM GatiShakti)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(128) NOT NULL,
    department VARCHAR(128) NOT NULL,
    location_district VARCHAR(128) NOT NULL,
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    required_area_acres NUMERIC(10, 2) NOT NULL CHECK (required_area_acres > 0),
    acquired_area_acres NUMERIC(10, 2) DEFAULT 0.00 CHECK (acquired_area_acres >= 0),
    utilized_area_acres NUMERIC(10, 2) DEFAULT 0.00 CHECK (utilized_area_acres >= 0),
    estimated_budget_inr NUMERIC(16, 2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'In Progress',
    created_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Cadastral Land Parcels (Khasra Registry with PostGIS Spatial Geometry)
CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(64) PRIMARY KEY,
    survey_number VARCHAR(64) NOT NULL, -- Khasra No (e.g., 142/1)
    state VARCHAR(64) DEFAULT 'Madhya Pradesh',
    district VARCHAR(128) NOT NULL,
    tehsil VARCHAR(128) NOT NULL,
    village VARCHAR(128) NOT NULL,
    area_acres NUMERIC(10, 2) NOT NULL CHECK (area_acres > 0),
    land_type VARCHAR(64) NOT NULL, -- Agricultural, Commercial, Residential, Barren
    owner_id VARCHAR(64) NOT NULL REFERENCES owners(id) ON DELETE RESTRICT,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
    circle_rate_per_acre_inr NUMERIC(14, 2) DEFAULT 2500000.00,
    status parcel_status DEFAULT 'Available',
    document_status document_status DEFAULT 'Pending',
    -- PostGIS Spatial Features: Centroid Point and Parcel Boundary Polygon in WGS84 (SRID 4326)
    centroid GEOMETRY(Point, 4326),
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Spatial GIST Index for high-speed spatial queries (ST_Contains, ST_Intersects, ST_Distance)
CREATE INDEX IF NOT EXISTS idx_parcels_boundary_gist ON parcels USING GIST (boundary);
CREATE INDEX IF NOT EXISTS idx_parcels_centroid_gist ON parcels USING GIST (centroid);
CREATE INDEX IF NOT EXISTS idx_parcels_owner ON parcels (owner_id);
CREATE INDEX IF NOT EXISTS idx_parcels_project ON parcels (project_id);
CREATE INDEX IF NOT EXISTS idx_parcels_khasra ON parcels (survey_number, village, tehsil);

-- Statutory RFCTLARR Acquisition Cases (10-Stage Pipeline)
CREATE TABLE IF NOT EXISTS cases (
    id VARCHAR(64) PRIMARY KEY,
    case_number VARCHAR(64) UNIQUE NOT NULL,
    parcel_id VARCHAR(64) NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    current_stage workflow_stage DEFAULT 'IDENTIFIED',
    sec_4_sia_date DATE,
    sec_11_notice_date DATE,
    sec_15_objection_deadline DATE,
    sec_19_declaration_date DATE,
    sec_23_award_date DATE,
    assigned_officer_id VARCHAR(64) REFERENCES users(id),
    officer_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cases_parcel ON cases (parcel_id);
CREATE INDEX IF NOT EXISTS idx_cases_stage ON cases (current_stage);

-- Public Objections under Section 15 of RFCTLARR Act
CREATE TABLE IF NOT EXISTS objections (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    owner_id VARCHAR(64) NOT NULL REFERENCES owners(id),
    filing_date DATE NOT NULL DEFAULT CURRENT_DATE,
    grounds TEXT NOT NULL,
    hearing_date DATE,
    disposition VARCHAR(32) DEFAULT 'Pending Review', -- Pending, Accepted, Overruled
    officer_order TEXT,
    disposed_at TIMESTAMPTZ
);

-- RFCTLARR Statutory Compensation & Direct Benefit Transfer (DBT) Awards
CREATE TABLE IF NOT EXISTS compensation_awards (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) UNIQUE NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    parcel_id VARCHAR(64) NOT NULL REFERENCES parcels(id),
    owner_id VARCHAR(64) NOT NULL REFERENCES owners(id),
    circle_rate_inr NUMERIC(14, 2) NOT NULL,
    land_area_acres NUMERIC(10, 2) NOT NULL,
    market_multiplier NUMERIC(4, 2) DEFAULT 1.00 CHECK (market_multiplier >= 1.00 AND market_multiplier <= 2.00),
    base_market_value_inr NUMERIC(14, 2) NOT NULL,
    solatium_percentage NUMERIC(5, 2) DEFAULT 100.00, -- 100% Solatium under RFCTLARR Section 30(1)
    solatium_amount_inr NUMERIC(14, 2) NOT NULL,
    additional_interest_percentage NUMERIC(5, 2) DEFAULT 12.00, -- 12% per annum under Section 30(3)
    interest_amount_inr NUMERIC(14, 2) NOT NULL,
    assets_attached_value_inr NUMERIC(14, 2) DEFAULT 0.00,
    total_award_inr NUMERIC(14, 2) NOT NULL,
    rehab_grant_inr NUMERIC(14, 2) DEFAULT 50000.00,
    pfms_status VARCHAR(32) DEFAULT 'Pending', -- Pending, Approved, Disbursed, Failed
    pfms_txn_ref VARCHAR(64),
    disbursement_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Digital E-Agreements & Non-Judicial E-Stamp Deeds (₹100 Stamp)
CREATE TABLE IF NOT EXISTS agreements (
    id VARCHAR(64) PRIMARY KEY,
    agreement_number VARCHAR(64) UNIQUE NOT NULL,
    case_id VARCHAR(64) NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    parcel_id VARCHAR(64) NOT NULL REFERENCES parcels(id),
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id),
    owner_id VARCHAR(64) NOT NULL REFERENCES owners(id),
    officer_id VARCHAR(64) REFERENCES users(id),
    total_amount_inr NUMERIC(14, 2) NOT NULL,
    rehab_terms TEXT,
    status agreement_status DEFAULT 'Draft',
    draft_date DATE DEFAULT CURRENT_DATE,
    sent_date DATE,
    signed_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    -- Landowner Signature Metadata (Aadhaar e-Sign UIDAI OTP)
    owner_sign_method VARCHAR(64),
    owner_sign_cert_hash VARCHAR(128),
    owner_sign_ip VARCHAR(45),
    -- Land Officer Signature Metadata (Class-3 DSC Token & Seal)
    officer_dsc_token_serial VARCHAR(64),
    officer_dsc_cert_hash VARCHAR(128),
    officer_seal_text VARCHAR(255),
    -- Government Non-Judicial E-Stamp Certificate Reference
    estamp_certificate_no VARCHAR(64),
    deed_content_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agreements_status ON agreements (status);
CREATE INDEX IF NOT EXISTS idx_agreements_owner ON agreements (owner_id);

-- Land Revenue Documents & AI OCR Verification Records
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    parcel_id VARCHAR(64) NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    case_id VARCHAR(64) REFERENCES cases(id) ON DELETE SET NULL,
    doc_type VARCHAR(128) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    sha256_checksum VARCHAR(64),
    ocr_confidence_pct NUMERIC(5, 2),
    status document_status DEFAULT 'Uploaded',
    verified_by VARCHAR(64) REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Statutory Compliance Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(64) NOT NULL,
    severity alert_severity DEFAULT 'medium',
    message TEXT NOT NULL,
    entity_type VARCHAR(32) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by VARCHAR(64) REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Immutable Government Compliance Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    log_uuid VARCHAR(64) UNIQUE DEFAULT ('AUD-' || gen_random_uuid()),
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(128) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    user_agent TEXT,
    payload_snapshot JSONB,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs (entity_type, entity_id);

-- ---------------------------------------------------------------------
-- 4. AUTOMATED BUSINESS TRIGGERS & FUNCTIONS
-- ---------------------------------------------------------------------

-- Trigger 1: Auto-calculate PostGIS Centroid when parcel boundary is set/updated
CREATE OR REPLACE FUNCTION trg_fn_update_parcel_centroid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.boundary IS NOT NULL THEN
        NEW.centroid := ST_Centroid(NEW.boundary);
    END IF;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_parcel_centroid ON parcels;
CREATE TRIGGER trg_parcel_centroid
BEFORE INSERT OR UPDATE ON parcels
FOR EACH ROW EXECUTE FUNCTION trg_fn_update_parcel_centroid();

-- Trigger 2: Auto-compute RFCTLARR Compensation Formula (Sec 30 Solatium + 12% Interest)
CREATE OR REPLACE FUNCTION trg_fn_calculate_rfctlarr_compensation()
RETURNS TRIGGER AS $$
BEGIN
    -- Base Market Value = Circle Rate * Area * Rural/Urban Multiplier
    NEW.base_market_value_inr := NEW.circle_rate_inr * NEW.land_area_acres * COALESCE(NEW.market_multiplier, 1.00);
    
    -- Solatium: 100% of Base Market Value (Section 30(1))
    NEW.solatium_amount_inr := NEW.base_market_value_inr * (COALESCE(NEW.solatium_percentage, 100.00) / 100.00);
    
    -- Additional Interest: 12% per annum on Market Value (Section 30(3))
    NEW.interest_amount_inr := NEW.base_market_value_inr * (COALESCE(NEW.additional_interest_percentage, 12.00) / 100.00);
    
    -- Total Statutory Compensation Award
    NEW.total_award_inr := NEW.base_market_value_inr + NEW.solatium_amount_inr + NEW.interest_amount_inr + COALESCE(NEW.assets_attached_value_inr, 0.00);
    
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_compensation ON compensation_awards;
CREATE TRIGGER trg_calculate_compensation
BEFORE INSERT OR UPDATE ON compensation_awards
FOR EACH ROW EXECUTE FUNCTION trg_fn_calculate_rfctlarr_compensation();

-- Trigger 3: Synchronize Parcel Status with RFCTLARR Case Pipeline Stage
CREATE OR REPLACE FUNCTION trg_fn_sync_parcel_case_status()
RETURNS TRIGGER AS $$
DECLARE
    new_parcel_status parcel_status;
BEGIN
    CASE NEW.current_stage
        WHEN 'IDENTIFIED' THEN new_parcel_status := 'Available';
        WHEN 'VERIFICATION' THEN new_parcel_status := 'Under Verification';
        WHEN 'NOTICE_ISSUED' THEN new_parcel_status := 'Under Acquisition';
        WHEN 'OBJECTION_REVIEW' THEN new_parcel_status := 'Under Acquisition';
        WHEN 'APPROVAL' THEN new_parcel_status := 'Approved';
        WHEN 'COMPENSATION_ASSESSED' THEN new_parcel_status := 'Compensation Pending';
        WHEN 'PAYMENT_PENDING' THEN new_parcel_status := 'Compensation Pending';
        WHEN 'PAYMENT_COMPLETED' THEN new_parcel_status := 'Acquired';
        WHEN 'LAND_ACQUIRED' THEN new_parcel_status := 'Acquired';
        WHEN 'PROJECT_UTILIZATION' THEN new_parcel_status := 'Utilized';
        ELSE new_parcel_status := 'Under Acquisition';
    END CASE;

    UPDATE parcels SET status = new_parcel_status, updated_at = CURRENT_TIMESTAMP WHERE id = NEW.parcel_id;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_parcel_case ON cases;
CREATE TRIGGER trg_sync_parcel_case
AFTER INSERT OR UPDATE OF current_stage ON cases
FOR EACH ROW EXECUTE FUNCTION trg_fn_sync_parcel_case_status();

-- Trigger 4: Automatic Audit Logging for E-Agreement Signatures
CREATE OR REPLACE FUNCTION trg_fn_log_agreement_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO audit_logs (user_id, user_name, action, entity_type, entity_id, remarks)
        VALUES (
            COALESCE(NEW.officer_id, 'System'),
            'Government Audit Monitor',
            'Agreement Status Transition: ' || OLD.status::text || ' -> ' || NEW.status::text,
            'agreement',
            NEW.id,
            'Agreement #' || NEW.agreement_number || ' updated under RFCTLARR Act guidelines.'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_agreement_audit ON agreements;
CREATE TRIGGER trg_agreement_audit
AFTER UPDATE ON agreements
FOR EACH ROW EXECUTE FUNCTION trg_fn_log_agreement_lifecycle();

-- ---------------------------------------------------------------------
-- 5. BENCHMARK SEED DATA INSERTION
-- ---------------------------------------------------------------------

-- Users
INSERT INTO users (id, username, email, password_hash, full_name, role, designation, phone)
VALUES
('U-ADMIN', 'admin', 'admin@geosetu.gov.in', crypt('password123', gen_salt('bf')), 'S. Nair', 'ADMIN', 'District Nodal Administrator', '9826011111'),
('U-OFFICER', 'officer', 'officer@geosetu.gov.in', crypt('password123', gen_salt('bf')), 'R. Chouhan', 'LAND_OFFICER', 'Land Acquisition Officer (Bhopal Circle)', '9826022222'),
('U-AUTHORITY', 'authority', 'authority@geosetu.gov.in', crypt('password123', gen_salt('bf')), 'A. Deshmukh', 'PROJECT_AUTHORITY', 'Project Director, NHAI Cell', '9826033333'),
('U-OWNER', 'citizen', 'citizen@geosetu.gov.in', crypt('password123', gen_salt('bf')), 'Amit Kumar', 'LAND_OWNER', 'Verified Khatedar / Citizen', '9826012345')
ON CONFLICT (id) DO NOTHING;

-- Registered Owners
INSERT INTO owners (id, full_name, phone, email, aadhaar_masked, village, tehsil, district, bank_account_no, bank_ifsc, bank_name)
VALUES
('OWN-001', 'Amit Kumar', '9826012345', 'amit.kumar@example.in', 'XXXX-XXXX-8492', 'Bairagarh Kalan', 'Huzur', 'Bhopal', '918273645102', 'SBIN0001234', 'State Bank of India'),
('OWN-002', 'Sunita Devi', '9425098712', 'sunita.devi@example.in', 'XXXX-XXXX-6124', 'Bairagarh Kalan', 'Huzur', 'Bhopal', '827364519201', 'PUNB0123400', 'Punjab National Bank'),
('OWN-003', 'Rakesh Sharma', '9179012389', 'rakesh.sharma@example.in', 'XXXX-XXXX-5521', 'Kolar Sub-div', 'Berasia', 'Bhopal', '736451928301', 'CNRB0002345', 'Canara Bank'),
('OWN-004', 'Vikram Singh', '9893011223', 'vikram.singh@example.in', 'XXXX-XXXX-3319', 'Govindpura', 'Govindpura', 'Bhopal', '645192837402', 'HDFC0000987', 'HDFC Bank')
ON CONFLICT (id) DO NOTHING;

-- Priority Infrastructure Projects
INSERT INTO projects (id, name, type, department, location_district, required_area_acres, acquired_area_acres, utilized_area_acres, estimated_budget_inr, start_date, target_date, status, created_by)
VALUES
('PRJ-001', 'Bhopal-Indore Economic Corridor (NH-46)', 'National Highway Expansion (NHAI)', 'Ministry of Road Transport & Highways', 'Bhopal', 120.00, 84.50, 42.00, 450000000.00, '2025-01-15', '2027-12-31', 'In Progress', 'U-AUTHORITY'),
('PRJ-002', 'Bhopal Outer Ring Road (Phase-II)', 'National Highway Expansion (NHAI)', 'Urban Development Authority', 'Bhopal', 80.00, 32.00, 10.00, 280000000.00, '2025-06-01', '2028-03-31', 'In Progress', 'U-AUTHORITY'),
('PRJ-003', 'Metro Rail Feeder Depot (Sub-Circle)', 'Urban Transit Infrastructure', 'Urban Development Authority', 'Bhopal', 35.00, 35.00, 28.00, 190000000.00, '2024-03-01', '2026-10-31', 'In Progress', 'U-AUTHORITY')
ON CONFLICT (id) DO NOTHING;

-- Cadastral Parcels with Real PostGIS Geometry Polygons (Bhopal Region, SRID 4326)
INSERT INTO parcels (id, survey_number, district, tehsil, village, area_acres, land_type, owner_id, project_id, circle_rate_per_acre_inr, status, document_status, boundary)
VALUES
(
    'MP-BH-001', '142/1', 'Bhopal', 'Huzur', 'Bairagarh Kalan', 4.20, 'Agricultural (Irrigated)', 'OWN-001', 'PRJ-001', 2950000.00, 'Under Acquisition', 'Verified',
    ST_GeomFromText('POLYGON((77.4080 23.2550, 77.4120 23.2550, 77.4120 23.2590, 77.4080 23.2590, 77.4080 23.2550))', 4326)
),
(
    'MP-BH-002', '88/2', 'Bhopal', 'Huzur', 'Bairagarh Kalan', 2.80, 'Agricultural (Un-irrigated)', 'OWN-002', 'PRJ-001', 2780000.00, 'Under Acquisition', 'Verified',
    ST_GeomFromText('POLYGON((77.4130 23.2550, 77.4170 23.2550, 77.4170 23.2590, 77.4130 23.2590, 77.4130 23.2550))', 4326)
),
(
    'MP-BH-003', '215/3', 'Bhopal', 'Berasia', 'Kolar Sub-div', 5.10, 'Agricultural (Commercial Road-facing)', 'OWN-001', 'PRJ-002', 3620000.00, 'Under Acquisition', 'Verified',
    ST_GeomFromText('POLYGON((77.4180 23.2600, 77.4230 23.2600, 77.4230 23.2650, 77.4180 23.2650, 77.4180 23.2600))', 4326)
),
(
    'MP-BH-004', '304/1', 'Bhopal', 'Govindpura', 'Bairagarh Kalan', 1.95, 'Non-Agricultural Commercial', 'OWN-004', 'PRJ-003', 4710000.00, 'Under Acquisition', 'Verified',
    ST_GeomFromText('POLYGON((77.4240 23.2600, 77.4280 23.2600, 77.4280 23.2640, 77.4240 23.2640, 77.4240 23.2600))', 4326)
)
ON CONFLICT (id) DO NOTHING;

-- RFCTLARR Acquisition Cases
INSERT INTO cases (id, case_number, parcel_id, project_id, current_stage, sec_4_sia_date, sec_11_notice_date, sec_15_objection_deadline, sec_19_declaration_date, sec_23_award_date, assigned_officer_id, officer_remarks)
VALUES
('CASE-001', 'LAO-BHP-2026-001', 'MP-BH-001', 'PRJ-001', 'PAYMENT_PENDING', '2025-02-10', '2025-05-15', '2025-07-15', '2025-11-20', '2026-03-10', 'U-OFFICER', 'Statutory award passed; E-Agreement executed. DBT payment release pending.'),
('CASE-002', 'LAO-BHP-2026-002', 'MP-BH-002', 'PRJ-001', 'COMPENSATION_ASSESSED', '2025-03-01', '2025-06-10', '2025-08-10', '2025-12-05', '2026-04-01', 'U-OFFICER', 'Compensation assessed; Landowner Aadhaar e-Sign executed; Officer DSC pending.'),
('CASE-003', 'LAO-BHP-2026-003', 'MP-BH-003', 'PRJ-002', 'NOTICE_ISSUED', '2025-08-15', '2025-11-01', '2026-01-05', NULL, NULL, 'U-OFFICER', 'Preliminary notification issued under Section 11(1). Objections window open.'),
('CASE-004', 'LAO-BHP-2026-004', 'MP-BH-004', 'PRJ-003', 'VERIFICATION', '2026-01-10', NULL, NULL, NULL, NULL, 'U-OFFICER', 'Survey and field dossier verification in progress.')
ON CONFLICT (id) DO NOTHING;

-- Compensation Awards (Triggers will compute Solatium & Total Amount automatically)
INSERT INTO compensation_awards (id, case_id, parcel_id, owner_id, circle_rate_inr, land_area_acres, market_multiplier, base_market_value_inr, solatium_amount_inr, interest_amount_inr, total_award_inr, pfms_status, pfms_txn_ref)
VALUES
('COMP-001', 'CASE-001', 'MP-BH-001', 'OWN-001', 2950000.00, 4.20, 1.00, 12390000.00, 12390000.00, 1486800.00, 26266800.00, 'Approved', 'PFMS-MP-2026-883192'),
('COMP-002', 'CASE-002', 'MP-BH-002', 'OWN-002', 2780000.00, 2.80, 1.00, 7784000.00, 7784000.00, 934080.00, 16502080.00, 'Pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- E-Agreements with Digital Signatures & Non-Judicial E-Stamp Reference
INSERT INTO agreements (
    id, agreement_number, case_id, parcel_id, project_id, owner_id, officer_id,
    total_amount_inr, rehab_terms, status, draft_date, sent_date, signed_date, completed_date,
    owner_sign_method, owner_sign_cert_hash, owner_sign_ip,
    officer_dsc_token_serial, officer_dsc_cert_hash, officer_seal_text, estamp_certificate_no
)
VALUES
(
    'EAGR-2026-001', 'IN-MP-AGR-2026-001', 'CASE-001', 'MP-BH-001', 'PRJ-001', 'OWN-001', 'U-OFFICER',
    26288000.00, 'RFCTLARR Schedule II R&R Entitlement Card issued; 1 Model Residential Plot in Rehabilitation Enclave; Resettlement Grant ₹50,000.',
    'Completed', '2026-09-02', '2026-09-06', '2026-09-10 11:34:22+05:30', '2026-09-12 15:42:08+05:30',
    'Aadhaar e-Sign (UIDAI OTP)', 'SHA256:8f4b7a2e910c8842af5e12bc44093d19f', '103.24.188.42',
    'GOI-NIC-DSC-2026-9931', 'SHA256:3a99c11f78bc2281aef871b66d21b4421', 'OFFICE OF THE COMPETENT AUTHORITY & LAO, BHOPAL CIRCLE',
    'IN-MP-ESTAMP-2026-88192'
),
(
    'EAGR-2026-002', 'IN-MP-AGR-2026-002', 'CASE-002', 'MP-BH-002', 'PRJ-001', 'OWN-002', 'U-OFFICER',
    16536000.00, 'One-time resettlement allowance ₹50,000 + Subsistence grant for 12 months under RFCTLARR Sec 31.',
    'Signed', '2026-09-08', '2026-09-12', '2026-09-15 14:18:40+05:30', NULL,
    'Aadhaar e-Sign (UIDAI OTP)', 'SHA256:7d21a88b12f08819abef21198c41c0981', '103.24.188.88',
    NULL, NULL, NULL, 'IN-MP-ESTAMP-2026-88193'
),
(
    'EAGR-2026-003', 'IN-MP-AGR-2026-003', 'CASE-003', 'MP-BH-003', 'PRJ-002', 'OWN-001', 'U-OFFICER',
    39220000.00, 'Mandatory RFCTLARR Schedule II Package with Commercial kiosk allotment entitlement.',
    'Sent', '2026-09-14', '2026-09-16', NULL, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL, 'IN-MP-ESTAMP-2026-88194'
),
(
    'EAGR-2026-004', 'IN-MP-AGR-2026-004', 'CASE-004', 'MP-BH-004', 'PRJ-003', 'OWN-004', 'U-OFFICER',
    19504000.00, 'Monetary compensation package in lieu of rehabilitation under Section 31.',
    'Draft', '2026-09-17', NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL, NULL, 'IN-MP-ESTAMP-2026-88195'
)
ON CONFLICT (id) DO NOTHING;

-- Initial Audit Log Entry
INSERT INTO audit_logs (user_name, action, entity_type, entity_id, remarks)
VALUES ('System / NIC', 'PostgreSQL PostGIS Enterprise Database Schema Initialized', 'system', 'DB-ROOT', 'GeoSetu-India database created with RFCTLARR compliance triggers and PostGIS cadastral spatial index.');

-- Done!
