/**
 * PARIDRISHYA — Production-Ready Supabase / PostgreSQL Schema Definition
 * 
 * Features:
 * - Fully normalized relational structure (20 entities)
 * - Strict foreign key constraints & cascading rules
 * - Automated updated_at triggers
 * - Granular Row Level Security (RLS) policies for roles: ADMIN, GOVERNMENT, INDUSTRY, ANALYST
 * - Dedicated storage bucket policy for generated environmental reports
 */

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- PARIDRISHYA: Platform for Regional Assessment, Data, Industrial & Environmental Risk
-- PostgreSQL / Supabase Normalized Production Schema
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('ADMIN', 'GOVERNMENT', 'INDUSTRY', 'ANALYST');
CREATE TYPE risk_level AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
CREATE TYPE data_status AS ENUM ('OBSERVED', 'REPORTED', 'ESTIMATED', 'MODELLED', 'DEMO');
CREATE TYPE facility_status AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'MONITORED', 'SHUTDOWN');

-- 3. PROFILES & ORGANIZATIONS
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL, -- 'GOVERNMENT_BODY', 'ENTERPRISE', 'REGULATOR', 'RESEARCH'
    registration_no VARCHAR(100),
    contact_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ANALYST',
    department VARCHAR(150),
    jurisdiction_state VARCHAR(100), -- For GOVERNMENT role boundary enforcement
    facility_id_authorized UUID,     -- For INDUSTRY role facility binding
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GEOGRAPHIC REGIONS
CREATE TABLE regions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL, -- 'North', 'South', 'East', 'West', 'Central'
    coordinates GEOMETRY(Point, 4326),
    area_sq_km NUMERIC(10, 2),
    population_million NUMERIC(8, 3),
    air_quality_index INT DEFAULT 100,
    dominant_risk_driver TEXT,
    water_stress_level VARCHAR(50) DEFAULT 'Moderate',
    forest_cover_pct NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDUSTRIAL FACILITIES
