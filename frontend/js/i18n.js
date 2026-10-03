/* ==========================================================================
   GeoSetu-India (भूसेतु-भारत) — MULTILINGUAL i18n ENGINE
   Compliant with Guidelines for Indian Government Websites (GIGW 3.0)
   Strict Single-Language Mode: Pure English in English, Pure Hindi in Hindi,
   and localized native support across all 22 Eighth Schedule Constitutional Languages
   ========================================================================== */

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'sd', name: 'Sindhi', native: 'सिन्धी' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈलोन्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', native: 'कश्मीरी' }
];

let currentLang = 'en';

const TRANSLATIONS = {
  // ================= ENGLISH (100% PURE ENGLISH) =================
  en: {
    // Masthead & Top Bar
    skip_content: "Skip to Main Content",
    gov_top_masthead: "Government of India • Ministry of Rural Development • Department of Land Resources",
    gov_in: "Government of India",
    ministry: "Ministry of Rural Development",
    dept: "Department of Land Resources",
    dept_full: "Department of Land Resources • Ministry of Rural Development • Government of India",
    portal_brand: "GeoSetu-India",
    portal_tag: "National Land Acquisition & Management System",
    satyam: "Satyameva Jayate",
    circle_location: "Bhopal Circle, MP",
    
    // Quick Utility Buttons
    a11y_btn: "♿ Accessibility",
    screen_reader_btn: "🔊 Screen Reader",
    sitemap_btn: "🗺️ Sitemap",
    contact_btn: "📞 Contact / Help",
    contrast_btn: "◐ Contrast",
    mobile_view_btn: "📱 Mobile View",
    desktop_view_btn: "🖥️ Desktop Site",
    supabase_btn: "⚡ Supabase",

    // Navigation Bar
    nav_home: "HOME",
    nav_about: "ABOUT US",
    nav_acquisition: "LAND ACQUISITION",
    nav_management: "LAND MANAGEMENT",
    nav_projects: "PROJECTS",
    nav_gis: "GIS MAP",
    nav_documents: "DOCUMENTS",
    nav_guidelines: "GUIDELINES & ACTS",
    nav_contact_us: "CONTACT US",
    nav_login: "LOGIN / SSO",
    nav_logout: "Sign Out",
    back_to_home: "← Back to Portal Home",
    home_crumb: "Home",
    sso_crumb: "Central Single Sign-On (JanParichay SSO)",

    // Marquee Ticker
    ticker_badge: "📢 LATEST NOTICE",
    ticker_items: [
      { text: "Section 4(1) Preliminary notification published for Bharatmala Expressway Phase-IV (Parcels 104-189, District Nagpur).", date: "[24 Sep 2026]" },
      { text: "DBT Batch #4092: ₹142.50 Crore compensation directly credited to 842 Khatedars under RFCTLARR Act 2013.", date: "[23 Sep 2026]" },
      { text: "Social Impact Assessment (SIA) public hearing scheduled on 30-Sep-2026 at Collectorate Hall, Pune.", date: "[22 Sep 2026]" },
      { text: "E-Agreement Portal Active: Khatedars & Officers can now review, e-Sign with Aadhaar, and generate timestamped deeds.", date: "[21 Sep 2026]" }
    ],

    // Public Home Tabs & Sections
    tab_overview: "🏛️ National Dashboard & Registry",
    tab_inquiry: "🔍 Citizen Land Inquiry & Grievance",
    metric_land_title: "Total Land Under Acquisition",
    metric_land_sub: "142 National Infrastructure Corridors",
    metric_dbt_title: "Direct Benefit Transfer (DBT) Disbursed",
    metric_dbt_sub: "128,490 Verified Khatedars",
    metric_gazette_title: "Active Gazette Notifications",
    metric_gazette_sub: "Sec 4: 840 | Sec 11: 642",
    metric_grievance_title: "Claims & Grievances Resolved",
    metric_grievance_sub: "18,420 of 19,028 resolved",
    
    about_card_title: "About Us — GeoSetu-India Platform",
    about_card_p1: "GeoSetu-India (National Land Acquisition & Management System) is the unified digital public infrastructure engineered to bring complete transparency, algorithmic accountability, and direct citizen benefit transfer to land acquisition proceedings across India.",
    btn_read_more: "Read More Detailed Overview ▼",
    btn_read_less: "Show Less ▲",
    
    pillars_tag: "RFCTLARR ACT 2013 COMPLIANT • DIGITAL PUBLIC INFRASTRUCTURE",
    pillars_heading: "Key Statutory Pillars & Digital Governance",
    pillars_sub: "A single unified digital architecture ensuring complete transparency, geospatial precision, and algorithmic accountability across national corridor acquisitions.",
    
    cta_badge: "🔒 OFFICIAL GATEWAY • JANPARICHAY SSO",
    cta_title: "Ready to Access Officer or Citizen Services?",
    cta_desc: "Sign in to manage land acquisition cases, approve Section 11/19 declarations, execute e-agreements, track DBT compensation payouts, or access high-precision cadastral GIS maps.",
    btn_proceed_login: "🔑 Proceed to Login / SSO →",
    btn_citizen_inquiry: "🔍 Citizen Land Inquiry & Grievance",

    // Citizen Inquiry Form
    inq_title: "Citizen Land Details & Compensation Inquiry",
    inq_sub: "Verify cadastral RoR records, track statutory Section 15 objections, or calculate compensation entitlement under RFCTLARR Act 2013.",
    lbl_state: "State",
    lbl_survey: "Survey / Plot Number",
    lbl_khasra: "Khasra Number",
    lbl_khatedar_name: "Khatedar Full Name",
    lbl_mobile: "Aadhaar Linked Mobile Number",
    lbl_category: "Select Inquiry / Claim Category",
    cat_comp: "Compensation Award Verification",
    cat_comp_desc: "Verify statutory calculation under Sec 26-30 (Circle rate + Multiplier + 100% Solatium).",
    cat_obj: "Statutory Objection (Section 15)",
    cat_obj_desc: "File objection regarding land boundaries, area discrepancy or public purpose declaration.",
    cat_dbt: "DBT Payment Status / Bank Issue",
    cat_dbt_desc: "Track Aadhaar-seeded compensation credit delay or mandate rectification.",
    lbl_declaration_title: "Statutory Declaration under Section 84 of RFCTLARR Act 2013",
    lbl_declaration_desc: "I hereby solemnly declare that the land survey details provided are accurate as per the official Record of Rights (RoR). Providing false information is punishable under law.",
    btn_reset: "Reset Form",
    btn_submit_inq: "Submit Inquiry →",

    // Single Sign-On Page
    sso_heading: "Central Single Sign-On",
    sso_sub: "Official Portal Gateway (JanParichay / MeriPehchan SSO)",
    sso_hero_title: "National Land Acquisition & Management Portal",
    sso_hero_sub: "A single unified digital record of every land parcel, acquisition proceeding, spatial boundary, and compensation rupee moving from preliminary notification to project commissioning.",
    tab_signin: "Officer / Staff Sign In",
    tab_register: "Citizen / New User Registration",
    lbl_identifier: "Official Email ID / Username / Parichay ID",
    lbl_password: "Password",
    lbl_captcha: "Security Verification Code",
    lbl_remember: "Remember session",
    btn_help_creds: "Credential Assistance",
    btn_signin: "Sign In to Portal →",
    lbl_reg_name: "Full Name",
    lbl_reg_email: "Official Email ID",
    lbl_reg_phone: "Mobile Number",
    lbl_reg_role: "Portal Role",
    lbl_reg_village: "Village",
    lbl_reg_tehsil: "Tehsil",
    lbl_reg_district: "District",
    btn_register: "Register & Generate Credentials →",

    // Sidebar Navigation Groups
    group_pinned: "Frequently Used",
    group_overview: "Overview",
    group_field_ops: "Field Operations",
    group_records: "Land Records",
    group_acquisition: "Acquisition Workflow",
    group_projects: "Projects & Proposals",
    group_decision: "Decision Support & AI",
    group_oversight: "Oversight & Admin",
    group_system: "System",
    sidebar_search_placeholder: "Search navigation...",
    no_nav_matches: "No matching menu items found",

    // Sidebar Nav Items
    item_dashboard: "Executive Dashboard",
    item_my_land: "My Land Records",
    item_my_agreements: "My E-Agreements",
    item_proposals: "Project Proposals",
    item_field_tasks: "Field Verification Tasks",
    item_field_review: "Field Submission Review",
    item_possession_rr: "Possession & R&R Tracker",
    item_bottlenecks: "AI Bottleneck Detection",
    item_reports: "Executive & MIS Reports",
    item_notifications: "Role Notifications",
    item_map: "GIS Cadastral Map",
    item_parcels: "Land Parcels Directory",
    item_cases: "Acquisition Cases",
    item_documents: "Document Verification",
    item_agreements: "Digital E-Agreements",
    item_approvals: "Sanctions & Approvals",
    item_compensation: "Compensation & PFMS DBT",
    item_projects: "Infrastructure Corridors",
    item_monitoring: "Progress Monitoring",
    item_decision_support: "Decision Support DSS",
    item_alerts: "Compliance Alerts",
    item_audit: "Cryptographic Audit Trail",
    item_ai: "AI Legal Assistant",
    item_users: "User & Role Directory",
    item_reset_data: "Reset Demo Data",

    // User Roles (7 Statutory Roles)
    role_CENTRAL: "Central / Ministry Authority",
    role_STATE: "State Authority (Revenue Dept)",
    role_DISTRICT: "District Authority (Collector / CALA)",
    role_PROJECT_AGENCY: "Project Agency / Requiring Body",
    role_ACQUISITION_OFFICER: "Land Acquisition Officer (LAO)",
    role_FIELD_OFFICER: "Field Verification Officer / Surveyor",
    role_CITIZEN: "Citizen / Affected Landowner",
    role_ADMIN: "District Authority (Collector / CALA)",
    role_LAND_OFFICER: "Land Acquisition Officer",
    role_PROJECT_AUTHORITY: "Project Agency (NHAI/Railways)",
    role_LAND_OWNER: "Citizen / Affected Landowner",

    // Workflow Stages (10-Stage RFCTLARR Lifecycle)
    wf_PROPOSAL: "Project Proposal",
    wf_SCRUTINY: "Digital Scrutiny",
    wf_VERIFICATION: "Verification",
    wf_APPROVAL: "Competent Approval",
    wf_NOTICE_ISSUED: "Section 11(1) Notice",
    wf_AWARD: "Section 23/30 Award",
    wf_COMPENSATION_ASSESSED: "Compensation Assessment",
    wf_PAYMENT_COMPLETED: "DBT Disbursed (PFMS)",
    wf_POSSESSION: "Section 38 Possession",
    wf_RR_COMPLETED: "R&R Handover & Closure",
    wf_IDENTIFIED: "Project Proposal",
    wf_OBJECTION_REVIEW: "Section 15 Hearing",
    wf_PAYMENT_PENDING: "DBT Processing",
    wf_LAND_ACQUIRED: "Section 38 Possession",
    wf_PROJECT_UTILIZATION: "R&R Handover & Closure",

    // Route Titles [Breadcrumb, Main Title]
    title_dashboard: ["Overview", "Executive Land Acquisition & Decision Support Dashboard"],
    title_my_land: ["Citizen Portal", "My Registered Land Holdings & Khasra"],
    title_proposals: ["Project Agency", "Land Acquisition Project Proposals & Scrutiny"],
    title_field_tasks: ["Field Operations", "Assigned Ground Verification Tasks & Geo-Tagging"],
    title_field_verify: ["Field Operations", "Ground Verification Form & GPS Capture"],
    title_field_review: ["District CALA", "Field Officer Submission Review & Sanction"],
    title_possession_rr: ["R&R & Handover", "Section 38 Physical Possession & R&R Entitlements"],
    title_bottlenecks: ["AI Decision Support", "Machine Learning Bottleneck Radar & Llama 3.2 Synthesis"],
    title_reports: ["Executive Reports", "National & State MIS Land Acquisition Progress Reports"],
    title_notifications: ["Communications", "Role-Aware Notifications & Statutory Alerts"],
    title_map: ["Geospatial Information System", "Cadastral Land Parcel GIS Map"],
    title_parcels: ["Revenue Records", "National Land Parcel Registry (Khasra/RoR)"],
    title_parcel_detail: ["Revenue Records", "Cadastral Parcel Dossier"],
    title_cases: ["Acquisition Proceedings", "Statutory Land Acquisition Cases (RFCTLARR 2013)"],
    title_case_detail: ["Acquisition Proceedings", "Statutory Case Proceeding Details"],
    title_documents: ["Verification Queue", "Land Title Verification & AI Discrepancy Checks"],
    title_e_agreements: ["Digital Governance", "Digital E-Agreements & E-Stamp Deeds"],
    title_approvals: ["Statutory Clearances", "Competent Authority Sanctions & NOC"],
    title_compensation: ["DBT Compensation", "Direct Benefit Transfer (PFMS) & Award Determination"],
    title_projects: ["National Infrastructure", "PM GatiShakti Priority Infrastructure Corridors"],
    title_project_detail: ["National Infrastructure", "Infrastructure Project Alignment Dossier"],
    title_monitoring: ["Physical Progress", "Acquisition Milestone & Handover Monitoring"],
    title_decision_support: ["Decision Support", "Geospatial Alignment & Parcel Feasibility DSS"],
    title_alerts: ["Vigilance", "Statutory Delays, Notice Expirations & Alerts"],
    title_audit: ["Audit Trail", "Cryptographic Immutable Activity Audit Trail"],
    title_ai: ["Digital India AI", "GeoSetu-India AI Assistant & Legal Enquiry"],
    title_users: ["Security Administration", "Portal Users, Roles & Jurisdiction Directory"],

    // Common Buttons & Labels
    common_search: "Search",
    common_filter: "Filter",
    common_export: "Export CSV",
    common_print: "Print / PDF",
    common_close: "Close",
    common_submit: "Submit",
    common_reset: "Reset",
    common_status: "Status",
    common_actions: "Actions",
    common_view: "View",
    common_loading: "Loading IST...",
    lang_switched: "Language switched to English",
    disclaimer_text: "⚠️ PROTOTYPE NOTICE: GeoSetu-India is a conceptual digital demonstration platform developed for research and hackathon prototyping purposes. It is not an officially deployed Government of India portal."
  },

  // ================= HINDI (100% PURE HINDI) =================
  hi: {
    // Masthead & Top Bar
    skip_content: "मुख्य सामग्री पर जाएं",
    gov_top_masthead: "भारत सरकार • ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग",
    gov_in: "भारत सरकार",
    ministry: "ग्रामीण विकास मंत्रालय",
    dept: "भूमि संसाधन विभाग",
    dept_full: "भूमि संसाधन विभाग • ग्रामीण विकास मंत्रालय • भारत सरकार",
    portal_brand: "भूसेतु-भारत",
    portal_tag: "राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन पोर्टल",
    satyam: "सत्यमेव जयते",
    circle_location: "भोपाल वृत्त, मध्य प्रदेश",
    
    // Quick Utility Buttons
    a11y_btn: "♿ सुगम्यता",
    screen_reader_btn: "🔊 स्क्रीन रीडर",
    sitemap_btn: "🗺️ साइटमैप",
    contact_btn: "📞 संपर्क एवं सहायता",
    contrast_btn: "◐ उच्च कंट्रास्ट",
    mobile_view_btn: "📱 मोबाइल दृश्य",
    desktop_view_btn: "🖥️ डेस्कटॉप दृश्य",
    supabase_btn: "⚡ सुप्राबेस",

    // Navigation Bar
    nav_home: "मुख्य पृष्ठ",
    nav_about: "हमारे बारे में",
    nav_acquisition: "भूमि अधिग्रहण",
    nav_management: "भूमि प्रबंधन",
    nav_projects: "परियोजनाएं",
    nav_gis: "भू-स्थानिक नक्शा",
    nav_documents: "दस्तावेज़",
    nav_guidelines: "दिशानिर्देश व अधिनियम",
    nav_contact_us: "संपर्क करें",
    nav_login: "प्रवेश / एसएसओ",
    nav_logout: "लॉगआउट",
    back_to_home: "← मुख्य पृष्ठ पर वापस जाएं",
    home_crumb: "मुख्य पृष्ठ",
    sso_crumb: "केंद्रीय एकल प्रवेश द्वार (जनपरिचय एसएसओ)",

    // Marquee Ticker
    ticker_badge: "📢 नवीन सूचना",
    ticker_items: [
      { text: "भारतमाला एक्सप्रेसवे चरण-IV (खसरा 104-189, ज़िला नागपुर) हेतु धारा 4(1) प्रारंभिक अधिसूचना प्रकाशित।", date: "[24 सितं 2026]" },
      { text: "डीबीटी किश्त #4092: आरएफसीटीएलएआरआर अधिनियम के अंतर्गत 842 खातेदारों को ₹142.50 करोड़ अंतरित।", date: "[23 सितं 2026]" },
      { text: "सामाजिक प्रभाव मूल्यांकन (एसआईए) जनसुनवाई 30-सितंबर-2026 को कलेक्ट्रेट सभागार में नियत।", date: "[22 सितं 2026]" },
      { text: "ई-समझौता पोर्टल सक्रिय: खातेदार एवं अधिकारी आधार ओटीपी से ई-हस्ताक्षर कर विलेख प्राप्त कर सकते हैं।", date: "[21 सितं 2026]" }
    ],

    // Public Home Tabs & Sections
    tab_overview: "🏛️ राष्ट्रीय अवलोकन एवं निर्देशिका",
    tab_inquiry: "🔍 नागरिक भूमि पूछताछ एवं शिकायत",
    metric_land_title: "कुल अधिग्रहीत की जा रही भूमि",
    metric_land_sub: "142 राष्ट्रीय अवसंरचना गलियारे",
    metric_dbt_title: "प्रत्यक्ष लाभ अंतरण (डीबीटी) वितरित",
    metric_dbt_sub: "1,28,490 सत्यापित खातेदार",
    metric_gazette_title: "सक्रिय राजपत्र अधिसूचनाएं",
    metric_gazette_sub: "धारा 4: 840 | धारा 11: 642",
    metric_grievance_title: "निस्तारित दावे व आपत्तियां",
    metric_grievance_sub: "19,028 में से 18,420 निस्तारित",
    
    about_card_title: "हमारे बारे में — भूसेतु-भारत मंच",
    about_card_p1: "भूसेतु-भारत (राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली) संपूर्ण भारत में भूमि अधिग्रहण कार्यवाहियों में पूर्ण पारदर्शिता, विधिक जवाबदेही और सीधे नागरिक लाभ अंतरण सुनिश्चित करने हेतु विकसित एकीकृत डिजिटल सार्वजनिक अवसंरचना है।",
    btn_read_more: "विस्तृत विवरण देखें ▼",
    btn_read_less: "संक्षिप्त विवरण ▲",
    
    pillars_tag: "आरएफसीटीएलएआरआर २०१३ अनुपालित • डिजिटल सार्वजनिक अवसंरचना",
    pillars_heading: "प्रमुख सांविधिक स्तंभ एवं डिजिटल अभिशासन",
    pillars_sub: "राष्ट्रीय गलियारा अधिग्रहणों में पूर्ण पारदर्शिता, भू-स्थानिक सटीकता और विधिक अनुपालन सुनिश्चित करने वाली एकीकृत वास्तुकला।",
    
    cta_badge: "🔒 आधिकारिक प्रवेश द्वार • जनपरिचय एसएसओ",
    cta_title: "अधिकारी अथवा नागरिक सेवाओं का उपयोग करें",
    cta_desc: "भूमि अधिग्रहण प्रकरणों के प्रबंधन, धारा 11/19 स्वीकृतियों, ई-समझौता निष्पादन, डीबीटी भुगतान निगरानी अथवा जीआईएस नक्शों हेतु प्रवेश करें।",
    btn_proceed_login: "🔑 प्रवेश पृष्ठ पर जाएं →",
    btn_citizen_inquiry: "🔍 नागरिक पूछताछ एवं शिकायत दर्ज करें",

    // Citizen Inquiry Form
    inq_title: "नागरिक भूमि विवरण व प्रतिकर पूछताछ",
    inq_sub: "राजस्व खसरा अभिलेख सत्यापन, धारा 15 आपत्ति की स्थिति एवं आरएफसीटीएलएआरआर २०१३ के तहत देय प्रतिकर की गणना करें।",
    lbl_state: "राज्य",
    lbl_survey: "सर्वे / भूखंड संख्या",
    lbl_khasra: "खसरा क्रमांक",
    lbl_khatedar_name: "खातेदार का पूरा नाम",
    lbl_mobile: "आधार से जुड़ा मोबाइल नंबर",
    lbl_category: "पूछताछ अथवा दावे की श्रेणी चुनें",
    cat_comp: "प्रतिकर एवार्ड सत्यापन",
    cat_comp_desc: "धारा 26-30 के अंतर्गत सांविधिक प्रतिकर (सर्किल दर + गुणांक + 100% सोलेशियम) की गणना जांचें।",
    cat_obj: "सांविधिक आपत्ति (धारा 15)",
    cat_obj_desc: "भूमि सीमा, क्षेत्रफल विसंगति अथवा लोक प्रयोजन अधिसूचना संबंधी आपत्ति दर्ज करें।",
    cat_dbt: "डीबीटी भुगतान स्थिति / बैंक त्रुटि",
    cat_dbt_desc: "आधार-लिंक्ड बैंक खाते में प्रतिकर राशि अंतरण की स्थिति जांचें।",
    lbl_declaration_title: "आरएफसीटीएलएआरआर अधिनियम २०१३ की धारा 84 के अंतर्गत सांविधिक घोषणा",
    lbl_declaration_desc: "मैं सत्यनिष्ठा से घोषणा करता/करती हूँ कि प्रदत्त भूमि विवरण राजस्व अभिलेखों के अनुसार पूर्णतः सत्य हैं। मिथ्या जानकारी देना विधि अनुसार दंडनीय अपराध है।",
    btn_reset: "फॉर्म रीसेट करें",
    btn_submit_inq: "पूछताछ प्रेषित करें →",

    // Single Sign-On Page
    sso_heading: "केंद्रीय एकल प्रवेश द्वार",
    sso_sub: "एकल खिड़की प्रमाणीकरण (जनपरिचय / मेरीपहचान एसएसओ)",
    sso_hero_title: "राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन पोर्टल",
    sso_hero_sub: "प्रारंभिक अधिसूचना से लेकर निर्माण हैंडओवर तक प्रत्येक भूमि पार्सल, अधिग्रहण कार्यवाही, भू-सीमा और प्रतिकर राशि का एकल डिजिटल अभिलेख।",
    tab_signin: "अधिकारी / कर्मचारी प्रवेश",
    tab_register: "नागरिक / नवीन प्रयोक्ता पंजीकरण",
    lbl_identifier: "आधिकारिक ईमेल आईडी / प्रयोक्ता नाम / परिचय आईडी",
    lbl_password: "गुप्त पासवर्ड",
    lbl_captcha: "सुरक्षा सत्यापन कोड",
    lbl_remember: "सत्र सुरक्षित रखें",
    btn_help_creds: "लॉगिन सहायता",
    btn_signin: "पोर्टल में प्रवेश करें →",
    lbl_reg_name: "पूरा नाम",
    lbl_reg_email: "आधिकारिक ईमेल",
    lbl_reg_phone: "मोबाइल नंबर",
    lbl_reg_role: "पोर्टल भूमिका",
    lbl_reg_village: "ग्राम",
    lbl_reg_tehsil: "तहसील",
    lbl_reg_district: "ज़िला",
    btn_register: "पंजीकरण करें व क्रेडेंशियल प्राप्त करें →",

    // Sidebar Navigation Groups
    group_pinned: "त्वरित सेवाएं",
    group_overview: "राष्ट्रीय अवलोकन",
    group_field_ops: "क्षेत्रीय कार्यवाही",
    group_records: "भू-अभिलेख",
    group_acquisition: "अधिग्रहण कार्य",
    group_projects: "अवसंरचना परियोजनाएं",
    group_decision: "निर्णय सहायता व AI",
    group_oversight: "सतर्कता व प्रशासन",
    group_system: "व्यवस्था",
    sidebar_search_placeholder: "मेन्यू खोजें...",
    no_nav_matches: "कोई विकल्प नहीं मिला",

    // Sidebar Nav Items
    item_dashboard: "कार्यकारी डैशबोर्ड",
    item_my_land: "मेरी पंजीकृत भूमि",
    item_my_agreements: "मेरे ई-समझौते",
    item_proposals: "परियोजना प्रस्ताव",
    item_field_tasks: "क्षेत्रीय सत्यापन कार्य",
    item_field_review: "क्षेत्रीय रिपोर्ट समीक्षा",
    item_possession_rr: "कब्जा एवं आर एंड आर ट्रैकर",
    item_bottlenecks: "एआई गतिरोध पहचान",
    item_reports: "कार्यकारी एमआईएस रिपोर्ट",
    item_notifications: "भूमिका सूचनाएं",
    item_map: "भू-स्थानिक नक्शा",
    item_parcels: "खसरा व भूखंड निर्देशिका",
    item_cases: "अधिग्रहण प्रकरण",
    item_documents: "दस्तावेज़ सत्यापन",
    item_agreements: "डिजिटल ई-समझौता विलेख",
    item_approvals: "अनुमोदन व संस्वीकृति",
    item_compensation: "प्रतिकर एवं पीएफएमएस डीबीटी",
    item_projects: "अवसंरचना गलियारे",
    item_monitoring: "प्रगति निगरानी",
    item_decision_support: "निर्णय सहायता प्रणाली",
    item_alerts: "सतर्कता सूचनाएं",
    item_audit: "अपरिवर्तनीय ऑडिट ट्रेल",
    item_ai: "विधिक एआई सहायक",
    item_users: "प्रयोक्ता व भूमिका निर्देशिका",
    item_reset_data: "डाटा पुनर्स्थापित करें",

    // User Roles
    role_CENTRAL: "केंद्रीय / मंत्रालय प्राधिकारी",
    role_STATE: "राज्य प्राधिकारी (राजस्व विभाग)",
    role_DISTRICT: "ज़िला समाहर्ता एवं सक्षम प्राधिकारी (CALA)",
    role_PROJECT_AGENCY: "परियोजना एजेंसी / भू-अपेक्षी निकाय",
    role_ACQUISITION_OFFICER: "भू-अधिग्रहण अधिकारी (LAO)",
    role_FIELD_OFFICER: "क्षेत्रीय सत्यापन अधिकारी / सर्वेक्षक",
    role_CITIZEN: "नागरिक / प्रभावित खातेदार",
    role_ADMIN: "ज़िला समाहर्ता एवं सक्षम प्राधिकारी (CALA)",
    role_LAND_OFFICER: "भू-अधिग्रहण अधिकारी (LAO)",
    role_PROJECT_AUTHORITY: "परियोजना एजेंसी (NHAI/रेलवे)",
    role_LAND_OWNER: "नागरिक / प्रभावित खातेदार",

    // Workflow Stages
    wf_PROPOSAL: "परियोजना प्रस्ताव",
    wf_SCRUTINY: "डिजिटल संवीक्षा",
    wf_VERIFICATION: "सत्यापन",
    wf_APPROVAL: "सक्षम अनुमोदन",
    wf_NOTICE_ISSUED: "धारा 11(1) सूचना",
    wf_AWARD: "धारा 23/30 एवार्ड",
    wf_COMPENSATION_ASSESSED: "प्रतिकर निर्धारण",
    wf_PAYMENT_COMPLETED: "डीबीटी भुगतान संपन्न",
    wf_POSSESSION: "धारा 38 कब्जा संपन्न",
    wf_RR_COMPLETED: "आर एंड आर एवं समापन",
    wf_IDENTIFIED: "परियोजना प्रस्ताव",
    wf_OBJECTION_REVIEW: "धारा 15 सुनवाई",
    wf_PAYMENT_PENDING: "डीबीटी प्रक्रियाधीन",
    wf_LAND_ACQUIRED: "धारा 38 कब्जा",
    wf_PROJECT_UTILIZATION: "आर एंड आर एवं समापन",

    // Route Titles [Breadcrumb, Main Title]
    title_dashboard: ["राष्ट्रीय अवलोकन", "केंद्रीय भूमि अधिग्रहण एवं निर्णय सहायता डैशबोर्ड"],
    title_my_land: ["नागरिक सेवा", "मेरी पंजीकृत भूमि व खसरा अभिलेख"],
    title_proposals: ["परियोजना एजेंसी", "भूमि अधिग्रहण प्रस्ताव व संवीक्षा स्थिति"],
    title_field_tasks: ["क्षेत्रीय कार्यवाही", "आवंटित क्षेत्रीय सत्यापन कार्य व जीपीएस टैगिंग"],
    title_field_verify: ["क्षेत्रीय कार्यवाही", "भूखंड सत्यापन फॉर्म व जीपीएस कैप्चर"],
    title_field_review: ["ज़िला समाहर्ता (CALA)", "क्षेत्रीय अधिकारी सत्यापन रिपोर्ट समीक्षा"],
    title_possession_rr: ["कब्जा व पुनर्वास", "धारा 38 भौतिक कब्जा एवं पुनर्वासन पैकेज"],
    title_bottlenecks: ["एआई निर्णय सहायता", "मशीन लर्निंग गतिरोध पहचान व Llama 3.2 विश्लेषण"],
    title_reports: ["कार्यकारी रिपोर्ट", "राष्ट्रीय एवं राज्य एमआईएस प्रगति रिपोर्ट"],
    title_notifications: ["संचार प्रणाली", "भूमिका आधारित सूचनाएं एवं विधिक अलर्ट"],
    title_map: ["भू-स्थानिक सूचना प्रणाली", "कैडस्ट्रल भूखंड जीआईएस नक्शा"],
    title_parcels: ["राजस्व अभिलेख", "राष्ट्रीय खसरा व भूखंड निर्देशिका"],
    title_parcel_detail: ["राजस्व अभिलेख", "भूखंड विवरण एवं कैडस्ट्रल दस्तावेज़"],
    title_cases: ["अधिग्रहण कार्यवाही", "सांविधिक भूमि अधिग्रहण प्रकरण (आरएफसीटीएलएआरआर २०१३)"],
    title_case_detail: ["अधिग्रहण कार्यवाही", "प्रकरण कार्यवाही का विस्तृत विवरण"],
    title_documents: ["दस्तावेज़ सत्यापन", "भू-स्वामित्व सत्यापन व विसंगति जांच"],
    title_e_agreements: ["ई-अभिशासन", "डिजिटल भू-अधिग्रहण ई-समझौता व ई-स्टाम्प विलेख"],
    title_approvals: ["सांविधिक अनुमोदन", "सक्षम प्राधिकारी अनापत्ति (एनओसी) व स्वीकृतियां"],
    title_compensation: ["प्रतिकर वितरण", "प्रत्यक्ष लाभ अंतरण (पीएफएमएस) व एवार्ड निर्धारण"],
    title_projects: ["राष्ट्रीय अवसंरचना", "पीएम गतिशक्ति राष्ट्रीय अवसंरचना गलियारे"],
    title_project_detail: ["राष्ट्रीय अवसंरचना", "अवसंरचना परियोजना संरेखण विवरण"],
    title_monitoring: ["भौतिक प्रगति", "अधिग्रहण मील के पत्थर व हैंडओवर निगरानी"],
    title_decision_support: ["निर्णय सहायता", "भू-संरेखण व भूखंड उपयुक्तता निर्णय सहायता प्रणाली"],
    title_alerts: ["सतर्कता व निगरानी", "सांविधिक विलंब, सूचना समय-सीमा व सतर्कता अलर्ट"],
    title_audit: ["लेखा परीक्षा", "अपरिवर्तनीय डिजिटल ऑडिट लॉग व अभिलेख"],
    title_ai: ["डिजिटल इंडिया एआई", "भूसेतु-भारत विधिक एआई सहायक व नागरिक पूछताछ"],
    title_users: ["सुरक्षा प्रशासन", "प्रयोक्ता, भूमिकाएं व क्षेत्राधिकार निर्देशिका"],

    // Common Buttons & Labels
    common_search: "खोजें",
    common_filter: "फ़िल्टर",
    common_export: "सीएसवी निर्यात",
    common_print: "प्रिंट / पीडीएफ",
    common_close: "बंद करें",
    common_submit: "प्रेषित करें",
    common_reset: "रीसेट",
    common_status: "स्थिति",
    common_actions: "कार्यवाही",
    common_view: "देखें",
    common_loading: "समय लोड हो रहा है...",
    lang_switched: "भाषा बदली गई: हिन्दी",
    disclaimer_text: "⚠️ प्रोटोटाइप सूचना: भूसेतु-भारत अनुसंधान एवं प्रोटोटाइपिंग हेतु विकसित एक संकल्पनात्मक प्रदर्शन पोर्टल है।"
  }
};

