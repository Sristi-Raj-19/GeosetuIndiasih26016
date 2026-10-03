# GeoSetu-India Database Guide — PostgreSQL + PostGIS 🗺️
### National Land Acquisition & Management System | RFCTLARR Act, 2013 & GIGW 3.0

This directory contains the production-grade **PostgreSQL 15+ & PostGIS 3+** database schema for GeoSetu-India.

---

## 📁 Files in this Directory

- **[`schema.sql`](file:///c:/Users/ADMIN/Downloads/terrabyteunzip/database/schema.sql)**: Complete database definition including:
  - PostGIS geospatial vector extensions (`GEOMETRY(Polygon, 4326)` and `GEOMETRY(Point, 4326)`).
  - Spatial GIST indexes for sub-millisecond GIS parcel boundary intersections.
  - Automated statutory RFCTLARR compensation triggers (100% Solatium + 12% Interest).
  - Multi-role administrative RBAC users with encrypted passwords (`crypt(..., gen_salt('bf'))`).
  - Pre-seeded Khasra parcels, cases, projects, and e-agreements.

---

## 🚀 How to Run & Initialize the Database

### Option 1: 1-Click Docker Command (Recommended)
You can spin up a fully-configured PostgreSQL + PostGIS instance with the schema auto-loaded in one command:

```bash
docker run -d \
  --name geosetu-db \
  -e POSTGRES_DB=geosetu \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v $(pwd)/database/schema.sql:/docker-entrypoint-initdb.d/init.sql \
  postgis/postgis:15-3.3-alpine
```

### Option 2: Existing PostgreSQL Server
If you already have PostgreSQL and PostGIS installed:
```bash
# 1. Create the database
createdb -U postgres geosetu

# 2. Run the schema
psql -U postgres -d geosetu -f database/schema.sql
```

### Option 3: Free Cloud Hosted (Supabase) ⚡ (Recommended)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open [`database/supabase_setup.sql`](file:///c:/Users/ADMIN/Downloads/terrabyteunzip/database/supabase_setup.sql), copy all lines, paste into the editor, and click **Run**.
4. In Supabase, go to **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://your-project.supabase.co`)
   - **anon Public API Key** (`eyJhb...`)
5. Open GeoSetu-India in your browser, click **⚡ Supabase** in the top navigation bar, paste your credentials, and click **Save & Connect**!
6. GeoSetu-India will immediately sync your cloud parcels, projects, cases, and agreements with real-time cloud persistence!


---

## 🏛️ Statutory RFCTLARR Automated Triggers

The database has built-in triggers that enforce Indian land acquisition laws:

1. **`trg_calculate_compensation`**:
   - Automatically computes **100% Solatium** under Section 30(1) of RFCTLARR Act:
     $$\text{Solatium} = 100\% \times \text{Base Market Value}$$
   - Automatically calculates **12% Additional Interest** per annum under Section 30(3).
   - Generates the total statutory award without requiring manual calculation.

2. **`trg_parcel_centroid`**:
   - Whenever a parcel polygon boundary is inserted or edited, PostGIS automatically calculates its exact geometric center (`ST_Centroid`) for map pin placements.

3. **`trg_sync_parcel_case`**:
   - Automatically updates `parcels.status` whenever a legal case advances through the 10-stage RFCTLARR pipeline (`IDENTIFIED` $\rightarrow$ `NOTICE_ISSUED` $\rightarrow$ `PAYMENT_COMPLETED`, etc.).

4. **`trg_agreement_audit`**:
   - Automatically writes an immutable audit record into `audit_logs` whenever an agreement is drafted, dispatched, signed with Aadhaar OTP, or counter-signed with an officer DSC token.

---

## 🗺️ Cadastral Spatial Queries (PostGIS Examples)

### 1. Find all land parcels inside an infrastructure project buffer zone
```sql
SELECT p.id, p.survey_number, p.village, p.area_acres, o.full_name AS owner_name
FROM parcels p
JOIN owners o ON p.owner_id = o.id
WHERE ST_DWithin(
    p.boundary::geography,
    ST_SetSRID(ST_MakePoint(77.4126, 23.2599), 4326)::geography,
    5000 -- 5km radius buffer
);
```

### 2. Export all parcels as GeoJSON for frontend Leaflet.js
```sql
SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(p.*)::json)
)
FROM (
    SELECT id, survey_number, village, area_acres, status, boundary 
    FROM parcels
) p;
```
