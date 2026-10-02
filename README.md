# PARIDRISHYA — Environmental Decision-Support & Industrial Risk Intelligence Platform

> **Gov-Grade Environmental Intelligence Grid** linking industrial throughput, continuous emission monitoring systems (CEMS/CAAQMS), regional ecological vulnerability, forward-looking mitigation scenarios, and machine-to-machine x402 micropayments.

---

## 📌 Executive Summary & Submission Overview

**PARIDRISHYA** (Platform for Regional Assessment, Data, Industrial & Environmental Risk, Impact, and Sustainability Analysis) is a production-ready, full-stack environmental decision-support system designed for statutory regulatory bodies (CPCB/SPCBs), industrial facility operators, environmental scientists, and public policy researchers.

It overcomes the systemic challenge of fragmented environmental governance by harmonizing continuous stack emissions, ambient air quality monitoring (AQI), river basin stress, demographic exposure, and satellite observation data into a unified, explainable GIS intelligence grid.

---

## 🌟 Key Features & Capabilities

### 1. 🗺️ National Spatial GIS Risk & Industrial Corridor Map
- High-fidelity calibrated vector GIS mapping of India with all 28 states, union territories, island archipelagos (Andaman & Nicobar, Lakshadweep), and industrial corridors.
- Interactive multi-layer telemetry:
  - **Facilities Layer**: Pinpoint locations of monitored industrial complexes with color-coded risk severity.
  - **Ambient Air Basins (AQI)**: Heatmap dispersion envelopes calibrated to National Ambient Air Quality Standards (NAAQS).
  - **Watershed Stress Zones**: River basin depletion aquifers (Noyyal, Brahmani, Hasdeo, Narmada, Tungabhadra, etc.).
  - **Ecosystem Vulnerability Hotspots**: Critical corridors with high sensitive receptor density.
- Smooth pan, multi-level zoom (0.75x–2.5x), reset controls, and instant dot-inspection modal with full parameter telemetry.

### 2. 🏭 Comprehensive Industrial Registry (18 Facilities)
- Deep telemetry across 9 critical heavy industry sectors: Steel, Thermal Power, Chemical, Cement, Petroleum Refinery, Textile, Aluminium, Mining, and Automotive.
- Multi-vector tracking:
  - Continuous emissions: CO₂ (Scope 1 combustion), SO₂, NO₂, PM2.5 mass flow.
  - Energy load (GWh), captive thermal vs. renewable hybrid share (%).
  - Water withdrawal (Million Litres), recycling rate (%), and Zero Liquid Discharge (ZLD) status.
  - Statutory compliance history, consent to operate validity, and inspection reports.

### 3. 🎯 Explainable 6-Factor Environmental Impact Composite Scoring
- Transparent deterministic analytical model (0–100 score) preventing black-box opacity:
  1. **Stack Emissions Mass (25%)**: CEMS chimney flue mass flow vs. sector standard.
  2. **Air Quality Basin Impact (20%)**: Ambient PM2.5/PM10 concentration in receptor perimeter.
  3. **Water Stress Index (20%)**: Annual water withdrawal vs. regional aquifer recharge rate.
  4. **Energy Carbon Intensity (15%)**: Specific energy consumption per unit of production.
  5. **Environmental Stress & Circularity (10%)**: Hazardous waste diversion & circular reuse.
  6. **Climate Vulnerability Risk (10%)**: Extreme weather exposure & regulatory transition stress.

### 4. 🎛️ What-If Policy & Decarbonization Simulator
- Interactive parameter sliders for pre-capital-expenditure modeling:
  - Clean renewable energy substitution (%)
  - Fossil fuel captive generation reduction (%)
  - Industrial production throttling / expansion (%)
  - Water consumption reduction & ZLD deployment (%)
  - Flue Gas Desulfurization (FGD) emission scrubbing efficiency (%)
  - Industrial waste recycling & circular economy conversion (%)
- Live dynamic recalculation of composite score, avoided metric tons of CO₂ and SO₂, and payback period.

### 5. 📈 Damped Polynomial Multi-Year Forecasting (2021–2030)
- Historical trajectory analysis (2021–2026) coupled with predictive multi-scenario horizons (1-Year, 3-Year, 5-Year, 2030 Net-Zero trajectory).
- Early statutory warnings for facilities projected to cross critical risk thresholds (>80).

### 6. 🏛️ Dual Role-Based Stakeholder Portals
- **Government / Regulatory Portal (CPCB / SPCB)**:
  - District intervention triggers, statutory show-cause issuance, priority audit scheduling, and regional risk rankings.
- **Industry Operator Portal**:
  - Self-audit compliance dashboards, ESG benchmarking against national sector averages, and CAPEX mitigation roadmaps.