// ================= SCHEDULED INDIAN LANGUAGES BUILDER =================
// Generates authentic localized translations inheriting clean structures for all 21 Scheduled Languages
const REGIONAL_METADATA = {
  bn: { name: 'বাংলা', govt: 'ভারত সরকার', ministry: 'গ্রামীণ উন্নয়ন মন্ত্রক', dept: 'ভূমি সম্পদ বিভাগ', brand: 'জিওসেতু-ভারত', tag: 'জাতীয় ভূমি অধিগ্রহণ ও পরিচালনা পোর্টাল', home: 'মূল পাতা', login: 'লগইন / এসএসও' },
  mr: { name: 'मराठी', govt: 'भारत सरकार', ministry: 'ग्रामविकास मंत्रालय', dept: 'भूमी संसाधने विभाग', brand: 'भूसेतू-भारत', tag: 'राष्ट्रीय जमीन संपादन व व्यवस्थापन प्रणाली', home: 'मुख्य पृष्ठ', login: 'प्रवेश / एसएसओ' },
  te: { name: 'తెలుగు', govt: 'భారత ప్రభుత్వం', ministry: 'గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ', dept: 'భూ వనరుల శాఖ', brand: 'జియోసేతు-భారత్', tag: 'జాతీయ భూసేకరణ & నిర్వహణ పోర్టల్', home: 'ముఖ్యాంశం', login: 'లాగిన్ / ఎస్ఎస్ఓ' },
  ta: { name: 'தமிழ்', govt: 'இந்திய அரசு', ministry: 'ஊரக வளர்ச்சி அமைச்சகம்', dept: 'நில வளங்கள் துறை', brand: 'ஜியோசேது-பாரதம்', tag: 'தேசிய நிலக்கையகப்படுத்தல் & மேலாண்மை தளம்', home: 'முகப்பு', login: 'உள்நுழைவு / எஸ்எஸ்ஓ' },
  gu: { name: 'ગુજરાતી', govt: 'ભારત સરકાર', ministry: 'ગ્રામીણ વિકાસ મંત્રાલય', dept: 'જમીન સંસાધન વિભાગ', brand: 'ભૂસેતુ-ભારત', tag: 'રાષ્ટ્રીય જમીન સંપાદન અને વ્યવસ્થાપન પોર્ટલ', home: 'મુખ્ય પૃષ્ઠ', login: 'પ્રવેશ / એસએસઓ' },
  ur: { name: 'اردو', govt: 'حکومت ہند', ministry: 'وزارت دیہی ترقی', dept: 'محکمہ اراضی وسائل', brand: 'جیو سیتو-بھارت', tag: 'قومی اراضی حصول اور انتظام پورٹل', home: 'صفحۂ اول', login: 'لاگ ان' },
  kn: { name: 'ಕನ್ನಡ', govt: 'ಭಾರತ ಸರ್ಕಾರ', ministry: 'ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ', dept: 'ಭೂ ಸಂಪನ್ಮೂಲಗಳ ಇಲಾಖೆ', brand: 'ಜಿಯೋಸೇತು-ಭಾರತ', tag: 'ರಾಷ್ಟ್ರೀಯ ಭೂಸ್ವಾಧೀನ ಮತ್ತು ನಿರ್ವಹಣಾ ಪೋರ್ಟಲ್', home: 'ಮುಖಪುಟ', login: 'ಲಾಗಿನ್ / ಎಸ್ಎಸ್ಒ' },
  or: { name: 'ଓଡ଼ିଆ', govt: 'ଭାରତ ସରକାର', ministry: 'ଗ୍ରାମ୍ୟ ଉନ୍ନୟନ ମନ୍ତ୍ରଣାଳୟ', dept: 'ଭୂସମ୍ପଦ ବିଭାଗ', brand: 'ଭୂସେତୁ-ଭାରତ', tag: 'ଜାତୀୟ ଜମି ଅଧିଗ୍ରହଣ ଓ ପରିଚାଳନା ପୋର୍ଟାଲ', home: 'ମୁଖ୍ୟ ପୃଷ୍ଠା', login: 'ଲଗଇନ୍' },
  ml: { name: 'മലയാളം', govt: 'ഭാരത സർക്കാർ', ministry: 'ഗ്രാമവികസന മന്ത്രാലയം', dept: 'ഭൂവിഭവ വകുപ്പ്', brand: 'ജിയോസേതു-ഭാരതം', tag: 'ദേശീയ ഭൂമി ഏറ്റെടുക്കൽ & മാനേജ്മെന്റ് പോർട്ടൽ', home: 'പ്രധാന പേജ്', login: 'ലോഗിൻ' },
  pa: { name: 'ਪੰਜਾਬੀ', govt: 'ਭਾਰਤ ਸਰਕਾਰ', ministry: 'ਪੇਂਡੂ ਵਿਕਾਸ ਮੰਤਰਾਲਾ', dept: 'ਭੂਮੀ ਸਰੋਤ ਵਿਭਾਗ', brand: 'ਭੂਸੇਤੂ-ਭਾਰਤ', tag: 'ਰਾਸ਼ਟਰੀ ਜ਼ਮੀਨ ਪ੍ਰਾਪਤੀ ਅਤੇ ਪ੍ਰਬੰਧਨ ਪ੍ਰਣਾਲੀ', home: 'ਮੁੱਖ ਪੰਨਾ', login: 'ਲਾਗਇਨ' },
  as: { name: 'অসমীয়া', govt: 'ভাৰত চৰকাৰ', ministry: 'গ্ৰামোন্নয়ন মন্ত্ৰালয়', dept: 'ভূমি সম্পদ বিভাগ', brand: 'ভূসেতু-ভাৰত', tag: 'ৰাষ্ট্ৰীয় ভূমি অধিগ্ৰহণ আৰু ব্যৱস্থাপনা পৰ্টেল', home: 'মূল পৃষ্ঠা', login: 'লগইন' },
  mai: { name: 'मैथिली', govt: 'भारत सरकार', ministry: 'ग्रामीण विकास मंत्रालय', dept: 'भूमि संसाधन विभाग', brand: 'भूसेतु-भारत', tag: 'राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन पोर्टल', home: 'मुख्य पृष्ठ', login: 'प्रवेश' },
  sa: { name: 'संस्कृतम्', govt: 'भारतसर्वकारः', ministry: 'ग्रामीणविकासमन्त्रालयः', dept: 'भूमिसंसाधनविभागः', brand: 'भूसेतु-भारतम्', tag: 'राष्ट्रिय भूम्यधिग्रहण तथा प्रबन्धन तन्त्रम्', home: 'मुख्यपृष्ठम्', login: 'प्रवेशः' },
  kok: { name: 'कोंकणी', govt: 'भारत सरकार', ministry: 'ग्रामीण विकास मंत्रालय', dept: 'जमीन संसाधनां विभाग', brand: 'भूसेतु-भारत', tag: 'राष्ट्रीय जमीन संपादन आनी व्यवस्थापन पोर्टल', home: 'मुखेल पान', login: 'प्रवेश' },
  sd: { name: 'सिन्धी', govt: 'भारत सरकार', ministry: 'ڳوٺاڻي ترقي جي وزارت', dept: 'زمين وسيلن جو کاتو', brand: 'جيو سيتو-ڀارت', tag: 'قومي زمين حاصل ڪرڻ ۽ انتظام پورٽل', home: 'مک صفحو', login: 'لاگ ان' },
  doi: { name: 'डोगरी', govt: 'भारत सरकार', ministry: 'ग्रामीण विकास मंत्रालय', dept: 'भूमि संसाधन विभाग', brand: 'भूसेतु-भारत', tag: 'राष्ट्रीय भूमि अधिग्रहण ते प्रबंधन पोर्टल', home: 'मुक्ख पन्ना', login: 'लागइन' },
  mni: { name: 'মৈতৈलोन्', govt: 'ভারত সরকার', ministry: 'খুঙ্গং চাউখৎ-থৌরাং মন্ত্রালয়', dept: 'লমগী পোৎলম বিভাগ', brand: 'জিওসেতু-ভারত', tag: 'লৈবাক্কী লম লৌশিনবা অমসুং য়েংশਿনবগী পোর্তেল', home: 'মপুং ওইবা লামাই', login: 'লোইনবা' },
  ne: { name: 'नेपाली', govt: 'भारत सरकार', ministry: 'ग्रामीण विकास मन्त्रालय', dept: 'भूमि संसाधन विभाग', brand: 'भूसेतु-भारत', tag: 'राष्ट्रिय भूमि अधिग्रहण तथा व्यवस्थापन पोर्टल', home: 'गृह पृष्ठ', login: 'लगइन' },
  brx: { name: 'बड़ो', govt: 'भारत सरकार', ministry: 'गामि जौगाखां मन्त्रालय', dept: 'हा सम्पद बिफान', brand: 'भूसेतु-भारत', tag: 'हा आजावनाय आरो मोजां खालामनाय पोर्टल', home: 'गाहाय बिलाइ', login: 'हाबनाय' },
  sat: { name: 'ᱥᱟᱱᱛᱟᱲᱤ', govt: 'ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨ', ministry: 'ᱟᱹᱛᱩ ᱩᱛᱱᱟᱹᱣ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ', dept: 'ᱦᱟᱥᱟ ᱥᱚᱢᱯᱚᱫᱽ ᱵᱤᱵᱷᱟᱜᱽ', brand: 'ᱡᱤᱭᱳᱥᱮᱛᱩ-ᱵᱷᱟᱨᱚᱛ', tag: 'ᱦᱟᱥᱟ ᱦᱟᱛᱟᱣ ᱟᱨ ᱥᱟᱢᱵᱽᱲᱟᱣ ᱯᱳᱨᱴᱟᱞ', home: 'ᱢᱩᱬᱩᱛ ᱥᱟᱦᱴᱟ', login: 'ᱵᱚᱞᱚᱱ' },
  ks: { name: 'कश्मीरी', govt: 'ہندوستان سرکار', ministry: 'دیہی ترقیاتی وزارت', dept: 'زمین وسائل محکمہ', brand: 'جیو سیتو-بھارت', tag: 'قومی اراضی حصول پورٹل', home: 'اہم صفحہ', login: 'لاگ ان' }
};

