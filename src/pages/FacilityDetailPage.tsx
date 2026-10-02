import React, { useState } from 'react';
import {
  Factory,
  Zap,
  Flame,
  Droplets,
  Wind,
  Trees,
  Sliders,
  FileText,
  Printer,
  ChevronLeft,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Facility, Region } from '../types';
import {
  calculateContributingFactors,
  generateExplainabilitySummary,
  generateRecommendations,
  generateFacilityTrends,
} from '../utils/calculations';
import { ImpactScoreCard } from '../components/ImpactScoreCard';
import { CauseImpactFlow } from '../components/CauseImpactFlow';
import { ForecastChart } from '../components/ForecastChart';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface FacilityDetailPageProps {
  facility: Facility;
  region: Region | null;
  onBack: () => void;
  onOpenSimulator: () => void;
  onOpenReportModal: () => void;
}

export const FacilityDetailPage: React.FC<FacilityDetailPageProps> = ({
  facility,
  region,
  onBack,
  onOpenSimulator,
  onOpenReportModal,
}) => {
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState<string | null>(null);

  if (!facility || !facility.id) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600 text-sm">No facility selected or available.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={onBack}
          className="mt-3"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const contributingFactors = calculateContributingFactors(facility);
  const recommendations = generateRecommendations(facility);
  const explainability = generateExplainabilitySummary(facility);
  const trends = generateFacilityTrends(facility);

  const handleFetchAiSynthesis = async () => {
    setAiSummaryLoading(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityId: facility.id }),
      });
      const data = await res.json();
      setAiGeneratedSummary(data.summary);
    } catch {
      setAiGeneratedSummary(explainability);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Back Navigation & Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Industrial Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSimulator}
            icon={Sliders}
          >
            Simulate Mitigation
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenReportModal}
            icon={FileText}
          >
            Generate Official Audit Report
          </Button>
        </div>
      </div>

      {/* Facility Master Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
              {facility.code}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              {facility.sector} SECTOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              STATUS: {facility.operationalStatus}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Last synced: {facility.lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {facility.name}
          </h1>

          <div className="text-xs text-slate-500">
            Location: <strong className="text-slate-700">{facility.regionName}</strong>, {facility.state} • Coordinates: {facility.coordinates.lat.toFixed(4)}°N, {facility.coordinates.lng.toFixed(4)}°E
          </div>
        </div>

        {/* Impact Badge */}
        <div className="flex items-center gap-3 shrink-0 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Modelled Impact</span>
            <span className="text-2xl font-bold font-mono tracking-tight text-rose-800">{facility.impactScore}/100</span>
          </div>
          <RiskBadge level={facility.riskLevel} />
        </div>
      </div>

      {/* Synthesis / Explainability Card */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Environmental Intelligence Summary
            </h3>
          </div>
          <button
            onClick={handleFetchAiSynthesis}
            disabled={aiSummaryLoading}
            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{aiSummaryLoading ? 'Synthesizing...' : 'Request Gemini AI Synthesis'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {aiGeneratedSummary || explainability}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          <Info className="w-3 h-3" />
          <span>Synthesized dynamically from operational mass-balance, CEMS telemetry, and regional receptor indicators.</span>
        </div>
      </div>

      {/* Key Analytical Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        {/* Profile 1: Industrial Profile */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Industrial Profile</span>
            <Factory className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Annual Production:</span>
              <span className="font-mono font-semibold text-slate-900">
                {(facility.productionAnnual / 1000).toFixed(0)}k {facility.productionUnit.split(' ')[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Capacity Utilization:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.capacityUtilization}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Raw Material Inflow:</span>
              <span className="font-mono font-semibold text-slate-900">
                {(facility.rawMaterialTonnes / 1000).toFixed(0)}k Tonnes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Operating Status:</span>
              <span className="font-semibold text-emerald-800">{facility.operationalStatus}</span>
            </div>
          </div>
        </div>

        {/* Profile 2: Energy Profile */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Energy Profile</span>
            <Zap className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Consumption:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.energyTotalGWh} GWh/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Renewable Energy:</span>
              <span className="font-mono font-semibold text-emerald-800">{facility.renewableSharePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fossil Dependence:</span>
              <span className="font-mono font-semibold text-rose-800">{100 - facility.renewableSharePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Energy Intensity:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.energyIntensityGWhPerThousandTonne} GWh/kt</span>
            </div>
          </div>
        </div>

        {/* Profile 3: Resource & Water */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Resource Profile</span>
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Water Intake:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.waterAnnualMillionLitres} ML/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Water Recycled:</span>
              <span className="font-mono font-semibold text-sky-800">{facility.waterRecycledPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hazardous Waste:</span>
              <span className="font-mono font-semibold text-slate-900">{(facility.hazardousWasteTonnes / 1000).toFixed(1)}k Tonnes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Solid Waste Recycled:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.wasteRecycledPct}%</span>
            </div>
          </div>
        </div>

        {/* Profile 4: Emissions Inventory */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Emissions Profile</span>
            <Flame className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">CO₂ (Direct Scope 1):</span>
              <span className="font-mono font-semibold text-slate-900">{facility.emissionsCO2kTonnes} kt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SO₂ Mass Load:</span>
              <span className="font-mono font-semibold text-amber-800">{facility.emissionsSO2Tonnes} Tonnes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NO₂ Mass Load:</span>
              <span className="font-mono font-semibold text-slate-900">{facility.emissionsNO2Tonnes} Tonnes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PM2.5 Mass Load:</span>
              <span className="font-mono font-semibold text-rose-800">{facility.emissionsPM25Tonnes} Tonnes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributing Factors Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ranked Contributing Factors to Environmental Impact Score
            </h3>
            <p className="text-[11px] text-slate-500">
              Modelled analytical contribution percentages based on multi-factor weighting.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            EXPLAINABILITY ENGINE
          </span>
        </div>

        <div className="space-y-3">
          {contributingFactors.map((factor, index) => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{factor.name}</span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">— {factor.description}</span>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {factor.percentage}% <span className="text-[10px] text-slate-500 font-normal">(Raw Score: {factor.score})</span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-rose-600' : index === 1 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${factor.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Causal Flow Component */}
      <CauseImpactFlow facility={facility} onNavigateToSimulator={onOpenSimulator} />

      {/* Forecast Chart */}
      <ForecastChart trends={trends} facilityName={facility.name} />

      {/* Prioritized Mitigation Recommendations */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Actionable Mitigation Recommendations
            </h3>
            <p className="text-[11px] text-slate-500">
              Targeted interventions synthesized from dominant operational risk components.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {recommendations.length} Recommended Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 leading-snug">{rec.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {rec.priority}
                </span>
              </div>
              <p className="text-slate-600">{rec.reason}</p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] space-y-0.5">
                <div className="text-slate-700"><strong>Target Metric:</strong> {rec.relevantMetric}</div>
                <div className="text-emerald-800 font-semibold"><strong>Expected Outcome:</strong> {rec.expectedBenefit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
