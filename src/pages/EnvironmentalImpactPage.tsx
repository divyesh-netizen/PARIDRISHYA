import React, { useState } from 'react';
import {
  ShieldAlert,
  Info,
  Sliders,
  TrendingUp,
  Scale,
  Sparkles,
  HelpCircle,
  BarChart3,
  Factory,
} from 'lucide-react';
import { Facility } from '../types';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface EnvironmentalImpactPageProps {
  facilities: Facility[];
  onSelectFacility: (fac: Facility) => void;
  onNavigateToSimulator: () => void;
}

export const EnvironmentalImpactPage: React.FC<EnvironmentalImpactPageProps> = ({
  facilities = [],
  onSelectFacility,
  onNavigateToSimulator,
}) => {
  const safeFacilities = facilities || [];
  const [selectedFacId, setSelectedFacId] = useState(safeFacilities[0]?.id || '');
  const facility = safeFacilities.find((f) => f.id === selectedFacId) || safeFacilities[0] || ({} as Facility);

  const components = [
    {
      name: 'Emission Score',
      weight: 0.25,
      weightLabel: '25% of composite',
      score: facility.emissionScore,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-200',
      keyParameters: [
        `Direct Scope 1 CO₂ mass flux: ${facility.emissionsCO2kTonnes} kt/yr`,
        `Sulfur dioxide stack load: ${facility.emissionsSO2Tonnes} Tonnes/yr`,
        `Nitrogen dioxide release: ${facility.emissionsNO2Tonnes} Tonnes/yr`,
        `Stack PM2.5 particulate: ${facility.emissionsPM25Tonnes} Tonnes/yr`,
      ],
      influenceMechanism:
        'Captures total mass emission load from stacks, flues, and direct process fuel combustion.',
    },
    {
      name: 'Pollution Score',
      weight: 0.20,
      weightLabel: '20% of composite',
      score: facility.pollutionScore,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      keyParameters: [
        `Ambient particulate burden around perimeter`,
        `Dispersion coefficient under local micro-meteorology`,
        `Proximity to downwind population centers`,
        `Basin atmospheric stagnation factors`,
      ],
      influenceMechanism:
        'Reflects ground-level concentration impact on human receptors and air basin compliance.',
    },
    {
      name: 'Resource Score',
      weight: 0.15,
      weightLabel: '15% of composite',
      score: facility.resourceScore,
      color: 'bg-sky-500',
      textColor: 'text-sky-700',
      bgLight: 'bg-sky-50',
      borderColor: 'border-sky-200',
      keyParameters: [
        `Freshwater withdrawal: ${facility.waterAnnualMillionLitres} Million Litres/yr`,
        `Water recycling rate: ${facility.waterRecycledPct}%`,
        `Hazardous waste generated: ${(facility.hazardousWasteTonnes / 1000).toFixed(1)}k Tonnes`,
        `Solid byproduct circularity: ${facility.wasteRecycledPct}% recycled`,
      ],
      influenceMechanism:
        'Penalizes virgin freshwater depletion and unrecovered hazardous solid discharges.',
    },
    {
      name: 'Energy Score',
      weight: 0.15,
      weightLabel: '15% of composite',
      score: facility.energyScore,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      keyParameters: [
        `Total energy requirement: ${facility.energyTotalGWh} GWh/yr`,
        `Renewable energy penetration: ${facility.renewableSharePct}%`,
        `Fossil-fuel dependence: ${100 - facility.renewableSharePct}%`,
        `Specific energy intensity: ${facility.energyIntensityGWhPerThousandTonne} GWh/kt output`,
      ],
      influenceMechanism:
        'Calculates carbon and thermal footprint of electrical and captive power intake.',
    },
    {
      name: 'Environmental Stress',
      weight: 0.15,
      weightLabel: '15% of composite',
      score: facility.environmentalStressScore,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-800',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      keyParameters: [
        `Regional cluster density in ${facility.regionName}`,
        `Soil alkalinity and NDVI vegetation stress`,
        `Aquifer water table drawdown in 15km radius`,
        `Distance to critical ecological receptors`,
      ],
      influenceMechanism:
        'Measures cumulative pressure exerted on surrounding natural buffer ecosystems.',
    },
    {
      name: 'Climate Risk Score',
      weight: 0.10,
      weightLabel: '10% of composite',
      score: facility.climateRiskScore,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgLight: 'bg-purple-50',
      borderColor: 'border-purple-200',
      keyParameters: [
        `Extreme heatwave frequency index`,
        `Flash flood and intense precipitation susceptibility`,
        `Physical asset climate resilience`,
        `Drought and cooling water disruption vulnerability`,
      ],
      influenceMechanism:
        'Evaluates vulnerability to projected climate shocks over a 10-year horizon.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="METHODOLOGICAL FOUNDATION"
        badge="SCIENTIFIC SPECIFICATION"
        title="Environmental Impact Score (0–100) Architecture"
        subtitle="Transparent, multi-criteria mathematical formulation and component sensitivity decomposition."
        icon={Scale}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Target Facility:</span>
            <select
              value={selectedFacId}
              onChange={(e) => setSelectedFacId(e.target.value)}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.sector} - Score: {f.impactScore})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Mathematical Formulation Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            Canonical Composite Equation
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Deterministic & Auditable</span>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs md:text-sm text-slate-200 overflow-x-auto">
          <span className="text-emerald-400 font-bold">ImpactScore</span> = (
          <span className="text-rose-400 font-semibold">0.25</span> × Emission) + (
          <span className="text-amber-400 font-semibold">0.20</span> × Pollution) + (
          <span className="text-sky-400 font-semibold">0.15</span> × Resource) + (
          <span className="text-indigo-400 font-semibold">0.15</span> × Energy) + (
          <span className="text-emerald-400 font-semibold">0.15</span> × Stress) + (
          <span className="text-purple-400 font-semibold">0.10</span> × ClimateRisk)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Target Facility</span>
            <span className="font-bold text-white text-xs truncate block">{facility.name}</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Calculated Result</span>
            <span className="font-extrabold text-rose-400 text-sm font-mono">{facility.impactScore} / 100</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block mb-1">Classification</span>
            <RiskBadge level={facility.riskLevel} />
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block">Simulator</span>
              <span className="font-bold text-emerald-300 text-xs">Simulate Delta</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateToSimulator}
            >
              Adjust →
            </Button>
          </div>
        </div>
      </div>

      {/* 6 Component Deep-Dive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {components.map((comp) => (
          <div
            key={comp.name}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{comp.name}</span>
                <span className={`text-base font-extrabold font-mono ${comp.textColor}`}>
                  {comp.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${comp.bgLight} ${comp.textColor} border ${comp.borderColor}`}>
                  {comp.weightLabel}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden my-2.5">
                <div className={`h-full rounded-full ${comp.color}`} style={{ width: `${comp.score}%` }} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                {comp.influenceMechanism}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Primary Parameters Evaluated:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {comp.keyParameters.map((param, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-slate-400">•</span>
                      <span>{param}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Weighted Contribution:</span>
              <strong className="text-slate-800 font-mono">
                {((comp.score * comp.weight)).toFixed(1)} pts
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Sensitivity & Methodology Notes */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Info className="w-4 h-4 text-emerald-800" />
          <span>Sensitivity Analysis & Methodological Rigor</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          The 0–100 scale is non-linearly bounded to prevent single outliers from corrupting composite regional indices while preserving high sensitivity to extreme emission spikes. Sensitivity gradients show that for heavy industrial manufacturing (Steel, Chemical, Thermal Power), clean energy transition levers (0.15 weight) coupled with direct flue scrubbers (0.25 weight) yield the steepest downward velocity on total risk score.
        </p>
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
          <strong>Scientific Disclaimer:</strong> PARIDRISHYA impact indicators are analytical proxies synthesized from reported enterprise telemetry and open-access spatial monitoring. They are designed for risk screening and prioritization, not as punitive legal certifiers.
        </div>
      </div>
    </div>
  );
};