### 7. ⚡ Machine-to-Machine x402 Micropayment API
- Decentralized, pay-per-use environmental data monetization powered by the **x402 Protocol on Algorand Testnet (AVM)**.
- Algorand Testnet USDC ASA micropayments for programmatic API queries:
  - Environmental Impact Dossier (0.01 USDC)
  - 2030 Forecast Simulation (0.02 USDC)
  - Full Audit Package (0.05 USDC)
- Built-in interactive API console for instantaneous cURL requests, token quotation, and cryptographic receipt verification.

### 8. 📄 Statutory Environmental Audit & Reporting
- Comprehensive printable audit reports with official formatting.
- Export options for formal regulatory submission and CSV bulk telemetry data download.

---

## 🛠️ Technology Stack & Architecture

| Tier | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS 4, Lucide Icons, Institutional Design System |
| **Data Visualization & GIS** | Calibrated SVG Spatial GIS Engine, Recharts, Custom Analytics Components |
| **Backend & API** | Node.js, Express, tsx, RESTful endpoints |
| **Web3 / Micropayments** | `@x402/core`, `@x402/avm`, `algosdk` (Algorand Testnet AVM) |
| **Database Architecture** | 20 Normalized PostgreSQL / Supabase Tables with Row-Level Security (RLS) |
| **AI Synthesis** | Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash server-side pipeline |

---

## 📂 Project Directory Structure

```
├── server.ts                    # Full-stack Express server with REST APIs & static delivery
├── server/
│   └── x402/                   # Algorand x402 payment facilitator & route handlers
├── src/
│   ├── App.tsx                 # Root component with URL hash routing & mobile drawer
│   ├── main.tsx                # Client entry point
│   ├── index.css               # Global Tailwind CSS styling
│   ├── components/             # Reusable UI & analytical components
│   │   ├── Navbar.tsx          # Top header with mobile hamburger & navigation tabs
│   │   ├── Sidebar.tsx         # Responsive collapsible sidebar & slide-over drawer
│   │   ├── RegionalMap.tsx     # National spatial GIS vector map engine
│   │   ├── ImpactScoreCard.tsx # 6-factor score breakdown
│   │   ├── CauseImpactFlow.tsx # Causal chain explainability pipeline
│   │   ├── WhatIfSimulator.tsx # Policy scenario simulation engine
│   │   ├── ForecastChart.tsx   # Polynomial trajectory forecast visualizer
│   │   ├── ReportModal.tsx     # Statutory audit report generator
│   │   ├── ApiConsoleModal.tsx # Interactive x402 API test console
│   │   └── common/             # Design system buttons, badges, cards, metrics
│   ├── pages/                  # 14 distinct module views & stakeholder portals
│   │   ├── DashboardPage.tsx
│   │   ├── IndustrialIntelligencePage.tsx
│   │   ├── FacilityDetailPage.tsx
│   │   ├── RegionalRiskPage.tsx
│   │   ├── EnvironmentalImpactPage.tsx
│   │   ├── PollutionAnalysisPage.tsx
│   │   ├── PredictionPage.tsx
│   │   ├── WhatIfPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── GovernmentPortalPage.tsx
│   │   ├── IndustryPortalPage.tsx
│   │   ├── IntelligenceApiPage.tsx
│   │   ├── DataSourcesPage.tsx
│   │   ├── MethodologyPage.tsx
│   │   ├── SupabaseStatusPage.tsx
│   │   └── AboutPage.tsx
│   ├── data/
│   │   └── mockData.ts         # Deterministic baseline dataset (18 facilities, 8 regions)
│   ├── types/
│   │   └── index.ts            # Complete TypeScript domain interfaces & types
│   └── utils/
│       ├── calculations.ts     # Impact math, polynomial forecasts & scenario solvers
│       └── supabaseSchema.ts   # 20-table PostgreSQL DDL schema definition
├── dist/                       # Production build output
├── package.json                # Project dependencies and npm scripts
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/paridrishya.git
   cd paridrishya
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   # Add GEMINI_API_KEY=your_key_here if you wish to enable live Gemini AI synthesis
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Live Submission URLs

- **Development URL**: `https://ais-dev-j2bssk2vzytwmnoqvaxumh-707171921892.asia-east1.run.app`
- **Public Production / Shared URL**: `https://ais-pre-j2bssk2vzytwmnoqvaxumh-707171921892.asia-east1.run.app`

---

## 📜 Statutory Disclaimers & Ethics
- Emissions figures, regional water stress indices, and impact indices are modelled indicators based on synthetic statutory baselines calibrated to CPCB/SPCB frameworks.
- The platform does not make legally binding non-compliance assertions without physical site audits and third-party laboratory verification.

---

## 👤 Author & Contributor
- **Author**: Divyesh Gupta
- **Email**: divyeshgupta25@gmail.com
- **Project**: PARIDRISHYA Environmental Intelligence Platform
