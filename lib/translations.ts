// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: lib/translations.ts
// CrimeVision AI — English + Kannada Translation Strings
// Karnataka State Police — KSP Datathon 2026
// ─────────────────────────────────────────────────────────────────────────────

export type Language = 'en' | 'kn';

export interface TranslationSet {
  // ── Navigation ──────────────────────────────────────────────────────────────
  nav_dashboard: string;
  nav_case_search: string;
  nav_commissioner_view: string;
  nav_crime_genome: string;
  nav_ai_detective: string;
  nav_investigation_copilot: string;
  nav_karnataka_map: string;
  nav_criminal_network: string;
  nav_live_alerts: string;
  nav_anomaly_detection: string;
  nav_ai_insights: string;
  nav_crime_timeline: string;
  nav_social_risk: string;
  nav_risk_prediction: string;
  nav_ai_investigator: string;
  nav_resource_allocation: string;
  nav_reports: string;
  nav_login: string;
  nav_logout: string;

  // ── Nav Group Labels ─────────────────────────────────────────────────────────
  group_command: string;
  group_advanced_ai: string;
  group_intelligence: string;
  group_analysis: string;
  group_operations: string;

  // ── Dashboard Stats ─────────────────────────────────────────────────────────
  stat_total_crimes: string;
  stat_active_cases: string;
  stat_clearance_rate: string;
  stat_ai_alerts: string;
  stat_arrests_mtd: string;
  stat_charges_filed: string;
  stat_high_risk_districts: string;
  stat_solved_cases: string;
  stat_total_officers: string;
  stat_total_stations: string;
  stat_districts: string;
  stat_accuracy: string;

  // ── Page Titles ──────────────────────────────────────────────────────────────
  page_dashboard: string;
  page_investigator: string;
  page_reports: string;
  page_risk_prediction: string;
  page_login: string;
  page_alerts: string;
  page_anomaly: string;

  // ── Page Subtitles ────────────────────────────────────────────────────────────
  sub_dashboard: string;
  sub_investigator: string;
  sub_reports: string;
  sub_risk_prediction: string;
  sub_login: string;

  // ── Buttons ──────────────────────────────────────────────────────────────────
  btn_login: string;
  btn_logout: string;
  btn_send: string;
  btn_clear: string;
  btn_download_pdf: string;
  btn_download_all: string;
  btn_generate_prediction: string;
  btn_refresh: string;
  btn_export_chat: string;
  btn_voice_start: string;
  btn_voice_stop: string;
  btn_stop_response: string;
  btn_copy: string;
  btn_copied: string;
  btn_close: string;
  btn_generate: string;
  btn_export_report: string;
  btn_view_all: string;
  btn_download_report: string;

  // ── Status Words ─────────────────────────────────────────────────────────────
  status_investigating: string;
  status_arrested: string;
  status_resolved: string;
  status_monitoring: string;
  status_chargesheet: string;
  status_wanted: string;
  status_absconding: string;
  status_under_surveillance: string;
  status_released_on_bail: string;
  status_active: string;
  status_inactive: string;
  status_online: string;
  status_offline: string;

  // ── Priority / Severity ───────────────────────────────────────────────────────
  priority_critical: string;
  priority_high: string;
  priority_medium: string;
  priority_low: string;

  // ── Risk Labels ───────────────────────────────────────────────────────────────
  risk_critical: string;
  risk_high: string;
  risk_medium: string;
  risk_low: string;
  risk_score: string;
  risk_level: string;

  // ── Crime Types ────────────────────────────────────────────────────────────────
  crime_cybercrime: string;
  crime_theft: string;
  crime_narcotics: string;
  crime_assault: string;
  crime_sand_mining: string;
  crime_organized: string;
  crime_fraud: string;
  crime_other: string;

  // ── Investigator / Chat ───────────────────────────────────────────────────────
  chat_placeholder: string;
  chat_listening: string;
  chat_ai_name: string;
  chat_officer: string;
  chat_suggested: string;
  chat_recent_queries: string;
  chat_system_status: string;
  chat_voice_listening: string;

