import React from 'react';
import { ShieldAlert, Info, HelpCircle, ArrowUpRight } from 'lucide-react';
import { Facility, RiskLevel } from '../types';

interface ImpactScoreCardProps {
  facility: Facility;
  onExplainClick?: () => void;
}

export const ImpactScoreCard: React.FC<ImpactScoreCardProps> = ({
  facility,
  onExplainClick,
}) => {
  const getBadgeStyle = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'MODERATE':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'LOW':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 81) return 'text-rose-600';
    if (score >= 61) return 'text-amber-600';
    if (score >= 31) return 'text-sky-600';
    return 'text-emerald-600';
  };

  const components = [
    {
      name: 'Emission Score',
      weight: 0.25,
      score: facility.emissionScore,
      unit: 'Weight: 25%',
      color: 'bg-rose-500',
    },
    {
      name: 'Pollution Score',
      weight: 0.20,
      score: facility.pollutionScore,
      unit: 'Weight: 20%',
      color: 'bg-amber-500',
    },
    {
      name: 'Resource Score',
      weight: 0.15,
      score: facility.resourceScore,
      unit: 'Weight: 15%',
      color: 'bg-sky-500',
    },
    {
      name: 'Energy Score',
      weight: 0.15,
      score: facility.energyScore,
      unit: 'Weight: 15%',
      color: 'bg-indigo-500',
    },
    {
      name: 'Environmental Stress',
      weight: 0.15,
      score: facility.environmentalStressScore,
      unit: 'Weight: 15%',
      color: 'bg-emerald-600',
    },
    {
      name: 'Climate Risk Score',
      weight: 0.10,
      score: facility.climateRiskScore,
      unit: 'Weight: 10%',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Analytical Metric
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              MODELLED
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(
              facility.riskLevel
            )}`}
          >
            {facility.riskLevel} RISK
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 leading-tight">
          Environmental Impact Score
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Multi-variable weighted composite indicator (0 to 100)
        </p>

        {/* Large Score Metric Display */}
        <div className="flex items-baseline gap-3 my-4">
          <span className={`text-4xl font-extrabold tracking-tight ${getScoreColor(facility.impactScore)}`}>
            {facility.impactScore}
          </span>
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">/ 100</span>
            <span className="block text-[10px] text-slate-400">
              High risk threshold: &gt; 60
            </span>
          </div>
        </div>

        {/* Weighted Component Breakdown */}
        <div className="space-y-2.5 my-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pb-1 border-b border-slate-100">
            <span>Component Indicator</span>
            <span>Score (Weight)</span>
          </div>
          {components.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{c.name}</span>
                <span className="font-bold text-slate-800">
                  {c.score}/100 <span className="text-[10px] text-slate-400 font-normal">({c.unit})</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.color}`}
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Responsibility Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Scientific Disclaimer:</strong> PARIDRISHYA Impact Score is an analytical model synthesized from reported production, telemetry, and regional indicators. It is not a substitute for official statutory certifications.
          </span>
        </div>

        {onExplainClick && (
          <button
            onClick={onExplainClick}
            className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <span>Explain Contributing Factors</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
