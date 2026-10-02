import React, { useState } from 'react';
import {
  Factory,
  Zap,
  Droplets,
  TrendingUp,
  CheckCircle2,
  Sliders,
  DollarSign,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Facility } from '../types';
import { PageHeader, MetricStat, Button, RiskBadge } from '../components/common/DesignSystem';

interface IndustryPortalPageProps {
  facilities: Facility[];
  onSelectFacility: (fac: Facility) => void;
  onNavigateToSimulator: () => void;
  onOpenReportModal: (fac: Facility) => void;
}

export const IndustryPortalPage: React.FC<IndustryPortalPageProps> = ({
  facilities = [],
  onSelectFacility,
  onNavigateToSimulator,
  onOpenReportModal,
}) => {
  const safeFacilities = facilities || [];
  const [selectedFacId, setSelectedFacId] = useState(safeFacilities[0]?.id || '');
  const facility = safeFacilities.find((f) => f.id === selectedFacId) || safeFacilities[0] || ({} as Facility);

  const sectorPeers = safeFacilities.filter(
    (f) => f.sector === facility.sector && f.id !== facility.id
  );

  const actionChecklist = [
    {
      id: 1,
      title: 'Flue Gas Desulfurization (FGD) Upgrade',
      lever: 'Emissions',
      capex: '₹42 Crore',
      payback: '2.5 Years (Penalty avoidance)',
      impactReduction: '↓ 8.2 pts in Impact Score',
      status: 'UNDER EVALUATION',
    },
    {
      id: 2,
      title: 'Captive Solar-Wind Hybrid PPA (50 MW)',
      lever: 'Energy Mix',
      capex: '₹0 (Opex PPA model)',
      payback: 'Immediate power cost reduction',
      impactReduction: '↓ 11.4 pts in Impact Score',
      status: 'READY FOR PROCUREMENT',
    },
    {
      id: 3,
      title: 'Zero Liquid Discharge (ZLD) Multi-Effect Evaporator',
      lever: 'Water Resource',
      capex: '₹18 Crore',
      payback: '3.8 Years (Raw water tariff hedge)',
      impactReduction: '↓ 6.5 pts in Impact Score',
      status: 'PLANNING PHASE',
    },
    {
      id: 4,
      title: 'Waste Heat Recovery (WHR) System on Kiln Flue',
      lever: 'Efficiency',
      capex: '₹28 Crore',
      payback: '1.9 Years',
      impactReduction: '↓ 5.1 pts in Impact Score',
      status: 'COMMISSIONED (PHASE 1)',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="PLANT OPERATOR & ESG LEAD"
        badge="DECARBONIZATION WORKSPACE"
        title="Industry Decarbonization & Compliance Portal"
        subtitle="Evaluate capital interventions, forecast compliance risk reductions, and benchmark energy efficiency against peer industrial facilities."
        icon={Factory}
        actions={
          <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-slate-500 font-medium">Target Plant:</span>
            <select
              value={selectedFacId}
              onChange={(e) => setSelectedFacId(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.sector})</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Facility Operational Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <MetricStat
          label="Composite Impact"
          value={`${facility.impactScore} / 100`}
          subtext={`${facility.riskLevel} Risk Category`}
          trend="up"
        />
        <MetricStat
          label="Renewable Energy Mix"
          value={`${facility.renewableSharePct}%`}
          subtext="Benchmark target: 45%"
          trend="down"
        />
        <MetricStat
          label="Water Circularity Rate"
          value={`${facility.waterRecycledPct}% Recycled`}
          subtext={`${facility.waterAnnualMillionLitres} ML withdrawal`}
          trend="down"
        />
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Mitigation Engine
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateToSimulator}
            icon={Sliders}
            className="w-full mt-2"
          >
            Simulate Levers
          </Button>
        </div>
      </div>

      {/* Capital Interventions & Decarbonization Action Plan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              Prioritized Capital Interventions for {facility.name}
            </span>
            <span className="text-slate-500 text-[11px]">
              Evaluated for environmental score reduction and capital expenditure payback
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenReportModal(facility)}
            icon={Download}
          >
            Export ESG Dossier
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Intervention Project</th>
                <th className="py-3 px-4">Operational Lever</th>
                <th className="py-3 px-4">Estimated CapEx</th>
                <th className="py-3 px-4">Financial Payback</th>
                <th className="py-3 px-4">Modelled Impact Reduction</th>
                <th className="py-3 px-4">Implementation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actionChecklist.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{act.title}</td>
                  <td className="py-3 px-4 text-slate-600">{act.lever}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{act.capex}</td>
                  <td className="py-3 px-4 text-slate-700">{act.payback}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{act.impactReduction}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector Peer Benchmarking */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Sector Peer Benchmarking ({facility.sector} Sector)
            </h3>
            <p className="text-[11px] text-slate-500">
              Compare energy intensity and renewable share with regional counterparts.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Peers in Registry: {sectorPeers.length + 1}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Target Facility */}
          <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs space-y-2">
            <div className="flex justify-between items-start">
              <strong className="text-emerald-950 font-bold">{facility.name} (This Plant)</strong>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-200 text-emerald-900 font-mono">ACTIVE</span>
            </div>
            <div className="text-[11px] text-slate-700 space-y-1">
              <div>Energy Intensity: <strong>{facility.energyIntensityGWhPerThousandTonne} GWh/kt</strong></div>
              <div>Renewable Share: <strong>{facility.renewableSharePct}%</strong></div>
              <div>Water Recycled: <strong>{facility.waterRecycledPct}%</strong></div>
              <div>Impact Score: <strong className="text-rose-700 font-mono">{facility.impactScore}/100</strong></div>
            </div>
          </div>

          {/* Peer Facilities */}
          {sectorPeers.slice(0, 2).map((peer) => (
            <div key={peer.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <strong className="text-slate-900 font-bold block">{peer.name}</strong>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Energy Intensity: <strong>{peer.energyIntensityGWhPerThousandTonne} GWh/kt</strong></div>
                <div>Renewable Share: <strong>{peer.renewableSharePct}%</strong></div>
                <div>Water Recycled: <strong>{peer.waterRecycledPct}%</strong></div>
                <div>Impact Score: <strong className="font-mono">{peer.impactScore}/100</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