  // ── Reports ────────────────────────────────────────────────────────────────────
  report_district_intel: string;
  report_criminal_network: string;
  report_cybercrime: string;
  report_threat_assessment: string;
  report_header: string;
  report_restricted: string;
  report_generated: string;
  report_footer: string;

  // ── Predictions ─────────────────────────────────────────────────────────────
  pred_high_risk_districts: string;
  pred_crime_spikes: string;
  pred_recommendations: string;
  pred_threat_level: string;
  pred_confidence: string;
  pred_overall_analysis: string;
  pred_last_updated: string;
  pred_generating: string;
  pred_no_prediction: string;

  // ── Login ─────────────────────────────────────────────────────────────────────
  login_title: string;
  login_subtitle: string;
  login_username: string;
  login_password: string;
  login_error: string;
  login_demo_accounts: string;
  login_welcome: string;

  // ── Error Messages ────────────────────────────────────────────────────────────
  error_api_key_missing: string;
  error_api_key_instructions: string;
  error_no_results: string;
  error_generic: string;

  // ── Search ────────────────────────────────────────────────────────────────────
  search_placeholder: string;
  search_firs: string;
  search_suspects: string;
  search_districts: string;
  search_no_results: string;

  // ── Misc ─────────────────────────────────────────────────────────────────────
  live_feed: string;
  system_online: string;
  threat_level: string;
  state_threat: string;
  district: string;
  officer: string;
  station: string;
  date: string;
  time: string;
  trend_up: string;
  trend_down: string;
  trend_stable: string;
  top_crime: string;
  suspect: string;
  victim: string;
  fir_number: string;
  description: string;
}