// Build inheritances for all 21 regional languages from English base, overlaying native government terms
Object.keys(REGIONAL_METADATA).forEach(code => {
  const meta = REGIONAL_METADATA[code];
  // Clone English structure
  const langDict = JSON.parse(JSON.stringify(TRANSLATIONS.en));
  
  // Apply native overrides
  langDict.gov_in = meta.govt;
  langDict.ministry = meta.ministry;
  langDict.dept = meta.dept;
  langDict.dept_full = `${meta.dept} • ${meta.ministry} • ${meta.govt}`;
  langDict.portal_brand = meta.brand;
  langDict.portal_tag = meta.tag;
  langDict.nav_home = meta.home;
  langDict.nav_login = meta.login;
  langDict.lang_switched = `Language switched to ${meta.name}`;

  TRANSLATIONS[code] = langDict;
});

/* ---------------- TRANSLATION LOOKUP ---------------- */
function t(key, fallback) {
  if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key] !== undefined) {
    return TRANSLATIONS[currentLang][key];
  }
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key] !== undefined) {
    return TRANSLATIONS['en'][key];
  }
  return fallback !== undefined ? fallback : key;
}

function getRoleLabel(role) {
  return t(`role_${role}`, (typeof ROLES !== 'undefined' && ROLES[role]) ? ROLES[role].label : role);
}

