import React, { useState } from 'react';
import {
  Factory,
  Zap,
  Flame,
  Wind,
  Trees,
  AlertTriangle,
  ArrowRight,
  Info,
  Sliders,
} from 'lucide-react';
import { Facility } from '../types';

interface CauseImpactFlowProps {
  facility: Facility;
  onNavigateToSimulator?: () => void;
}

export const CauseImpactFlow: React.FC<CauseImpactFlowProps> = ({
  facility,
  onNavigateToSimulator,
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      title: 'Industrial Activity',
      subtitle: 'Production & Throughput',
      icon: Factory,
      metricValue: `${(facility.productionAnnual / 1000).toFixed(0)}k ${facility.productionUnit.split(' ')[0]}`,
      metricLabel: 'Annual Throughput',
      status: 'High Load',
      details: {
        capacityUtilization: `${facility.capacityUtilization}% of rated capacity`,
        productionAnnual: `${facility.productionAnnual.toLocaleString()} ${facility.productionUnit}`,
        operationalStatus: facility.operationalStatus,
        sectorBenchmark: 'Top quartile volume in industrial cluster',
      },
      analyticalExplanation:
        'Baseline industrial scale determines total energy and raw material requirements across the production boundary.',
    },
    {
      id: 1,
      title: 'Energy & Resource Intake',
      subtitle: 'Combustion & Grid Input',
      icon: Zap,
      metricValue: `${facility.energyTotalGWh} GWh`,
      metricLabel: `${facility.renewableSharePct}% Renewable Share`,
      status: `${100 - facility.renewableSharePct}% Fossil-Driven`,
      details: {
        totalEnergy: `${facility.energyTotalGWh} GWh / year`,
        renewableEnergy: `${Math.round(facility.energyTotalGWh * (facility.renewableSharePct / 100))} GWh (${facility.renewableSharePct}%)`,
        fossilDependence: `${Math.round(facility.energyTotalGWh * ((100 - facility.renewableSharePct) / 100))} GWh (${100 - facility.renewableSharePct}%)`,
        waterExtraction: `${facility.waterAnnualMillionLitres} Million Litres (${facility.waterRecycledPct}% recycled)`,
        energyIntensity: `${facility.energyIntensityGWhPerThousandTonne} GWh / kt output`,
      },
      analyticalExplanation:
        'High non-renewable combustion directly feeds into stack emissions and accounts for ~22% of the modelled impact score.',
    },
    {
      id: 2,
      title: 'Emissions Profile',
      subtitle: 'Stack & Flue Discharge',
      icon: Flame,
      metricValue: `${facility.emissionsCO2kTonnes} kt CO₂`,
      metricLabel: `${facility.emissionsSO2Tonnes} t SO₂ Load`,
      status: `Score: ${facility.emissionScore}/100`,
      details: {
        annualCO2: `${facility.emissionsCO2kTonnes} Kilo-Tonnes`,
        annualSO2: `${facility.emissionsSO2Tonnes} Tonnes`,
        annualNO2: `${facility.emissionsNO2Tonnes} Tonnes`,
        annualPM25: `${facility.emissionsPM25Tonnes} Tonnes`,
        annualPM10: `${facility.emissionsPM10Tonnes} Tonnes`,
      },
      analyticalExplanation:
        'Direct stack emission mass flux represents the single largest contributor (31%) to overall facility impact.',
    },
    {
      id: 3,
      title: 'Ambient Pollution',
      subtitle: 'Air & Watershed Loading',
      icon: Wind,
      metricValue: `${facility.emissionsPM25Tonnes} t PM`,
      metricLabel: 'Local Air Quality Score',
      status: `Score: ${facility.pollutionScore}/100`,
      details: {
        ambientImpact: 'Receptor ground concentrations exceed standard NAAQS',
        dispersionVulnerability: 'Atmospheric boundary layer stagnation during winter months',
        basinEffluentStress: `Water score: ${facility.resourceScore}/100`,
        primaryConcern: 'Fine particulate (PM2.5) inhalation and sulfur acidification',
      },
      analyticalExplanation:
        'Stack emissions disperse into the regional air basin, compounding existing background particulate concentrations.',
    },
    {
      id: 4,
      title: 'Regional Stress',
      subtitle: 'Ecosystem & Water Basin',
      icon: Trees,
      metricValue: `${facility.environmentalStressScore}/100`,
      metricLabel: 'Cumulative Stress Score',
      status: 'High Pressure',
      details: {
        clusterDensity: `${facility.regionName} industrial corridor`,
        watershedVulnerability: 'Groundwater table depletion in surrounding 15km perimeter',
        soilVegetationStress: 'NDVI vegetation indices suppressed within industrial buffer',
      },
      analyticalExplanation:
        'Continuous industrial discharge strains natural assimilation capacities of local forests and aquifers.',
    },
    {
      id: 5,
      title: 'Regional Risk & Action',
      subtitle: 'Decision Support & Mitigation',
      icon: AlertTriangle,
      metricValue: `${facility.impactScore}/100`,
      metricLabel: facility.riskLevel,
      status: 'Intervention Required',
      details: {
        compositeImpactScore: `${facility.impactScore} / 100`,
        modelledRiskCategory: facility.riskLevel,
        recommendedIntervention: 'Captive Renewable Transition + Flue Gas Scrubbing Upgrade',
        actionHorizon: 'Target 25% reduction by 2028',
      },
      analyticalExplanation:
        'PARIDRISHYA synthesized impact triggers actionable mitigation pathways to de-escalate the risk category.',
    },
  ];

  const currentStage = stages[selectedStage];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Causal Chain & Explanatory Pipeline: Activity → Risk → Mitigation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow how physical industrial inputs translate into environmental stress and decision triggers.
          </p>
        </div>
        {onNavigateToSimulator && (
          <button
            onClick={onNavigateToSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Simulate Mitigation Scenarios</span>
          </button>
        )}
      </div>

      {/* Interactive Horizontal Flow Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 my-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = selectedStage === idx;
          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
              }`}
            >
              {/* Connector arrow indicator on right for large screens */}
              {idx < stages.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
              )}

              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-slate-800 text-emerald-300' : 'bg-white text-slate-500 border border-slate-200'
                }`}>
                  Stage {idx + 1}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>

              <div className="font-bold text-xs leading-snug mb-1 truncate">{stage.title}</div>
              <div className={`text-[11px] font-semibold truncate ${isSelected ? 'text-emerald-300' : 'text-slate-900'}`}>
                {stage.metricValue}
              </div>
              <div className={`text-[10px] truncate ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                {stage.metricLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Callout Panel */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mt-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Stage {selectedStage + 1}: {currentStage.title}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
              {currentStage.status}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 italic">
            Click on any stage above to inspect underlying operational parameters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 py-3">
          {Object.entries(currentStage.details).map(([key, val]) => (
            <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                {val}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2.5 border-t border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
          <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">Analytical Insight:</strong> {currentStage.analyticalExplanation}
          </span>
        </div>
      </div>
    </div>
  );
};