export const translations: Record<Language, TranslationSet> = {
  // ════════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ════════════════════════════════════════════════════════════════════════════
  en: {
    nav_dashboard: 'Dashboard',
    nav_case_search: 'Case Search',
    nav_commissioner_view: 'Commissioner View',
    nav_crime_genome: 'Crime Pattern Genome',
    nav_ai_detective: 'AI Detective Engine',
    nav_investigation_copilot: 'Investigation Copilot',
    nav_karnataka_map: 'Karnataka Map',
    nav_criminal_network: 'Criminal Network',
    nav_live_alerts: 'Live Alerts',
    nav_anomaly_detection: 'Anomaly Detection',
    nav_ai_insights: 'AI Insights',
    nav_crime_timeline: 'Crime Timeline',
    nav_social_risk: 'Social Risk Factors',
    nav_risk_prediction: 'Risk Prediction',
    nav_ai_investigator: 'AI Investigator',
    nav_resource_allocation: 'Resource Allocation',
    nav_reports: 'Reports',
    nav_login: 'Login',
    nav_logout: 'Logout',

    group_command: 'COMMAND',
    group_advanced_ai: '⚡ ADVANCED AI',
    group_intelligence: 'INTELLIGENCE',
    group_analysis: 'ANALYSIS',
    group_operations: 'OPERATIONS',

    stat_total_crimes: 'Total Crimes Recorded',
    stat_active_cases: 'Active Investigations',
    stat_clearance_rate: 'Clearance Rate',
    stat_ai_alerts: 'AI Alerts Today',
    stat_arrests_mtd: 'Arrests MTD',
    stat_charges_filed: 'Charges Filed',
    stat_high_risk_districts: 'High Risk Districts',
    stat_solved_cases: 'Solved Cases',
    stat_total_officers: 'Total Officers',
    stat_total_stations: 'Police Stations',
    stat_districts: 'Districts',
    stat_accuracy: 'AI Accuracy',

    page_dashboard: 'COMMAND DASHBOARD',
    page_investigator: 'AI Investigation Assistant',
    page_reports: 'Intelligence Reports',
    page_risk_prediction: 'AI Risk Prediction',
    page_login: 'KARNATAKA STATE POLICE — SECURE SYSTEM',
    page_alerts: 'Live Intelligence Alerts',
    page_anomaly: 'Anomaly Detection',

    sub_dashboard: 'Karnataka State Police — Real-Time Intelligence Overview',
    sub_investigator: 'CrimeNet AI — Powered by Claude Intelligence Engine',
    sub_reports: 'Generate and download classified intelligence reports',
    sub_risk_prediction: 'AI-generated crime risk predictions for next 30 days',
    sub_login: 'Authorized Personnel Only — Biometric Verified Access',

    btn_login: 'Secure Login',
    btn_logout: 'Logout',
    btn_send: 'Send',
    btn_clear: 'Clear',
    btn_download_pdf: 'Download PDF',
    btn_download_all: 'Download All Reports',
    btn_generate_prediction: 'Generate AI Risk Prediction',
    btn_refresh: 'Refresh',
    btn_export_chat: 'Export Chat',
    btn_voice_start: 'Start Voice Input',
    btn_voice_stop: 'Stop Recording',
    btn_stop_response: 'Stop Response',
    btn_copy: 'Copy',
    btn_copied: 'Copied!',
    btn_close: 'Close',
    btn_generate: 'Generate',
    btn_export_report: 'Export Report',
    btn_view_all: 'View All',
    btn_download_report: 'Download Report',

    status_investigating: 'Investigating',
    status_arrested: 'Arrested',
    status_resolved: 'Resolved',
    status_monitoring: 'Monitoring',
    status_chargesheet: 'Chargesheet Filed',
    status_wanted: 'Wanted',
    status_absconding: 'Absconding',
    status_under_surveillance: 'Under Surveillance',
    status_released_on_bail: 'Released on Bail',
    status_active: 'Active',
    status_inactive: 'Inactive',
    status_online: 'ONLINE',
    status_offline: 'OFFLINE',

    priority_critical: 'Critical',
    priority_high: 'High',
    priority_medium: 'Medium',
    priority_low: 'Low',

    risk_critical: 'Critical',
    risk_high: 'High',
    risk_medium: 'Medium',
    risk_low: 'Low',
    risk_score: 'Risk Score',
    risk_level: 'Risk Level',

    crime_cybercrime: 'Cybercrime',
    crime_theft: 'Theft',
    crime_narcotics: 'Narcotics',
    crime_assault: 'Assault',
    crime_sand_mining: 'Sand Mining',
    crime_organized: 'Organized Crime',
    crime_fraud: 'Financial Fraud',
    crime_other: 'Other Offenses',

    chat_placeholder: 'Ask about crimes, suspects, districts, FIRs...',
    chat_listening: '🎙 Listening... speak now',
    chat_ai_name: 'CrimeNet AI',
    chat_officer: 'Officer',
    chat_suggested: 'Suggested Queries',
    chat_recent_queries: 'Recent Queries',
    chat_system_status: 'System Status',
    chat_voice_listening: 'Listening in English (India)...',

    report_district_intel: 'District Intelligence Report',
    report_criminal_network: 'Criminal Network Analysis',
    report_cybercrime: 'Cybercrime Analysis Report',
    report_threat_assessment: 'Threat Assessment Report',
    report_header: 'KARNATAKA STATE POLICE',
    report_restricted: 'RESTRICTED — FOR OFFICIAL USE ONLY',
    report_generated: 'Report Generated',
    report_footer: 'CrimeVision AI v5.0 | KSP Datathon 2026 | Karnataka State Police',

    pred_high_risk_districts: 'High Risk Districts',
    pred_crime_spikes: 'Predicted Crime Spikes',
    pred_recommendations: 'Recommendations',
    pred_threat_level: 'Overall Threat Level',
    pred_confidence: 'Confidence',
    pred_overall_analysis: 'AI Analysis Summary',
    pred_last_updated: 'Last updated',
    pred_generating: 'Generating AI prediction...',
    pred_no_prediction: 'Click "Generate AI Risk Prediction" to get real-time AI analysis for the next 30 days.',

    login_title: 'KARNATAKA STATE POLICE',
    login_subtitle: 'SECURE INTELLIGENCE COMMAND SYSTEM',
    login_username: 'Username / Badge Number',
    login_password: 'Password',
    login_error: 'Invalid credentials. Please try again.',
    login_demo_accounts: 'Demo Accounts',
    login_welcome: 'Welcome back,',

    error_api_key_missing: 'Anthropic API Key Not Configured',
    error_api_key_instructions: 'Add NEXT_PUBLIC_ANTHROPIC_API_KEY to your .env.local file to enable AI chat.',
    error_no_results: 'No results found',
    error_generic: 'An error occurred. Please try again.',

    search_placeholder: 'Search FIRs, suspects, districts... (Press / to focus)',
    search_firs: 'FIR Cases',
    search_suspects: 'Suspects',
    search_districts: 'Districts',
    search_no_results: 'No matches found',

    live_feed: 'LIVE FEED ACTIVE',
    system_online: 'SYSTEM ONLINE',
    threat_level: 'Threat Level',
    state_threat: 'STATE THREAT LEVEL',
    district: 'District',
    officer: 'Officer',
    station: 'Station',
    date: 'Date',
    time: 'Time',
    trend_up: '↑ Increasing',
    trend_down: '↓ Decreasing',
    trend_stable: '→ Stable',
    top_crime: 'Top Crime',
    suspect: 'Suspect',
    victim: 'Victim',
    fir_number: 'FIR Number',
    description: 'Description',
  },

  // ════════════════════════════════════════════════════════════════════════════
  // KANNADA (ಕನ್ನಡ)
  // ════════════════════════════════════════════════════════════════════════════
  kn: {
    nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    nav_case_search: 'ಕೇಸ್ ಹುಡುಕಾಟ',
    nav_commissioner_view: 'ಕಮಿಷನರ್ ವೀಕ್ಷಣೆ',
    nav_crime_genome: 'ಅಪರಾಧ ಮಾದರಿ ಜಿನೋಮ್',
    nav_ai_detective: 'AI ತನಿಖಾ ಇಂಜಿನ್',
    nav_investigation_copilot: 'ತನಿಖಾ ಕೋಪೈಲಟ್',
    nav_karnataka_map: 'ಕರ್ನಾಟಕ ನಕ್ಷೆ',
    nav_criminal_network: 'ಅಪರಾಧಿ ಜಾಲ',
    nav_live_alerts: 'ನೇರ ಎಚ್ಚರಿಕೆಗಳು',
    nav_anomaly_detection: 'ಅಸಂಗತ ಪತ್ತೆ',
    nav_ai_insights: 'AI ಒಳನೋಟಗಳು',
    nav_crime_timeline: 'ಅಪರಾಧ ಕಾಲರೇಖೆ',
    nav_social_risk: 'ಸಾಮಾಜಿಕ ಅಪಾಯ',
    nav_risk_prediction: 'ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    nav_ai_investigator: 'AI ತನಿಖಾಧಿಕಾರಿ',
    nav_resource_allocation: 'ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ',
    nav_reports: 'ವರದಿಗಳು',
    nav_login: 'ಲಾಗಿನ್',
    nav_logout: 'ಲಾಗ್‌ಔಟ್',

    group_command: 'ಕಮಾಂಡ್',
    group_advanced_ai: '⚡ ಸುಧಾರಿತ AI',
    group_intelligence: 'ಗುಪ್ತಚರ',
    group_analysis: 'ವಿಶ್ಲೇಷಣೆ',
    group_operations: 'ಕಾರ್ಯಾಚರಣೆ',

    stat_total_crimes: 'ಒಟ್ಟು ದಾಖಲಾದ ಅಪರಾಧಗಳು',
    stat_active_cases: 'ಸಕ್ರಿಯ ತನಿಖೆಗಳು',
    stat_clearance_rate: 'ನಿರ್ಮೂಲನ ಪ್ರಮಾಣ',
    stat_ai_alerts: 'ಇಂದಿನ AI ಎಚ್ಚರಿಕೆಗಳು',
    stat_arrests_mtd: 'ಈ ತಿಂಗಳ ಬಂಧನಗಳು',
    stat_charges_filed: 'ದಾಖಲಾದ ಆರೋಪಗಳು',
    stat_high_risk_districts: 'ಅಧಿಕ ಅಪಾಯ ಜಿಲ್ಲೆಗಳು',
    stat_solved_cases: 'ಪರಿಹರಿಸಿದ ಪ್ರಕರಣಗಳು',
    stat_total_officers: 'ಒಟ್ಟು ಅಧಿಕಾರಿಗಳು',
    stat_total_stations: 'ಪೊಲೀಸ್ ಠಾಣೆಗಳು',
    stat_districts: 'ಜಿಲ್ಲೆಗಳು',
    stat_accuracy: 'AI ನಿಖರತೆ',

    page_dashboard: 'ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    page_investigator: 'AI ತನಿಖಾ ಸಹಾಯಕ',
    page_reports: 'ಗುಪ್ತಚರ ವರದಿಗಳು',
    page_risk_prediction: 'AI ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    page_login: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ — ಸುರಕ್ಷಿತ ವ್ಯವಸ್ಥೆ',
    page_alerts: 'ನೇರ ಗುಪ್ತಚರ ಎಚ್ಚರಿಕೆಗಳು',
    page_anomaly: 'ಅಸಂಗತ ಪತ್ತೆ',

    sub_dashboard: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ — ನೈಜ-ಸಮಯ ಗುಪ್ತಚರ ಅವಲೋಕನ',
    sub_investigator: 'CrimeNet AI — Claude ಗುಪ್ತಚರ ಇಂಜಿನ್‌ನಿಂದ ಚಾಲಿತ',
    sub_reports: 'ವರ್ಗೀಕೃತ ಗುಪ್ತಚರ ವರದಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    sub_risk_prediction: 'ಮುಂದಿನ 30 ದಿನಗಳ AI ಅಪರಾಧ ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    sub_login: 'ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿ ಮಾತ್ರ — ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲಿಸಿದ ಪ್ರವೇಶ',

    btn_login: 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್',
    btn_logout: 'ಲಾಗ್‌ಔಟ್',
    btn_send: 'ಕಳುಹಿಸಿ',
    btn_clear: 'ತೆರವುಗೊಳಿಸಿ',
    btn_download_pdf: 'PDF ಡೌನ್‌ಲೋಡ್',
    btn_download_all: 'ಎಲ್ಲಾ ವರದಿ ಡೌನ್‌ಲೋಡ್',
    btn_generate_prediction: 'AI ಅಪಾಯ ಮುನ್ಸೂಚನೆ ರಚಿಸಿ',
    btn_refresh: 'ರಿಫ್ರೆಶ್',
    btn_export_chat: 'ಚಾಟ್ ರಫ್ತು',
    btn_voice_start: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ',
    btn_voice_stop: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ',
    btn_stop_response: 'ಪ್ರತಿಕ್ರಿಯೆ ನಿಲ್ಲಿಸಿ',
    btn_copy: 'ನಕಲಿಸಿ',
    btn_copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
    btn_close: 'ಮುಚ್ಚಿ',
    btn_generate: 'ರಚಿಸಿ',
    btn_export_report: 'ವರದಿ ರಫ್ತು',
    btn_view_all: 'ಎಲ್ಲಾ ವೀಕ್ಷಿಸಿ',
    btn_download_report: 'ವರದಿ ಡೌನ್‌ಲೋಡ್',

    status_investigating: 'ತನಿಖೆ ನಡೆಯುತ್ತಿದೆ',
    status_arrested: 'ಬಂಧಿಸಲಾಗಿದೆ',
    status_resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    status_monitoring: 'ಮೇಲ್ವಿಚಾರಣೆ',
    status_chargesheet: 'ಆರೋಪ ಪಟ್ಟಿ ದಾಖಲು',
    status_wanted: 'ಬೇಕಾಗಿದ್ದಾರೆ',
    status_absconding: 'ತಲೆಮರೆಸಿಕೊಂಡಿದ್ದಾರೆ',
    status_under_surveillance: 'ನಿಗಾ ಅಡಿಯಲ್ಲಿ',
    status_released_on_bail: 'ಜಾಮೀನಿನ ಮೇಲೆ ಬಿಡುಗಡೆ',
    status_active: 'ಸಕ್ರಿಯ',
    status_inactive: 'ನಿಷ್ಕ್ರಿಯ',
    status_online: 'ಆನ್‌ಲೈನ್',
    status_offline: 'ಆಫ್‌ಲೈನ್',

    priority_critical: 'ಅತಿ ಗಂಭೀರ',
    priority_high: 'ಹೆಚ್ಚು',
    priority_medium: 'ಮಧ್ಯಮ',
    priority_low: 'ಕಡಿಮೆ',

    risk_critical: 'ಅತಿ ಅಪಾಯ',
    risk_high: 'ಹೆಚ್ಚು ಅಪಾಯ',
    risk_medium: 'ಮಧ್ಯಮ ಅಪಾಯ',
    risk_low: 'ಕಡಿಮೆ ಅಪಾಯ',
    risk_score: 'ಅಪಾಯ ಸ್ಕೋರ್',
    risk_level: 'ಅಪಾಯ ಮಟ್ಟ',

    crime_cybercrime: 'ಸೈಬರ್ ಅಪರಾಧ',
    crime_theft: 'ಕಳ್ಳತನ',
    crime_narcotics: 'ಮಾದಕ ವಸ್ತು',
    crime_assault: 'ಹಲ್ಲೆ',
    crime_sand_mining: 'ಮರಳು ಗಣಿಗಾರಿಕೆ',
    crime_organized: 'ಸಂಘಟಿತ ಅಪರಾಧ',
    crime_fraud: 'ಆರ್ಥಿಕ ವಂಚನೆ',
    crime_other: 'ಇತರ ಅಪರಾಧಗಳು',

    chat_placeholder: 'ಅಪರಾಧ, ಅನುಮಾನಿತರು, ಜಿಲ್ಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    chat_listening: '🎙 ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
    chat_ai_name: 'CrimeNet AI',
    chat_officer: 'ಅಧಿಕಾರಿ',
    chat_suggested: 'ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು',
    chat_recent_queries: 'ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು',
    chat_system_status: 'ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ',
    chat_voice_listening: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',

    report_district_intel: 'ಜಿಲ್ಲಾ ಗುಪ್ತಚರ ವರದಿ',
    report_criminal_network: 'ಅಪರಾಧಿ ಜಾಲ ವಿಶ್ಲೇಷಣೆ',
    report_cybercrime: 'ಸೈಬರ್ ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ ವರದಿ',
    report_threat_assessment: 'ಬೆದರಿಕೆ ಮೌಲ್ಯಮಾಪನ ವರದಿ',
    report_header: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್',
    report_restricted: 'ನಿರ್ಬಂಧಿತ — ಅಧಿಕೃತ ಬಳಕೆಗೆ ಮಾತ್ರ',
    report_generated: 'ವರದಿ ರಚಿಸಲಾಗಿದೆ',
    report_footer: 'CrimeVision AI v5.0 | KSP Datathon 2026 | ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್',

    pred_high_risk_districts: 'ಹೆಚ್ಚು ಅಪಾಯದ ಜಿಲ್ಲೆಗಳು',
    pred_crime_spikes: 'ಊಹಿಸಿದ ಅಪರಾಧ ಏರಿಕೆ',
    pred_recommendations: 'ಶಿಫಾರಸುಗಳು',
    pred_threat_level: 'ಒಟ್ಟು ಬೆದರಿಕೆ ಮಟ್ಟ',
    pred_confidence: 'ವಿಶ್ವಾಸ ಮಟ್ಟ',
    pred_overall_analysis: 'AI ವಿಶ್ಲೇಷಣೆ ಸಾರಾಂಶ',
    pred_last_updated: 'ಕೊನೆಯ ನವೀಕರಣ',
    pred_generating: 'AI ಮುನ್ಸೂಚನೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
    pred_no_prediction: '"AI ಅಪಾಯ ಮುನ್ಸೂಚನೆ ರಚಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ ನೈಜ-ಸಮಯ AI ವಿಶ್ಲೇಷಣೆ ಪಡೆಯಿರಿ.',

    login_title: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್',
    login_subtitle: 'ಸುರಕ್ಷಿತ ಗುಪ್ತಚರ ಕಮಾಂಡ್ ವ್ಯವಸ್ಥೆ',
    login_username: 'ಬಳಕೆದಾರ ಹೆಸರು / ಬ್ಯಾಡ್ಜ್ ಸಂಖ್ಯೆ',
    login_password: 'ಪಾಸ್‌ವರ್ಡ್',
    login_error: 'ತಪ್ಪಾದ ವಿವರಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    login_demo_accounts: 'ಡೆಮೊ ಖಾತೆಗಳು',
    login_welcome: 'ಸ್ವಾಗತ,',

    error_api_key_missing: 'Anthropic API ಕೀ ಕಾನ್ಫಿಗರ್ ಮಾಡಿಲ್ಲ',
    error_api_key_instructions: 'AI ಚಾಟ್ ಸಕ್ರಿಯಗೊಳಿಸಲು .env.local ಫೈಲ್‌ಗೆ NEXT_PUBLIC_ANTHROPIC_API_KEY ಸೇರಿಸಿ.',
    error_no_results: 'ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    error_generic: 'ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

    search_placeholder: 'FIR, ಅನುಮಾನಿತರು, ಜಿಲ್ಲೆ ಹುಡುಕಿ... (/ ಒತ್ತಿ ಗಮನ ಕೇಂದ್ರೀಕರಿಸಿ)',
    search_firs: 'FIR ಪ್ರಕರಣಗಳು',
    search_suspects: 'ಅನುಮಾನಿತರು',
    search_districts: 'ಜಿಲ್ಲೆಗಳು',
    search_no_results: 'ಹೊಂದಾಣಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',

    live_feed: 'ನೇರ ಫೀಡ್ ಸಕ್ರಿಯ',
    system_online: 'ಸಿಸ್ಟಮ್ ಆನ್‌ಲೈನ್',
    threat_level: 'ಬೆದರಿಕೆ ಮಟ್ಟ',
    state_threat: 'ರಾಜ್ಯ ಬೆದರಿಕೆ ಮಟ್ಟ',
    district: 'ಜಿಲ್ಲೆ',
    officer: 'ಅಧಿಕಾರಿ',
    station: 'ಠಾಣೆ',
    date: 'ದಿನಾಂಕ',
    time: 'ಸಮಯ',
    trend_up: '↑ ಏರಿಕೆ',
    trend_down: '↓ ಇಳಿಕೆ',
    trend_stable: '→ ಸ್ಥಿರ',
    top_crime: 'ಮುಖ್ಯ ಅಪರಾಧ',
    suspect: 'ಅನುಮಾನಿತ',
    victim: 'ಸಂತ್ರಸ್ತ',
    fir_number: 'FIR ಸಂಖ್ಯೆ',
    description: 'ವಿವರಣೆ',
  },
};

// ─── Helper hook (use in client components) ───────────────────────────────────
// Import and use like: const t = useTranslation();
// This is a plain function; pair with LanguageContext for full functionality.

export function getTranslation(lang: Language): TranslationSet {
  return translations[lang];
}