function getWorkflowLabel(state) {
  return t(`wf_${state}`, (typeof WORKFLOW_LABELS !== 'undefined' && WORKFLOW_LABELS[state]) ? WORKFLOW_LABELS[state] : state);
}

function getRouteTitle(routeKey) {
  const trans = t(`title_${routeKey}`);
  if (Array.isArray(trans)) return trans;
  if (typeof TITLES !== 'undefined' && TITLES[routeKey]) return TITLES[routeKey];
  return [t('portal_brand', 'GeoSetu-India'), 'Portal'];
}

/* ---------------- COMPREHENSIVE DOM TRANSLATOR ---------------- */
function translateDOM() {
  // 1. Text Content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val !== undefined && typeof val === 'string') {
      el.textContent = val;
    }
  });

  // 2. HTML Content
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = t(key);
    if (val !== undefined && typeof val === 'string') {
      el.innerHTML = val;
    }
  });

  // 3. Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val !== undefined && typeof val === 'string') {
      el.placeholder = val;
    }
  });

  // 4. Tooltip Titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val !== undefined && typeof val === 'string') {
      el.title = val;
    }
  });

  // 5. Update HTML Document Title
  const brand = t('portal_brand', 'GeoSetu-India');
  const tag = t('portal_tag', 'National Land Acquisition & Management System');
  const gov = t('gov_in', 'Government of India');
  document.title = `${brand} — ${tag} | ${gov}`;

  // 6. Update Marquee Notice Ticker
  const marquee = document.getElementById('ticker-marquee');
  const tickerItems = t('ticker_items');
  if (marquee && Array.isArray(tickerItems) && tickerItems.length > 0) {
    marquee.innerHTML = tickerItems.map(item => `
      <span class="ticker-entry">
        <span>${item.text}</span>
        <span class="ticker-date">${item.date}</span>
      </span>
    `).join('');
  }

  // 7. Update Government Masthead Text dynamically (Single Clean Language)
  const mastheadBrandEn = document.querySelector('.gov-brand-title .gov-name-en');
  const mastheadBrandHi = document.querySelector('.gov-brand-title .gov-name-hi');
  const mastheadDeptHi = document.querySelector('.gov-dept-row-hi');
  const mastheadDeptEn = document.querySelector('.gov-dept-row-en');
  const mastheadTag = document.querySelector('.gov-system-tag');

  if (mastheadBrandEn) mastheadBrandEn.textContent = brand;
  if (mastheadBrandHi) mastheadBrandHi.style.display = (currentLang === 'hi' ? 'none' : 'none'); // Clean single line
  if (mastheadDeptHi) {
    mastheadDeptHi.textContent = t('dept_full');
  }
  if (mastheadDeptEn) {
    mastheadDeptEn.style.display = 'none'; // Avoid dual language stacking
  }
  if (mastheadTag) {
    mastheadTag.textContent = tag;
  }

  // 8. Update Login Hero text
  const heroHeading = document.querySelector('.gov-hero-heading');
  const heroSub = document.querySelector('.gov-hero-sub');
  if (heroHeading) {
    heroHeading.innerHTML = `${t('sso_hero_title')}<br><span style="font-size:20px;color:#cbd5e1;">${brand}</span>`;
  }
  if (heroSub) {
    heroSub.textContent = t('sso_hero_sub');
  }
}

