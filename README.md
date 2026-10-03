# GeoSetu-India (भूसेतु-भारत) — National Land Acquisition & Management System
### भारत सरकार | Government of India — GIGW 3.0 Compliant Web Portal

**GeoSetu-India** is an end-to-end national land acquisition, cadastral GIS mapping, digital e-agreements, and compensation disbursement portal compliant with the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013** and **Guidelines for Indian Government Websites (GIGW 3.0)**.

---

## 🏗️ Project Architecture & Tech Stack Separation

The codebase is organized into separated directories according to tech stack:

```
geosetu/
├── frontend/                     # Web Frontend Stack (HTML5, Vanilla CSS3, Modular JavaScript)
│   ├── index.html                # Semantic HTML structure & GIGW masthead
│   ├── css/
│   │   ├── style.css             # GIGW design tokens, responsive layout, E-Stamp deed styles
│   │   └── mobile.css            # Mobile-first responsive rules & tap target optimizations
│   └── js/
│       ├── data.js               # Constants, seed data, LocalStorage persistence & backend sync
│       ├── auth.js               # JanParichay SSO, Captcha engine, live clock, font scaling, lang toggle
│       ├── router.js             # Client-side router, navigation, sidebar, and modal system
│       ├── supabase-config.js    # In-app Supabase Cloud modal & real-time sync manager
│       ├── app.js                # Application entrypoint & DOMContentLoaded bootstrap
│       └── views/                # Route views & workflow components
│           ├── dashboard.js      # Executive analytics & Chart.js visualizations
│           ├── map.js            # Cadastral GIS map & Leaflet.js spatial overlays
│           ├── parcels.js        # Khasra land parcel registry & dossier inspection
│           ├── cases.js          # RFCTLARR 10-stage statutory acquisition pipeline
│           ├── documents.js      # Revenue document verification & AI discrepancy detection
│           ├── approvals.js      # Competent authority objections & statutory sanctions
│           ├── agreements.js     # E-Agreements, ₹100 E-Stamp deed preview, Aadhaar OTP & DSC signing
│           ├── compensation.js   # RFCTLARR compensation calculator & PFMS DBT release
│           ├── projects.js       # PM GatiShakti priority infrastructure projects & monitoring
│           ├── alerts.js         # Statutory compliance alerts, audit trail & user roles
│           └── assistant.js      # Digital India AI Assistant & legal NLP query interface
│
├── server/                       # Backend Stack (Node.js + Express + Supabase Integration)
│   ├── index.js                  # Express server entrypoint & static frontend host
│   ├── config/
│   │   └── supabase.js           # Supabase client, dynamic credential manager & fallback cache
│   ├── routes/                   # Modular REST API endpoints
│   │   ├── health.js             # /api/health (Service & Supabase latency diagnostics)
│   │   ├── auth.js               # /api/auth (Login, Registration & RBAC Directory)
│   │   ├── parcels.js            # /api/parcels (Khasra cadastre CRUD)
│   │   ├── projects.js           # /api/projects (Infrastructure project corridors)
│   │   ├── cases.js              # /api/cases (Statutory RFCTLARR progression)
│   │   ├── agreements.js         # /api/agreements (E-Signatures & ₹100 E-Stamp deeds)
│   │   ├── compensation.js       # /api/compensation (Calculator & PFMS DBT)
│   │   ├── documents.js          # /api/documents (Verification queue)
│   │   ├── approvals.js          # /api/approvals (Sanctions & NOCs)
│   │   ├── alerts.js             # /api/alerts (Compliance monitoring)
│   │   ├── audit.js              # /api/audit (Immutable cryptographic logs)
│   │   ├── ai.js                 # /api/ai/ask (Digital India Legal Assistant NLP)
│   │   └── config.js             # /api/config (Supabase connection test & seeding)
│   └── data/
│       └── seedData.js           # In-memory benchmark fallback dataset
│
├── database/                     # Enterprise Database Stack (Supabase / PostgreSQL 15+ / PostGIS 3+)
│   ├── supabase_setup.sql        # Supabase 1-click SQL setup script (Tables, RLS & Seeds)
│   ├── schema.sql                # Production DDL, spatial tables, RFCTLARR triggers
│   └── README.md                 # Setup guide, Docker 1-click command & spatial queries
│
├── devops/                       # Infrastructure & DevOps Stack (Docker, Node.js Alpine)
│   └── Dockerfile                # Node.js Alpine container definition
│
├── .env                          # Environment configuration (Port, Supabase credentials)
├── package.json                  # Node.js dependencies (Express, Supabase, CORS, Dotenv)
├── start.bat                     # Root Windows 1-Click Launch Shortcut
├── start.sh                      # Cross-Platform macOS / Linux Launch Script
└── README.md                     # Documentation & Developer Guide
```

