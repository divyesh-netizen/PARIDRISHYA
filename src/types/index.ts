export type UserRole = 'ADMIN' | 'GOVERNMENT' | 'INDUSTRY' | 'ANALYST';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataStatus = 'OBSERVED' | 'REPORTED' | 'ESTIMATED' | 'MODELLED' | 'DEMO';

export type IndustrialSector =
  | 'Steel'
  | 'Thermal Power'
  | 'Chemical'
  | 'Cement'
  | 'Textile'
  | 'Refinery'
  | 'Automotive'
  | 'Mining'
  | 'Aluminium'
  | 'Pharmaceutical'
  | 'Ceramics';

export interface Facility {
  id: string;
  name: string;
  code: string;
  sector: IndustrialSector;
  regionId: string;
  regionName: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operationalStatus: 'OPERATIONAL' | 'MAINTENANCE' | 'MONITORED';
  capacityUtilization: number; // percentage
  productionAnnual: number; // in tonnes or standard unit
  productionUnit: string;
  // Energy
  energyTotalGWh: number;
  renewableSharePct: number;
  energyIntensityGWhPerThousandTonne: number;
  // Water & Resources
  waterAnnualMillionLitres: number;
  waterRecycledPct: number;
  rawMaterialTonnes: number;
  hazardousWasteTonnes: number;
  wasteRecycledPct: number;
  // Emissions
  emissionsCO2kTonnes: number;
  emissionsSO2Tonnes: number;
  emissionsNO2Tonnes: number;
  emissionsPM25Tonnes: number;
  emissionsPM10Tonnes: number;
  // Analytical Scores (0-100)
  impactScore: number;
  riskLevel: RiskLevel;
  emissionScore: number;
  pollutionScore: number;
  resourceScore: number;
  energyScore: number;
  environmentalStressScore: number;
  climateRiskScore: number;
  // Metadata
  lastUpdated: string;
  dataStatus: DataStatus;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central';
  coordinates: {
    lat: number;
    lng: number;
  };
  mapSvgCoords: {
    x: number;
    y: number;
  };
  areaSqKm: number;
  populationMillion: number;
  facilityCount: number;
  avgImpactScore: number;
  riskLevel: RiskLevel;
  airQualityIndex: number;
  dominantRiskDriver: string;
  waterStressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  forestCoverPct: number;
  temperatureAvgC: number;
  annualRainfallMm: number;
}

export interface ContributingFactor {
  name: string;
  percentage: number;
  score: number;
  category: string;
  description: string;
}

export interface Recommendation {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  expectedBenefit: string;
  relevantMetric: string;
  targetReductionPct: number;
  interventionType: 'Renewable Transition' | 'Emission Control' | 'Water Circularity' | 'Process Efficiency' | 'Regional Monitoring';
}

export interface YearlyTrend {
  year: number;
  isForecast: boolean;
  emissionsCO2: number;
  pm25: number;
  waterUse: number;
  energyGWh: number;
  impactScore: number;
  riskLevel: RiskLevel;
  confidenceInterval?: {
    low: number;
    high: number;
  };
}

export interface WhatIfInputs {
  renewableEnergyPct: number; // 0 - 100
  fossilFuelReductionPct: number; // 0 - 100
  productionLevelPct: number; // 50 - 150 (100 is baseline)
  waterReductionPct: number; // 0 - 100
  emissionReductionPct: number; // 0 - 100
  wasteRecyclingPct: number; // 0 - 100
  energyEfficiencyPct: number; // 0 - 50
}

export interface WhatIfResult {
  baseline: {
    emissionScore: number;
    energyScore: number;
    resourceScore: number;
    pollutionScore: number;
    environmentalStressScore: number;
    climateRiskScore: number;
    impactScore: number;
    riskLevel: RiskLevel;
  };
  scenario: {
    emissionScore: number;
    energyScore: number;
    resourceScore: number;
    pollutionScore: number;
    environmentalStressScore: number;
    climateRiskScore: number;
    impactScore: number;
    riskLevel: RiskLevel;
  };
  improvementPct: number;
  highestImpactIntervention: string;
  co2AvoidedKiloTonnes: number;
  waterSavedMillionLitres: number;
}

export interface SystemAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  title: string;
  facilityName?: string;
  regionName: string;
  reason: string;
  recommendedAction: string;
  timestamp: string;
  isRead: boolean;
}

export interface DataSourceMetadata {
  id: string;
  dataset: string;
  parameter: string;
  source: string;
  unit: string;
  spatialResolution: string;
  temporalResolution: string;
  updateFrequency: string;
  dataStatus: DataStatus;
  usage: string;
}

export interface ApiEndpointSpec {
  endpoint: string;
  method: 'GET' | 'POST';
  title: string;
  description: string;
  costMicroAlgo: number;
  costInr: number;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  sampleRequest?: Record<string, unknown>;
  sampleResponse: Record<string, unknown>;
}

export interface X402PaymentState {
  isVerifying: boolean;
  isPaid: boolean;
  txId?: string;
  amountAlgo?: number;
  settledAt?: string;
  receiptHash?: string;
}
