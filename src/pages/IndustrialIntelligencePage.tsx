import React, { useState, useMemo } from 'react';
import {
  Factory,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Zap,
  Droplets,
  Flame,
  Download,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Facility, Region, RiskLevel } from '../types';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface IndustrialIntelligencePageProps {
  facilities: Facility[];
  regions: Region[];
  onSelectFacility: (facility: Facility) => void;
  onNavigateToDetail: (facility: Facility) => void;
  onOpenReportModal: (facility: Facility) => void;
}

export const IndustrialIntelligencePage: React.FC<IndustrialIntelligencePageProps> = ({
  facilities = [],
  regions = [],
  onSelectFacility,
  onNavigateToDetail,
  onOpenReportModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [sortField, setSortField] = useState<keyof Facility>('impactScore');
  const [sortAsc, setSortAsc] = useState(false);

  const sectors = ['ALL', 'Steel', 'Thermal Power', 'Chemical', 'Cement', 'Textile', 'Refinery', 'Automotive', 'Aluminium', 'Mining'];
  const riskLevels = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  const filteredFacilities = useMemo(() => {
    let list = [...(facilities || [])];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.code.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.sector.toLowerCase().includes(q)
      );
    }

    if (selectedSector !== 'ALL') {
      list = list.filter((f) => f.sector === selectedSector);
    }

    if (selectedRegion !== 'ALL') {
      list = list.filter((f) => f.regionId === selectedRegion);
    }

    if (selectedRisk !== 'ALL') {
      list = list.filter((f) => f.riskLevel === selectedRisk);
    }

    // Sort
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [facilities, search, selectedSector, selectedRegion, selectedRisk, sortField, sortAsc]);

  const handleSort = (field: keyof Facility) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="INDUSTRIAL INTELLIGENCE REGISTRY"
        badge="STATUTORY AUDIT & EMISSIONS"
        title="Industrial Facility Activity & Emissions Directory"
        subtitle="Operational throughput, energy mix, water withdrawal, pollutant mass balance, and multi-factor modelled environmental impact across tracked industrial sites."
        icon={Factory}
        actions={
          <div className="text-right text-xs">
            <span className="text-slate-500 block">Registry Coverage</span>
            <span className="text-emerald-900 font-bold font-mono">
              {filteredFacilities.length} of {facilities.length} Active Sites
            </span>
          </div>
        }
      />

      {/* Filter Controls Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility name, code, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-lg">
            <span className="text-slate-500 shrink-0 text-[11px] font-medium">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-lg">
            <span className="text-slate-500 shrink-0 text-[11px] font-medium">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Regions ({regions.length})</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 border border-slate-200 rounded-lg">
            <span className="text-slate-500 shrink-0 text-[11px] font-medium">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {riskLevels.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-mono text-[11px]">
            Filtered: <strong>{filteredFacilities.length}</strong> of {facilities.length} records
          </span>
          {(search || selectedSector !== 'ALL' || selectedRegion !== 'ALL' || selectedRisk !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedSector('ALL');
                setSelectedRegion('ALL');
                setSelectedRisk('ALL');
              }}
              className="text-emerald-800 font-semibold hover:underline text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Facilities Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th
                  onClick={() => handleSort('name')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Facility & Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3.5">Sector</th>
                <th className="py-2.5 px-3.5">Region / State</th>
                <th
                  onClick={() => handleSort('productionAnnual')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Output</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('energyTotalGWh')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Energy (RE %)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('waterAnnualMillionLitres')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Water</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('emissionsCO2kTonnes')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>CO₂ / SO₂</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('impactScore')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Impact Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3.5 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFacilities.map((fac) => (
                <tr
                  key={fac.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  onClick={() => onNavigateToDetail(fac)}
                >
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {fac.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{fac.code}</div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {fac.sector}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600">
                    <div className="font-medium text-slate-800">{fac.regionName}</div>
                    <div className="text-[10px] text-slate-400">{fac.state}</div>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums text-slate-800">
                    {(fac.productionAnnual / 1000).toFixed(0)}k {fac.productionUnit.split(' ')[0]}
                    <span className="block text-[10px] text-slate-400">{fac.capacityUtilization}% cap</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums">
                    <span className="text-slate-900 font-semibold">{fac.energyTotalGWh} GWh</span>
                    <span className="block text-[10px] text-emerald-800 font-medium">
                      {fac.renewableSharePct}% RE
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums text-slate-800">
                    <span>{fac.waterAnnualMillionLitres} ML</span>
                    <span className="block text-[10px] text-sky-800">{fac.waterRecycledPct}% recycled</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono tabular-nums">
                    <span className="text-slate-900">{fac.emissionsCO2kTonnes} kt</span>
                    <span className="block text-[10px] text-amber-800">{fac.emissionsSO2Tonnes} t SO₂</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right">
                    <div className="inline-flex flex-col items-end gap-0.5">
                      <span className="text-xs font-bold font-mono text-slate-900">{fac.impactScore}/100</span>
                      <RiskBadge level={fac.riskLevel} size="sm" />
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigateToDetail(fac)}
                        className="p-1.5 text-slate-400 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors"
                        title="View Facility Intelligence Dossier"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenReportModal(fac)}
                        className="p-1.5 text-slate-400 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors"
                        title="Generate Official Audit Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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