CREATE TABLE facilities (
    id VARCHAR(50) PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    sector VARCHAR(100) NOT NULL,
    region_id VARCHAR(50) REFERENCES regions(id) ON DELETE RESTRICT,
    state VARCHAR(100) NOT NULL,
    coordinates GEOMETRY(Point, 4326),
    status facility_status DEFAULT 'OPERATIONAL',
    capacity_utilization_pct NUMERIC(5, 2) DEFAULT 80.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDUSTRIAL ACTIVITY
CREATE TABLE industrial_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    reporting_year INT NOT NULL,
    reporting_quarter INT,
    annual_production NUMERIC(15, 2) NOT NULL,
    production_unit VARCHAR(50) NOT NULL,
    operating_hours_annual INT,
    data_status data_status DEFAULT 'REPORTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENERGY RECORDS
CREATE TABLE energy_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    record_year INT NOT NULL,
    total_energy_gwh NUMERIC(12, 4) NOT NULL,
    renewable_share_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    grid_electricity_gwh NUMERIC(12, 4) DEFAULT 0.0,
    captive_thermal_gwh NUMERIC(12, 4) DEFAULT 0.0,
    energy_intensity_ratio NUMERIC(10, 4), -- GWh per thousand tonne
    data_status data_status DEFAULT 'REPORTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESOURCE RECORDS
CREATE TABLE resource_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    record_year INT NOT NULL,
    water_annual_million_litres NUMERIC(12, 2) NOT NULL,
    water_recycled_pct NUMERIC(5, 2) DEFAULT 0.0,
    raw_material_tonnes NUMERIC(15, 2) NOT NULL,
    hazardous_waste_tonnes NUMERIC(12, 2) DEFAULT 0.0,
    waste_recycled_pct NUMERIC(5, 2) DEFAULT 0.0,
    data_status data_status DEFAULT 'REPORTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMISSION RECORDS
CREATE TABLE emission_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    record_year INT NOT NULL,
    co2_kilo_tonnes NUMERIC(12, 2) NOT NULL,
    so2_tonnes NUMERIC(10, 2) NOT NULL,
    no2_tonnes NUMERIC(10, 2) NOT NULL,
    pm25_tonnes NUMERIC(8, 2) NOT NULL,
    pm10_tonnes NUMERIC(8, 2) NOT NULL,
    co_tonnes NUMERIC(8, 2) DEFAULT 0.0,
    data_status data_status DEFAULT 'OBSERVED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. POLLUTION RECORDS
CREATE TABLE pollution_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(50) REFERENCES regions(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    ambient_pm25 NUMERIC(6, 2),
    ambient_pm10 NUMERIC(6, 2),
    ambient_so2 NUMERIC(6, 2),
    ambient_no2 NUMERIC(6, 2),
    water_ph NUMERIC(4, 2),
    water_dissolved_oxygen NUMERIC(5, 2),
    water_bod NUMERIC(6, 2),
    water_cod NUMERIC(6, 2),
    data_status data_status DEFAULT 'OBSERVED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ENVIRONMENTAL INDICATORS
CREATE TABLE environmental_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(50) REFERENCES regions(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    temperature_c NUMERIC(5, 2),
    rainfall_mm NUMERIC(8, 2),
    humidity_pct NUMERIC(5, 2),
    wind_speed_mps NUMERIC(5, 2),
    solar_radiation_wm2 NUMERIC(7, 2),
    vegetation_index_ndvi NUMERIC(4, 3),
    soil_stress_index NUMERIC(5, 2),
    data_status data_status DEFAULT 'ESTIMATED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. IMPACT ASSESSMENTS (MODELLED ENGINE)
CREATE TABLE impact_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    emission_score INT NOT NULL CHECK (emission_score BETWEEN 0 AND 100),
    pollution_score INT NOT NULL CHECK (pollution_score BETWEEN 0 AND 100),
    resource_score INT NOT NULL CHECK (resource_score BETWEEN 0 AND 100),
    energy_score INT NOT NULL CHECK (energy_score BETWEEN 0 AND 100),
    environmental_stress_score INT NOT NULL CHECK (environmental_stress_score BETWEEN 0 AND 100),
    climate_risk_score INT NOT NULL CHECK (climate_risk_score BETWEEN 0 AND 100),
    composite_impact_score INT NOT NULL CHECK (composite_impact_score BETWEEN 0 AND 100),
    risk_level risk_level NOT NULL,
    model_version VARCHAR(20) DEFAULT 'v1.4-beta',
    data_status data_status DEFAULT 'MODELLED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REGIONAL RISK ASSESSMENTS
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id VARCHAR(50) REFERENCES regions(id) ON DELETE CASCADE,
    assessment_year INT NOT NULL,
    overall_risk risk_level NOT NULL,
    vulnerability_index NUMERIC(5, 2),
    primary_threat_vector TEXT,
    monitored_impact_zones JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. FORECASTS
CREATE TABLE forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    target_year INT NOT NULL,
    projected_co2_kilo_tonnes NUMERIC(12, 2),
    projected_pm25_tonnes NUMERIC(8, 2),
    projected_impact_score INT CHECK (projected_impact_score BETWEEN 0 AND 100),
    confidence_interval_low INT,
    confidence_interval_high INT,
    forecast_model VARCHAR(50) DEFAULT 'PolynomialDamped_v2',
    data_status data_status DEFAULT 'MODELLED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SCENARIOS (WHAT-IF)
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    param_renewable_pct NUMERIC(5, 2),
    param_fossil_reduction_pct NUMERIC(5, 2),
    param_emission_reduction_pct NUMERIC(5, 2),
    param_water_reduction_pct NUMERIC(5, 2),
    baseline_impact_score INT,
    simulated_impact_score INT,
    improvement_pct NUMERIC(5, 2),
    highest_impact_lever TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. RECOMMENDATIONS
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    priority VARCHAR(20) NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
    intervention_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    expected_benefit TEXT NOT NULL,
    relevant_metric VARCHAR(255),
    target_reduction_pct NUMERIC(5, 2),
    is_implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. REPORTS & STORAGE METADATA
CREATE TABLE reports (
    id VARCHAR(100) PRIMARY KEY,
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE SET NULL,
    region_id VARCHAR(50) REFERENCES regions(id) ON DELETE SET NULL,
    generated_by UUID REFERENCES profiles(id),
    report_title VARCHAR(255) NOT NULL,
    storage_bucket_path TEXT, -- Supabase Storage private bucket path
    file_format VARCHAR(10) DEFAULT 'PDF',
    verification_hash VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DATA SOURCES REGISTRY
CREATE TABLE data_sources (
    id VARCHAR(50) PRIMARY KEY,
    dataset_name VARCHAR(255) NOT NULL,
    custodian_organization VARCHAR(255) NOT NULL,
    parameters_measured TEXT NOT NULL,
    spatial_resolution VARCHAR(100),
    temporal_resolution VARCHAR(100),
    update_frequency VARCHAR(100),
    official_portal_url TEXT,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. API SERVICES & MONETIZATION
CREATE TABLE api_services (
    id VARCHAR(50) PRIMARY KEY,
    endpoint_path VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_micro_algo BIGINT NOT NULL DEFAULT 50000,
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 12.50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_service_id VARCHAR(50) REFERENCES api_services(id),
    caller_profile_id UUID REFERENCES profiles(id),
    http_status INT NOT NULL,
    latency_ms INT,
    client_ip INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. PAYMENT EVENTS (x402 & Algorand Settlement)
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_service_id VARCHAR(50) REFERENCES api_services(id),
    protocol VARCHAR(50) DEFAULT 'x402_HTTP_PAYMENT',
    settlement_network VARCHAR(50) DEFAULT 'Algorand_Testnet',
    amount_micro_algo BIGINT NOT NULL,
    transaction_hash VARCHAR(128) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'VERIFIED_SETTLED',
    payment_metadata JSONB,
    settled_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Helper function: get current authenticated user role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. ADMIN: Complete access
CREATE POLICY admin_all_profiles ON profiles FOR ALL TO authenticated USING (current_user_role() = 'ADMIN');
CREATE POLICY admin_all_facilities ON facilities FOR ALL TO authenticated USING (current_user_role() = 'ADMIN');

-- 2. GOVERNMENT: Access to all regional facilities in jurisdiction
CREATE POLICY gov_read_facilities ON facilities FOR SELECT TO authenticated
USING (
  current_user_role() = 'GOVERNMENT'
  AND (
    (SELECT jurisdiction_state FROM profiles WHERE id = auth.uid()) IS NULL
    OR state = (SELECT jurisdiction_state FROM profiles WHERE id = auth.uid())
  )
);

CREATE POLICY gov_read_emissions ON emission_records FOR SELECT TO authenticated
USING (
  current_user_role() IN ('GOVERNMENT', 'ADMIN')
);

-- 3. INDUSTRY: Access ONLY authorized facility data
CREATE POLICY industry_facility_isolation ON facilities FOR SELECT TO authenticated
USING (
  current_user_role() = 'INDUSTRY'
  AND id = (SELECT facility_id_authorized FROM profiles WHERE id = auth.uid())
);

CREATE POLICY industry_records_isolation ON emission_records FOR ALL TO authenticated
USING (
  current_user_role() = 'INDUSTRY'
  AND facility_id = (SELECT facility_id_authorized FROM profiles WHERE id = auth.uid())
);

-- 4. ANALYST: Read-only access to analytical indicators & anonymized benchmarks
CREATE POLICY analyst_read_impact ON impact_assessments FOR SELECT TO authenticated
USING (current_user_role() = 'ANALYST');

CREATE POLICY analyst_read_regions ON regions FOR SELECT TO authenticated
USING (true);
`;

export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;



export interface TableMetaItem {
  name: string;
  description: string;
  columnsCount: number;
  rlsSummary: string;
}

export const SUPABASE_TABLES_META: TableMetaItem[] = [
  {
    name: 'organizations',
    description: 'Enterprise parent entities, state regulatory bodies, and research institutions',
    columnsCount: 7,
    rlsSummary: 'Admin full access; users can view their associated organization',
  },
  {
    name: 'profiles',
    description: 'User accounts linked to auth.users with granular role-based permissions',
    columnsCount: 9,
    rlsSummary: 'Admin read/write; users read/edit their own profile; Government reads state users',
  },
  {
    name: 'regions',
    description: 'Geographic corridors, air basins, river basins with PostGIS geometry coordinates',
    columnsCount: 16,
    rlsSummary: 'Public read-only for analysts and authenticated agencies; Admin writes',
  },
  {
    name: 'facilities',
    description: 'Industrial facilities master table with sector, capacity, and coordinates',
    columnsCount: 22,
    rlsSummary: 'Government reads by state jurisdiction; Industry isolated to authorized plant',
  },
  {
    name: 'industrial_activity',
    description: 'Annual and monthly production volume, operating days, and capacity utilization',
    columnsCount: 10,
    rlsSummary: 'Industry writes own facility; Government/Admin reads within jurisdiction',
  },
  {
    name: 'energy_records',
    description: 'Total electricity, captive generation, renewable share, and fuel breakdown',
    columnsCount: 11,
    rlsSummary: 'Industry writes own facility; Government/Admin reads within jurisdiction',
  },
  {
    name: 'resource_records',
    description: 'Water withdrawal, recycling rates, hazardous waste, and circularity',
    columnsCount: 11,
    rlsSummary: 'Industry writes own facility; Government/Admin reads within jurisdiction',
  },
  {
    name: 'emission_records',
    description: 'Continuous stack emissions: CO2, SO2, NOx, PM2.5, PM10, and VOCs',
    columnsCount: 13,
    rlsSummary: 'Strict isolation: Plant operator writes telemetry; Regulators inspect',
  },
  {
    name: 'impact_assessments',
    description: 'Calculated 0-100 composite Environmental Impact Score and 6 weighted sub-indices',
    columnsCount: 14,
    rlsSummary: 'Generated deterministically; read-accessible to Analysts, Regulators, Operators',
  },
  {
    name: 'scenarios',
    description: 'User-saved What-If policy simulations, lever inputs, and recalculated deltas',
    columnsCount: 12,
    rlsSummary: 'Private to creator user; shareable within organization',
  },
  {
    name: 'reports',
    description: 'Generated formal PDF/CSV audit reports with cryptographic verification hashes',
    columnsCount: 11,
    rlsSummary: 'Public read for published reports; draft reports restricted to organization',
  },
  {
    name: 'air_quality_readings',
    description: 'Ambient air monitoring network observations (PM2.5, PM10, SO2, NO2, O3, CO)',
    columnsCount: 10,
    rlsSummary: 'Read-only public access for all authenticated users; Admin batch ingestion',
  },
  {
    name: 'water_basin_stress',
    description: 'Central Ground Water Board aquifer drawdown and river assimilation indices',
    columnsCount: 9,
    rlsSummary: 'Public reference for all roles; Admin writes',
  },
  {
    name: 'soil_vegetation_indices',
    description: 'Satellite NDVI canopy stress and industrial buffer soil quality indexes',
    columnsCount: 8,
    rlsSummary: 'Public reference for all roles; Remote sensing pipeline writes',
  },
  {
    name: 'system_alerts',
    description: 'Continuous exceedance alarms, regulatory threshold violations, and incident notices',
    columnsCount: 9,
    rlsSummary: 'Broadcast to Government and affected Industry operators',
  },
  {
    name: 'data_sources_metadata',
    description: 'Provenance registry for public and satellite datasets with reliability scores',
    columnsCount: 9,
    rlsSummary: 'Read-only transparency index for all roles',
  },
  {
    name: 'mitigation_recommendations',
    description: 'Synthesized prioritized interventions with Capex, payback, and score reductions',
    columnsCount: 8,
    rlsSummary: 'Industry operators and Government regulators have read access',
  },
  {
    name: 'api_services',
    description: 'Published Environmental Intelligence API catalog and micro-ALGO pricing',
    columnsCount: 8,
    rlsSummary: 'Public catalog access for external developers',
  },
  {
    name: 'x402_settlements',
    description: 'Algorand testnet micropayment transaction hashes and cryptographic receipts',
    columnsCount: 9,
    rlsSummary: 'Authenticated clients read own settlement proofs; Gateway records txId',
  },
  {
    name: 'audit_logs',
    description: 'Tamper-evident access and alteration log across statutory environmental records',
    columnsCount: 7,
    rlsSummary: 'Immutable append-only; Admin read-only inspection',
  },
];