---

## 🏛️ Government Portal Features

- **National Masthead & Emblems**: Vector Lion Capital of Ashoka (*Ashoka Stambh*) with *Satyameva Jayate*, Digital India, and PM GatiShakti insignias.
- **National Tricolor Ribbon**: Saffron, white, and green ribbon across the top banner.
- **GIGW Accessibility Top Bar**:
  - Live Indian Standard Time (IST) clock.
  - Font size controls (`A-`, `A`, `A+`) for visually impaired users.
  - Language switcher (**हिन्दी / English**).
  - High-contrast inputs with solid black typed text across dark/light OS themes.
  - Screen reader & Skip to content links.
- **Dynamic Notice Ticker**: Smooth, continuously moving marquee announcement ticker with hover-to-pause accessibility.
- **JanParichay National SSO Login & Security Captcha**:
  - High-contrast black input text styling.
  - Distorted 5-character security captcha with refresh feature.
  - 1-click test chips for instant sign-in.
  - Citizen self-service registration.
- **Digital E-Agreement Workflow (Draft → Sent → Signed → Completed)**:
  - **Draft**: Land Acquisition Officer generates statutory acquisition agreement linked to cadastral Khasra survey.
  - **Sent**: Agreement dispatched digitally to the verified Landowner/Citizen dashboard with notification banner.
  - **Signed**: Landowner reviews statutory terms, compensation breakdown (Circle Rate + 100% Solatium + 12% Interest), and signs digitally via **Aadhaar e-Sign (Simulated OTP)** or **Digital Stylus Drawing Pad**.
  - **Completed**: Officer counter-signs with **Class-3 DSC Token** and attaches the official Government seal.
  - **Official Stamp Paper Deed Preview & Print/Export**: Authentic Non-Judicial Stamp Paper format (`₹100 E-STAMP`) with Ashoka Stambh, verification QR code, dual cryptographic timestamps, and 1-click A4 print/PDF export.
- **Statutory RFCTLARR Workflow Engine**: 10-stage statutory RFCTLARR pipeline (SIA Section 4, Preliminary Notification Section 11, Declaration Section 19, Enquiry & Award Section 23/30, PFMS Direct Benefit Transfer).
- **Interactive Cadastral GIS**: Leaflet-based spatial cadastre with satellite overlay, khasra boundary search, and dispute layers.
- **NIC Standard Footer**: National Informatics Centre disclaimers, GIGW compliance badges, visitor counter, and government policy links.

---

## 🔑 Demo Login Credentials

| Role | Username | Official Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Nodal Admin** | `admin` | `admin@geosetu.gov.in` | `password123` | Full administrative control, audit log, user management |
| **Land Officer (LAO)** | `officer` | `officer@geosetu.gov.in` | `password123` | E-Agreements creation & DSC counter-signing, verification queue, Khasra inspections |
| **Project Authority (NHAI)** | `authority` | `authority@geosetu.gov.in` | `password123` | Project dashboards, objections review, sanction approvals |
| **Citizen / Khatedar** | `citizen` | `citizen@geosetu.gov.in` | `password123` | Review & e-Sign pending E-Agreements, "My Land" records, compensation calculator |

> **Tip**: You can click the 1-click preset chips at the bottom of the sign-in card to automatically populate credentials and security captcha.

---

## 🚀 How to Run

### Method 1: 1-Click Launch (Windows)
Double-click `start.bat` in the root folder. It will launch the local PowerShell server and open `http://localhost:8080` in your default browser.

### Method 2: PowerShell
Run the server from either the repository root or the `server/` directory:
```powershell
powershell -ExecutionPolicy Bypass -File .\server\server.ps1 -Port 8080
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.

### Method 3: Docker (Containerized Deployment)
Build and run the container from the project root:
```bash
docker build -f devops/Dockerfile -t geosetu-portal .
docker run -d -p 8080:80 geosetu-portal
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.
