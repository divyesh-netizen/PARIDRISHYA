import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Facility } from '../types';
import { generateFacilityTrends } from '../utils/calculations';
import { ForecastChart } from '../components/ForecastChart';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface PredictionPageProps {
  facilities: Facility[];
  onNavigateToSimulator: () => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  facilities = [],
  onNavigateToSimulator,
}) => {
  const safeFacilities = facilities || [];
  const [selectedFacId, setSelectedFacId] = useState(safeFacilities[0]?.id || '');
  const [horizon, setHorizon] = useState<'1yr' | '3yr' | '5yr' | '10yr'>('5yr');

  const facility = safeFacilities.find((f) => f.id === selectedFacId) || safeFacilities[0] || ({} as Facility);
  const trends = facility?.id ? generateFacilityTrends(facility) : [];

  const baseline2026 = trends.find((t) => t.year === 2026)?.impactScore || facility?.impactScore || 0;
  const targetYear = horizon === '1yr' ? 2027 : horizon === '3yr' ? 2029 : 2030;
  const projectedTarget = trends.find((t) => t.year === targetYear)?.impactScore || 0;
  const isCrossingCritical = projectedTarget >= 80 && baseline2026 < 80;

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="PREDICTIVE HORIZON ENGINE"
        badge="TEMPORAL PROJECTIONS"
        title="Temporal Trajectory: Historical (2021–2026) → Projections (2027–2030)"
        subtitle="Forward-looking environmental impact modeling, threshold crossing alerts, and confidence bounds."
        icon={TrendingUp}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Facility:</span>
            <select
              value={selectedFacId}
              onChange={(e) => setSelectedFacId(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {safeFacilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.sector})</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Trajectory Alert Banner */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <strong className="text-amber-950 text-sm">Trajectory Alert for {facility.name}</strong>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
              BUSINESS AS USUAL (BAU)
            </span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            Under unmitigated operating assumptions, the Environmental Impact Score is projected to shift from{' '}
            <strong>{baseline2026}</strong> in 2026 to <strong>{projectedTarget}</strong> by {targetYear}.
            {isCrossingCritical
              ? ' This trajectory risks breaching the CRITICAL REGULATORY THRESHOLD (≥ 80 pts).'
              : ' Active interventions in captive energy decarbonization can avert compounding regional stress.'}
          </p>
        </div>
      </div>

      {/* Horizon Switcher */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Select Forecasting Horizon:</span>
        </span>

        <div className="flex items-center gap-1.5">
          {(['1yr', '3yr', '5yr', '10yr'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${
                horizon === h
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {h === '1yr' ? '1 Year (2027)' : h === '3yr' ? '3 Years (2029)' : h === '5yr' ? '5 Years (2030)' : '10 Years (2035)'}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Chart Component */}
      <ForecastChart trends={trends} facilityName={facility.name} />

      {/* Historical vs Forecast Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Temporal Record & Modelled Projections (2021 to 2030)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Confidence Band: ±8.4%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3.5">Year</th>
                <th className="py-2.5 px-3.5">Phase</th>
                <th className="py-2.5 px-3.5 font-mono">Impact Score</th>
                <th className="py-2.5 px-3.5 font-mono">CO₂ (kt)</th>
                <th className="py-2.5 px-3.5 font-mono">PM2.5 (Tonnes)</th>
                <th className="py-2.5 px-3.5 font-mono">Water Use (ML)</th>
                <th className="py-2.5 px-3.5 font-mono">Energy (GWh)</th>
                <th className="py-2.5 px-3.5">Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {trends.map((t) => (
                <tr
                  key={t.year}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    t.year === 2026 ? 'bg-emerald-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">{t.year}</td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        t.isForecast
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t.isForecast ? 'FORECAST' : 'HISTORICAL'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 tabular-nums">{t.impactScore} / 100</td>
                  <td className="py-2.5 px-3.5 text-slate-700 tabular-nums">{t.emissionsCO2.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-slate-700 tabular-nums">{t.pm25.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-slate-700 tabular-nums">{t.waterUse.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-slate-700 tabular-nums">{t.energyGWh.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5">
                    <RiskBadge level={t.riskLevel} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
