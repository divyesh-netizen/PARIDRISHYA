import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Building,
  CheckCircle,
  TrendingDown,
  Filter,
  Download,
  Printer,
  ChevronRight,
  MapPin,
  Flame,
  Scale,
} from 'lucide-react';
import { Facility, Region } from '../types';
import { PageHeader, MetricStat, Button, RiskBadge } from '../components/common/DesignSystem';

interface GovernmentPortalPageProps {
  facilities: Facility[];
  regions: Region[];
  onSelectFacility: (fac: Facility) => void;
  onNavigateToDetail: (fac: Facility) => void;
  onNavigateToSimulator: () => void;
}

export const GovernmentPortalPage: React.FC<GovernmentPortalPageProps> = ({
  facilities = [],
  regions = [],
  onSelectFacility,
  onNavigateToDetail,
  onNavigateToSimulator,
}) => {
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];
  const [selectedState, setSelectedState] = useState('ALL');

  const states = ['ALL', 'Odisha', 'Chhattisgarh', 'Gujarat', 'Jharkhand', 'Tamil Nadu', 'Rajasthan'];

  const filteredFacilities =
    selectedState === 'ALL'
      ? safeFacilities
      : safeFacilities.filter((f) => f.state === selectedState);

  // Ranked monitoring priorities: Highest impact scores
  const monitoringPriorities = [...filteredFacilities]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 6);

  // High-risk clusters
  const criticalRegions = safeRegions.filter((r) => r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH');

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="REGULATORY AUTHORITY & STATUTORY ENFORCEMENT"
        badge="GOVERNMENT COMMAND"
        title="Environmental Compliance & Enforcement Dashboard"
        subtitle="Prioritize on-site inspections, identify non-compliant emissions exceedances, and coordinate multi-basin mitigation interventions."
        icon={Scale}
        actions={
          <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Jurisdiction:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Enforcement Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <MetricStat
          label="Target Inspection Queue"
          value={`${monitoringPriorities.length} Priority Units`}
          subtext="Exceeding 65/100 threshold"
          trend="down"
        />
        <MetricStat
          label="High-Risk Corridors"
          value={`${criticalRegions.length} Active Basins`}
          subtext="Ecosystem vulnerability > 70"
          trend="up"
        />
        <MetricStat
          label="Mitigation Levers"
          value="-28.4%"
          subtext="Max potential score recovery"
          trend="down"
        />
        <MetricStat
          label="Registry Sync"
          value="100% Verified"
          subtext="CPCB CEMS Gateway Active"
        />
      </div>

      {/* Monitoring Priority Queue (Immediate Inspection) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              Prioritized On-Site Inspection & Audit Queue
            </span>
            <span className="text-slate-500 text-[11px]">
              Ranked dynamically by Composite Environmental Impact Score and population proximity
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            URGENT ACTIONS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Priority Rank</th>
                <th className="py-3 px-4">Facility Name & Sector</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Composite Score</th>
                <th className="py-3 px-4">Primary Enforcement Concern</th>
                <th className="py-3 px-4">Recommended Statutory Action</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monitoringPriorities.map((fac, idx) => (
                <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{fac.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{fac.code} • {fac.sector}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{fac.regionName}</div>
                    <div className="text-[10px] text-slate-500">{fac.state}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-rose-700 text-sm">
                    {fac.impactScore} / 100
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px]">
                    {fac.sector === 'Steel'
                      ? 'High stack SO₂ mass discharge & slag dust'
                      : fac.sector === 'Thermal Power'
                      ? 'Heavy coal combustion & ash pond leaching'
                      : 'TOC / COD effluent limit breach'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold">
                      Issue Section 5 Show-Cause Directive
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onNavigateToDetail(fac)}
                    >
                      Audit Dossier →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Priority Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <span>High-Priority Regional Interventions</span>
          </h3>
          <p className="text-xs text-slate-600">
            Basins where collective multi-unit compliance yields the highest ecosystem regeneration:
          </p>

          <div className="space-y-2">
            {criticalRegions.slice(0, 4).map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{r.name} ({r.state})</span>
                  <span className="text-[11px] text-slate-500">AQI: {r.airQualityIndex} • Water: {r.waterStressLevel}</span>
                </div>
                <span className="font-mono font-bold text-rose-700 text-xs">
                  Stress: {r.avgImpactScore}/100
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Statutory Policy Simulator</span>
          </h3>
          <p className="text-xs text-slate-600">
            Before mandating new emission caps or zero liquid discharge standards, run computational scenarios across all industrial corridors.
          </p>
          <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-2">
            <strong className="text-emerald-950 block font-semibold">Cross-Corridor Mitigation Potential</strong>
            <p className="text-emerald-900 text-[11px] leading-relaxed">
              Enforcing a 30% captive renewable quota in the Angul-Talcher and Korba corridors would lower regional ambient PM2.5 by ~18% and avoid 8.4M tonnes CO₂ annually.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateToSimulator}
            >
              Open Policy Simulator →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