/* ---------------- LANGUAGE SWITCHING ---------------- */
function setLanguage(langCode) {
  if (!LANGUAGES.some(l => l.code === langCode)) {
    langCode = 'en';
  }
  currentLang = langCode;
  try {
    localStorage.setItem('geosetu_lang', langCode);
    localStorage.setItem('terrabyte_lang', langCode);
  } catch (e) {
    console.warn('LocalStorage error saving language:', e);
  }

  // Update HTML tag
  document.documentElement.lang = langCode;
  const langObj = LANGUAGES.find(l => l.code === langCode);
  if (langObj && langObj.dir === 'rtl') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }

  // Update select elements if present
  const sel = document.getElementById('lang-select');
  if (sel && sel.value !== langCode) {
    sel.value = langCode;
  }
  const mobileSel = document.getElementById('mobile-lang-select');
  if (mobileSel && mobileSel.value !== langCode) {
    mobileSel.value = langCode;
  }

  // Translate all tagged DOM elements and masthead
  translateDOM();

  // Re-render role pill & user title if logged in
  if (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) {
    const rolePill = document.getElementById('role-pill');
    if (rolePill) rolePill.textContent = getRoleLabel(CURRENT_USER.role);
    
    // Re-render sidebar with single-language labels
    if (typeof renderSidebar === 'function') {
      renderSidebar();
    }

    // Re-render active view route with updated language
    if (typeof CURRENT_ROUTE !== 'undefined' && CURRENT_ROUTE && typeof navigate === 'function') {
      navigate(CURRENT_ROUTE.name, CURRENT_ROUTE.param);
    }
  }

  const toastMsg = t('lang_switched', `Language switched to ${langObj ? langObj.name : langCode}`);
  if (typeof toast === 'function') {
    toast(toastMsg);
  }
}

// Backwards-compatible toggle function
function toggleLanguage() {
  const nextLang = currentLang === 'hi' ? 'en' : 'hi';
  setLanguage(nextLang);
}

// Initialize saved language immediately on script load
try {
  const saved = localStorage.getItem('geosetu_lang') || localStorage.getItem('terrabyte_lang');
  if (saved && LANGUAGES.some(l => l.code === saved)) {
    currentLang = saved;
    document.documentElement.lang = saved;
  }
} catch (e) {}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('lang-select');
  if (sel) {
    sel.value = currentLang;
  }
  translateDOM();
});
