import React, { useState } from 'react';
import {
  Factory,
  Zap,
  Flame,
  Wind,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Filter,
  CheckCircle2,
  Layers,
  ChevronRight,
  Sliders,
  Sparkles,
  FileText,
  Landmark,
  Building2,
  Code2,
  ArrowUpRight,
} from 'lucide-react';
import { Facility, Region, SystemAlert } from '../types';
import { RegionalMap } from '../components/RegionalMap';
import { CauseImpactFlow } from '../components/CauseImpactFlow';
import { ImpactScoreCard } from '../components/ImpactScoreCard';
import { PageHeader, MetricStat, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface DashboardPageProps {
  facilities: Facility[];
  regions: Region[];
  alerts: SystemAlert[];
  onSelectFacility: (facility: Facility) => void;
  onSelectRegion: (region: Region) => void;
  onNavigate: (section: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  facilities = [],
  regions = [],
  alerts = [],
  onSelectFacility,
  onSelectRegion,
  onNavigate,
}) => {
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];
  const safeAlerts = alerts || [];

  const [selectedFacility, setSelectedFacility] = useState<Facility>(safeFacilities[0] || ({} as Facility));
  const [selectedRegion, setSelectedRegion] = useState<Region>(safeRegions[0] || ({} as Region));
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  // Aggregated KPIs
  const totalFacilities = safeFacilities.length;
  const criticalCount = safeFacilities.filter((f) => f.riskLevel === 'CRITICAL').length;
  const highCount = safeFacilities.filter((f) => f.riskLevel === 'HIGH').length;
  const totalEnergyGWh = safeFacilities.reduce((sum, f) => sum + (f.energyTotalGWh || 0), 0);
  const avgRenewablePct = Math.round(
    safeFacilities.reduce((sum, f) => sum + (f.renewableSharePct || 0), 0) / (totalFacilities || 1)
  );
  const totalCO2kTonnes = safeFacilities.reduce((sum, f) => sum + (f.emissionsCO2kTonnes || 0), 0);
  const avgImpactScore = Math.round(
    safeFacilities.reduce((sum, f) => sum + (f.impactScore || 0), 0) / (totalFacilities || 1)
  );

  const filteredFacilities =
    sectorFilter === 'ALL'
      ? safeFacilities
      : safeFacilities.filter((f) => f.sector === sectorFilter);

  const sectors = ['ALL', 'Steel', 'Thermal Power', 'Chemical', 'Cement', 'Textile', 'Automotive'];

  const quickNavModules = [
    { id: 'industrial', label: '18 Industrial Sites', icon: Factory, badge: 'Database' },
    { id: 'regional-risk', label: 'Regional GIS Map', icon: MapPin, badge: 'Spatial' },
    { id: 'impact', label: 'Environmental Impact', icon: Flame, badge: 'Decomposition' },
    { id: 'pollution', label: 'Pollution Analysis', icon: Wind, badge: 'CEMS' },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders, badge: 'Policy' },
    { id: 'prediction', label: '2027–30 Forecast', icon: TrendingUp, badge: 'Polynomial' },
    { id: 'reports', label: 'Statutory Reports', icon: FileText, badge: 'PDF Export' },
    { id: 'government', label: 'Government Portal', icon: Landmark, badge: 'Official' },
    { id: 'industry', label: 'Industry Portal', icon: Building2, badge: 'Self-Audit' },
    { id: 'api', label: 'x402 Micropayment API', icon: Code2, badge: 'Sandbox' },
  ];

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="COMMAND OVERVIEW"
        badge="BASELINE 2021–2026"
        title="Environmental Intelligence Command Overview"
        subtitle="Multi-variable analytical telemetry linking industrial throughput, energy mix, water stress, pollutant mass balance, and statutory risk thresholds."
        icon={Layers}
        actions={
          <>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Sector:</span>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={MapPin}
              onClick={() => onNavigate('regional-risk')}
            >
              Regional GIS Map
            </Button>
          </>
        }
      />

      {/* Interactive Quick-Navigation Module Ribbon */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Access Modules (Tap any to open)
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any section below or use the sidebar/navbar
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {quickNavModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-950 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs group shrink-0 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-700 group-hover:text-emerald-800 shrink-0" />
                <span>{mod.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-800">
                  {mod.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Core KPI Metric Cards (Now Clickable with Direct Navigation!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricStat
          label="Monitored Facilities"
          value={totalFacilities}
          subtext={`${criticalCount} Critical • ${highCount} High`}
          icon={Factory}
          variant={criticalCount > 0 ? 'critical' : 'default'}
          onClick={() => onNavigate('industrial')}
        />
        <MetricStat
          label="Total Energy Load"
          value={(totalEnergyGWh / 1000).toFixed(1)}
          unit="k GWh"
          subtext="18 Industrial Sites"
          icon={Zap}
          onClick={() => onNavigate('impact')}
        />
        <MetricStat
          label="Renewable Share"
          value={`${avgRenewablePct}%`}
          subtext="CPCB Target: ≥ 45%"
          icon={Zap}
          variant={avgRenewablePct >= 40 ? 'success' : 'warning'}
          onClick={() => onNavigate('what-if')}
        />
        <MetricStat
          label="Scope 1 CO₂ Load"
          value={(totalCO2kTonnes / 1000).toFixed(1)}
          unit="M kt"
          subtext="Annual Combustion"
          icon={Flame}
          onClick={() => onNavigate('pollution')}
        />
        <MetricStat
          label="Average Impact Score"
          value={`${avgImpactScore}/100`}
          subtext="High Risk Threshold: >60"
          icon={ShieldAlert}
          variant="warning"
          onClick={() => {
            onSelectFacility(selectedFacility);
            onNavigate('facility-detail');
          }}
        />
        <MetricStat
          label="Critical Corridors"
          value="6 of 8"
          subtext="Prioritized Action Req."
          icon={MapPin}
          variant="critical"
          onClick={() => onNavigate('regional-risk')}
        />
      </div>

      {/* Main Centerpiece: Interactive GIS Map & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left GIS Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                National Industrial & Environmental Risk Corridor
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">
                {filteredFacilities.length} Facilities • {regions.length} Corridors
              </span>
              <button
                onClick={() => onNavigate('regional-risk')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5"
              >
                <span>Full GIS View</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <RegionalMap
            facilities={filteredFacilities}
            regions={regions}
            selectedFacility={selectedFacility}
            selectedRegion={selectedRegion}
            onSelectFacility={(fac) => {
              setSelectedFacility(fac);
              onSelectFacility(fac);
            }}
            onSelectRegion={(reg) => {
              setSelectedRegion(reg);
              onSelectRegion(reg);
            }}
            onViewFacilityDetail={(fac) => {
              onSelectFacility(fac);
              onNavigate('facility-detail');
            }}
            onNavigateToSimulator={(fac) => {
              onSelectFacility(fac);
              onNavigate('what-if');
            }}
          />
        </div>

        {/* Right Inspection & Score Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ImpactScoreCard
            facility={selectedFacility}
            onExplainClick={() => {
              onSelectFacility(selectedFacility);
              onNavigate('facility-detail');
            }}
          />

          {/* Quick Facility Switcher */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-2.5">
            <div className="flex items-center justify-between font-bold text-slate-900 pb-1.5 border-b border-slate-100">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                Quick Facility Selector
              </span>
              <button
                onClick={() => onNavigate('industrial')}
                className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                View All {safeFacilities.length} Sites →
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {safeFacilities.slice(0, 8).map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFacility(f);
                    onSelectFacility(f);
                  }}
                  className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors text-left ${
                    selectedFacility.id === f.id
                      ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-300 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700 border border-slate-100'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block truncate text-xs font-medium text-slate-900">{f.name}</span>
                    <span className="text-[10px] text-slate-500">{f.sector} • {f.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <RiskBadge level={f.riskLevel} size="sm" />
                    {selectedFacility.id === f.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFacility(f);
                          onNavigate('facility-detail');
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 transition-colors"
                        title="Open Full Dossier"
                      >
                        Dossier →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              onClick={() => onNavigate('industrial')}
            >
              Open Complete Industrial Registry ({safeFacilities.length} Facilities)
            </Button>
          </div>
        </div>
      </div>

      {/* Causal Chain Explanatory Pipeline */}
      <CauseImpactFlow
        facility={selectedFacility}
        onNavigateToSimulator={() => onNavigate('what-if')}
      />

      {/* Actionable Decision Support Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              DECISION-SUPPORT ACTION
            </span>
            <span className="text-xs text-slate-400">Pre-Capex Environmental Modeling</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Simulate mitigation policies before capital commitment
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Test how shifting captive generation from fossil fuel to solar-wind hybrids, deploying FGD flue scrubbing, or achieving zero liquid discharge alters regional environmental risk scores.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={Sliders}
            onClick={() => onNavigate('what-if')}
          >
            Launch Scenario Studio
          </Button>
        </div>
      </div>
    </div>
  );
};
