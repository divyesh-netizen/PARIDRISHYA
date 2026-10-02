import { Facility, RiskLevel, ContributingFactor, Recommendation, YearlyTrend, WhatIfInputs, WhatIfResult } from '../types';

/**
 * Maps a numerical score (0-100) to standard PARIDRISHYA risk classifications.
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MODERATE';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Calculates weighted Environmental Impact Score (0-100)
 * 
 * Formula:
 * Impact = 0.25 * Emission + 0.20 * Pollution + 0.15 * Resource + 0.15 * Energy + 0.15 * EnvStress + 0.10 * ClimateRisk
 */
export function calculateImpactScore(components: {
  emissionScore: number;
  pollutionScore: number;
  resourceScore: number;
  energyScore: number;
  environmentalStressScore: number;
  climateRiskScore: number;
}): number {
  const raw =
    0.25 * components.emissionScore +
    0.20 * components.pollutionScore +
    0.15 * components.resourceScore +
    0.15 * components.energyScore +
    0.15 * components.environmentalStressScore +
    0.10 * components.climateRiskScore;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Calculates the percentage contribution of each component to the facility's overall impact score
 */
export function calculateContributingFactors(facility: Facility): ContributingFactor[] {
  const weights = {
    emission: 0.25,
    pollution: 0.20,
    resource: 0.15,
    energy: 0.15,
    stress: 0.15,
    climate: 0.10,
  };

  const contributions = [
    {
      name: 'Emission Intensity',
      weightedVal: facility.emissionScore * weights.emission,
      score: facility.emissionScore,
      category: 'Emissions',
      description: 'CO2, SO2, NO2 and PM mass load per production unit.',
    },
    {
      name: 'Air & Regional Pollution',
      weightedVal: facility.pollutionScore * weights.pollution,
      score: facility.pollutionScore,
      category: 'Pollution',
      description: 'Atmospheric PM2.5, ambient AQI, and local receptor air quality.',
    },
    {
      name: 'Energy Profile & Non-Renewables',
      weightedVal: facility.energyScore * weights.energy,
      score: facility.energyScore,
      category: 'Energy',
      description: 'Grid reliance, thermal fossil usage, and low renewable share.',
    },
    {
      name: 'Resource & Water Pressure',
      weightedVal: facility.resourceScore * weights.resource,
      score: facility.resourceScore,
      category: 'Resources',
      description: 'Specific water consumption, effluent load, and hazardous waste.',
    },
    {
      name: 'Regional Environmental Stress',
      weightedVal: facility.environmentalStressScore * weights.stress,
      score: facility.environmentalStressScore,
      category: 'Stress',
      description: 'Cumulative industrial cluster load and watershed vulnerability.',
    },
    {
      name: 'Climate & Thermal Sensitivity',
      weightedVal: facility.climateRiskScore * weights.climate,
      score: facility.climateRiskScore,
      category: 'Climate',
      description: 'Ambient peak temperature extremes and drought vulnerability.',
    },
  ];

  const totalWeighted = contributions.reduce((acc, c) => acc + c.weightedVal, 0) || 1;

  return contributions
    .map((c) => ({
      name: c.name,
      percentage: Math.round((c.weightedVal / totalWeighted) * 100),
      score: c.score,
      category: c.category,
      description: c.description,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Dynamically produces explainability text from actual component scores.
 */
export function generateExplainabilitySummary(facility: Facility): string {
  const factors = calculateContributingFactors(facility);
  const topFactor = factors[0];
  const secondFactor = factors[1];

  let trajectory = 'stable';
  if (facility.impactScore > 75) {
    trajectory = 'severely elevated with potential compound ecological stress';
  } else if (facility.impactScore > 60) {
    trajectory = 'elevated and approaching regulatory scrutiny thresholds';
  } else {
    trajectory = 'within manageable operational bounds';
  }

  return `Modelled environmental impact for ${facility.name} is currently ${facility.riskLevel} (${facility.impactScore}/100). The primary driver is ${topFactor.name} (accounting for ~${topFactor.percentage}% of the analytical score), accompanied by ${secondFactor.name} (~${secondFactor.percentage}%). Overall regional pressure in the ${facility.regionName} corridor is ${trajectory} under prevailing operating conditions.`;
}

/**
 * Generates actionable targeted recommendations based on actual component values
 */
export function generateRecommendations(facility: Facility): Recommendation[] {
  const list: Recommendation[] = [];

  if (facility.renewableSharePct < 35 || facility.energyScore > 60) {
    list.push({
      id: 'rec-renewables',
      priority: facility.energyScore > 70 ? 'HIGH' : 'MEDIUM',
      title: 'Accelerate Captive Renewable Energy Integration',
      reason: `Facility renewable share is currently ${facility.renewableSharePct}%, contributing to an Energy Score of ${facility.energyScore}/100.`,
      expectedBenefit: 'Reduces modelled energy score by 15-28% and cuts indirect Scope 2 carbon footprint.',
      relevantMetric: `Current: ${facility.renewableSharePct}% RE → Target: ≥ 50% RE`,
      targetReductionPct: 25,
      interventionType: 'Renewable Transition',
    });
  }

  if (facility.emissionsSO2Tonnes > 200 || facility.emissionsPM25Tonnes > 50 || facility.emissionScore > 65) {
    list.push({
      id: 'rec-emissions',
      priority: 'HIGH',
      title: 'Upgrade Flue Gas Desulfurization & Electrostatic Precipitators',
      reason: `Annual SO2 (${facility.emissionsSO2Tonnes} t) and PM (${facility.emissionsPM25Tonnes} t) loads place the Emission Score at ${facility.emissionScore}/100.`,
      expectedBenefit: 'Directly lowers stack particulate concentration and ambient receptor sulfur loading.',
      relevantMetric: `Current: ${facility.emissionsPM25Tonnes} t PM2.5 → Target: < 25 t`,
      targetReductionPct: 35,
      interventionType: 'Emission Control',
    });
  }

  if (facility.waterRecycledPct < 60 || facility.resourceScore > 60) {
    list.push({
      id: 'rec-water',
      priority: facility.resourceScore > 75 ? 'HIGH' : 'MEDIUM',
      title: 'Implement Closed-Loop Water Recycling (ZLD Architecture)',
      reason: `Water recycling stands at ${facility.waterRecycledPct}%, withdrawing ${facility.waterAnnualMillionLitres} ML annually from a stressed basin.`,
      expectedBenefit: 'Alleviates groundwater extraction pressure and reduces effluent discharge risk.',
      relevantMetric: `Current: ${facility.waterRecycledPct}% recycled → Target: ≥ 85%`,
      targetReductionPct: 30,
      interventionType: 'Water Circularity',
    });
  }

  if (facility.capacityUtilization > 85 && facility.energyIntensityGWhPerThousandTonne > 0.45) {
    list.push({
      id: 'rec-efficiency',
      priority: 'MEDIUM',
      title: 'Deploy High-Efficiency Variable Frequency Drives & Waste Heat Recovery',
      reason: `Specific energy intensity is high at ${facility.energyIntensityGWhPerThousandTonne} GWh per kilotonne output.`,
      expectedBenefit: 'Lowers baseline energy requirements by 8-14% through thermodynamic recovery.',
      relevantMetric: `Intensity: ${facility.energyIntensityGWhPerThousandTonne} → Target: < 0.35 GWh/kt`,
      targetReductionPct: 15,
      interventionType: 'Process Efficiency',
    });
  }

  if (facility.environmentalStressScore > 65) {
    list.push({
      id: 'rec-monitoring',
      priority: 'MEDIUM',
      title: 'Establish Continuous Ambient Air & Sensor Telemetry Grid',
      reason: `Surrounding industrial cluster stress score is ${facility.environmentalStressScore}/100 with dense cumulative loading.`,
      expectedBenefit: 'Enables high-frequency microclimate detection and real-time plume dispersion tracking.',
      relevantMetric: 'Deploy 4 boundary CAAQMS IoT nodes with automated threshold triggers.',
      targetReductionPct: 10,
      interventionType: 'Regional Monitoring',
    });
  }

  return list;
}

/**
 * Transparent What-If Scenario Calculation
 */
export function calculateScenario(facility: Facility, inputs: WhatIfInputs): WhatIfResult {
  const baseline = {
    emissionScore: facility.emissionScore,
    energyScore: facility.energyScore,
    resourceScore: facility.resourceScore,
    pollutionScore: facility.pollutionScore,
    environmentalStressScore: facility.environmentalStressScore,
    climateRiskScore: facility.climateRiskScore,
    impactScore: facility.impactScore,
    riskLevel: facility.riskLevel,
  };

  // 1. Emission Score Adjustment:
  // Influenced by emission reduction %, fossil fuel reduction %, and production volume scale
  const prodFactor = inputs.productionLevelPct / 100;
  const directEmissionMitigation = inputs.emissionReductionPct / 100;
  const fossilMitigation = (inputs.fossilFuelReductionPct / 100) * 0.4;
  const totalEmissionReduction = Math.min(0.85, directEmissionMitigation + fossilMitigation);
  const scenarioEmissionScore = Math.round(
    Math.max(12, baseline.emissionScore * prodFactor * (1 - totalEmissionReduction))
  );

  // 2. Energy Score Adjustment:
  // Influenced by renewable share transition and energy efficiency
  const deltaRenewable = Math.max(0, inputs.renewableEnergyPct - facility.renewableSharePct);
  const reReduction = (deltaRenewable / 100) * 0.65;
  const effReduction = (inputs.energyEfficiencyPct / 100) * 0.70;
  const totalEnergyMitigation = Math.min(0.80, reReduction + effReduction);
  const scenarioEnergyScore = Math.round(
    Math.max(15, baseline.energyScore * (1 - totalEnergyMitigation))
  );

  // 3. Resource Score Adjustment:
  // Influenced by water reduction % and waste recycling %
  const waterMitigation = (inputs.waterReductionPct / 100) * 0.55;
  const wasteMitigation = (inputs.wasteRecyclingPct / 100) * 0.35;
  const scenarioResourceScore = Math.round(
    Math.max(15, baseline.resourceScore * (1 - (waterMitigation + wasteMitigation)))
  );

  // 4. Pollution Score Adjustment:
  // Secondary benefit of emission abatement on ambient receptor
  const scenarioPollutionScore = Math.round(
    Math.max(18, baseline.pollutionScore * (1 - directEmissionMitigation * 0.5))
  );

  // 5. Environmental Stress & Climate Risk:
  // Stress slightly dampens with comprehensive industrial cleanup
  const scenarioStressScore = Math.round(
    Math.max(20, baseline.environmentalStressScore * (1 - totalEmissionReduction * 0.15))
  );
  const scenarioClimateScore = baseline.climateRiskScore;

  const scenarioImpactScore = calculateImpactScore({
    emissionScore: scenarioEmissionScore,
    pollutionScore: scenarioPollutionScore,
    resourceScore: scenarioResourceScore,
    energyScore: scenarioEnergyScore,
    environmentalStressScore: scenarioStressScore,
    climateRiskScore: scenarioClimateScore,
  });

  const scenarioRisk = getRiskLevel(scenarioImpactScore);

  const rawImprovement = ((baseline.impactScore - scenarioImpactScore) / baseline.impactScore) * 100;
  const improvementPct = Math.round(Math.max(0, rawImprovement) * 10) / 10;

  // Identify highest impact lever
  let highestImpactIntervention = 'Renewable energy adoption';
  const potentialRenewableCut = reReduction * 0.15;
  const potentialEmissionCut = directEmissionMitigation * 0.25;
  const potentialWaterCut = waterMitigation * 0.15;

  if (potentialEmissionCut >= potentialRenewableCut && potentialEmissionCut >= potentialWaterCut) {
    highestImpactIntervention = 'Direct Flue Gas Emission Reduction & Abatement';
  } else if (potentialRenewableCut >= potentialWaterCut) {
    highestImpactIntervention = 'Renewable Clean Energy Transition';
  } else {
    highestImpactIntervention = 'Water Recycling & ZLD Implementation';
  }

  // Savings estimates
  const co2AvoidedKiloTonnes = Math.round(facility.emissionsCO2kTonnes * (totalEmissionReduction * 0.7 + reReduction * 0.3));
  const waterSavedMillionLitres = Math.round(facility.waterAnnualMillionLitres * (inputs.waterReductionPct / 100));

  return {
    baseline,
    scenario: {
      emissionScore: scenarioEmissionScore,
      energyScore: scenarioEnergyScore,
      resourceScore: scenarioResourceScore,
      pollutionScore: scenarioPollutionScore,
      environmentalStressScore: scenarioStressScore,
      climateRiskScore: scenarioClimateScore,
      impactScore: scenarioImpactScore,
      riskLevel: scenarioRisk,
    },
    improvementPct,
    highestImpactIntervention,
    co2AvoidedKiloTonnes,
    waterSavedMillionLitres,
  };
}

/**
 * Generates deterministic 10-year historical + forecast data (2021 - 2030)
 * Uses linear slope + dampening to avoid runaway extrapolation.
 */
export function generateFacilityTrends(facility: Facility): YearlyTrend[] {
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const baselineYear = 2026;
  const baselineImpact = facility.impactScore;
  const baselineCO2 = facility.emissionsCO2kTonnes;
  const baselinePM = facility.emissionsPM25Tonnes;
  const baselineWater = facility.waterAnnualMillionLitres;
  const baselineEnergy = facility.energyTotalGWh;

  // Sectoral trend growth/decay factors
  const annualGrowthRate = facility.impactScore > 70 ? 0.024 : 0.012;

  return years.map((yr) => {
    const isForecast = yr > baselineYear;
    const offset = yr - baselineYear;

    if (!isForecast) {
      // Historical trend (2021 to 2026)
      // Slight variation based on deterministic polynomial
      const histFactor = 1 + (offset * annualGrowthRate * 0.9) - Math.sin(yr) * 0.015;
      const yrImpact = Math.round(baselineImpact * histFactor);
      return {
        year: yr,
        isForecast: false,
        impactScore: Math.min(99, Math.max(15, yrImpact)),
        emissionsCO2: Math.round(baselineCO2 * histFactor),
        pm25: Math.round(baselinePM * histFactor),
        waterUse: Math.round(baselineWater * histFactor),
        energyGWh: Math.round(baselineEnergy * histFactor),
        riskLevel: getRiskLevel(yrImpact),
      };
    } else {
      // Forecast trend (2027 to 2030)
      const forecastFactor = 1 + offset * annualGrowthRate;
      const forecastImpact = Math.round(baselineImpact * forecastFactor);
      const confidenceMargin = Math.round(offset * 2.8);

      return {
        year: yr,
        isForecast: true,
        impactScore: Math.min(99, Math.max(15, forecastImpact)),
        emissionsCO2: Math.round(baselineCO2 * forecastFactor),
        pm25: Math.round(baselinePM * forecastFactor),
        waterUse: Math.round(baselineWater * forecastFactor),
        energyGWh: Math.round(baselineEnergy * forecastFactor),
        riskLevel: getRiskLevel(forecastImpact),
        confidenceInterval: {
          low: Math.max(0, forecastImpact - confidenceMargin),
          high: Math.min(100, forecastImpact + confidenceMargin),
        },
      };
    }
  });
}
