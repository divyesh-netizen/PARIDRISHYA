import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  Layers,
  ShieldAlert,
  Trees,
  Droplets,
  Wind,
  Users,
  ChevronRight,
  Info,
  Thermometer,
  CloudRain,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { Facility, Region } from '../types';
import { RegionalMap } from '../components/RegionalMap';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface RegionalRiskPageProps {
  regions: Region[];
  facilities: Facility[];
  onSelectFacility: (fac: Facility) => void;
  onNavigateToDetail: (fac: Facility) => void;
}

export const RegionalRiskPage: React.FC<RegionalRiskPageProps> = ({
  regions = [],
  facilities = [],
  onSelectFacility,
  onNavigateToDetail,
}) => {
  const safeRegions = regions || [];
  const safeFacilities = facilities || [];

  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredRegions =
    riskFilter === 'ALL'
      ? safeRegions
      : safeRegions.filter((r) => r.riskLevel === riskFilter);

  const filteredFacilities =
    riskFilter === 'ALL'
      ? safeFacilities
      : safeFacilities.filter((f) => f.riskLevel === riskFilter);

  const [selectedRegionId, setSelectedRegionId] = useState<string>(safeRegions[0]?.id || '');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    safeFacilities.find((f) => f.regionId === safeRegions[0]?.id)?.id || safeFacilities[0]?.id || ''
  );

  const selectedRegion =
    safeRegions.find((r) => r.id === selectedRegionId) ||
    filteredRegions[0] ||
    safeRegions[0] ||
    null;

  const selectedFacility =
    safeFacilities.find((f) => f.id === selectedFacilityId) ||
    safeFacilities.find((f) => f.regionId === selectedRegion?.id) ||
    safeFacilities[0] ||
    null;

  const regionFacilities = selectedRegion
    ? safeFacilities.filter((f) => f.regionId === selectedRegion.id)
    : [];

  // Dynamic natural receptors helper based on geographic basin
  const getSensitiveReceptors = (reg: Region | null): string[] => {
    if (!reg) return ['River Basin Catchment', 'Agricultural Buffer Zone'];
    if (reg.state === 'Tamil Nadu') {
      return ['Noyyal River Basin', 'Cauvery Delta Receptors', 'Nilgiri Biosphere Buffer Zone'];
    }
    if (reg.state === 'Andhra Pradesh') {
      return ['Godavari Estuary Receptors', 'Coringa Mangrove Habitat', 'Bay Coastal Marine Shelf'];
    }
    if (reg.state === 'Madhya Pradesh') {
      return ['Rihand River Basin', 'Govind Ballabh Pant Sagar Reservoir', 'Kaimur Forest Range Buffer'];
    }
    if (reg.state === 'Karnataka') {
      return ['Tungabhadra River Basin', 'Daroji Wildlife Corridor', 'Hampi Cultural Buffer Aquifer'];
    }
    if (reg.state === 'Gujarat') {
      return ['Narmada Estuary Marine Zone', 'Gulf of Khambhat Mudflats', 'Shoolpaneshwar Wildlife Area'];
    }
    if (reg.state === 'Chhattisgarh') {
      return ['Hasdeo River Watershed', 'Achanakmar Biosphere Forest', 'Mahanadi Headwaters Receptors'];
    }
    if (reg.state === 'Odisha') {
      return ['Brahmani River Basin', 'Chilika Wetland Aquifer', 'Similipal Biosphere Fringe'];
    }
    return [
      `${reg.name.split(' ')[0]} River Watershed`,
      'Primary Agricultural Aquifer',
      'Community Habitation Buffer',
    ];
  };

  // Dynamic regional pressure drivers helper
  const getKeyDrivers = (reg: Region | null): string[] => {
    if (!reg) return ['Industrial Emission Dispersion', 'Groundwater Depletion Stress'];
    const drivers: string[] = [];
    if (reg.dominantRiskDriver) {
      drivers.push(reg.dominantRiskDriver);
    }
    if (reg.airQualityIndex > 150) {
      drivers.push(`Ambient Air Basin Saturation (AQI ${reg.airQualityIndex})`);
    }
    if (reg.waterStressLevel === 'Severe' || reg.waterStressLevel === 'High') {
      drivers.push(`Critical Aquifer Depletion (${reg.waterStressLevel} Water Stress)`);
    }
    if (reg.forestCoverPct && reg.forestCoverPct < 25) {
      drivers.push(`Constrained Ecological Canopy (${reg.forestCoverPct}% Forest Cover)`);
    }
    if (drivers.length < 3) {
      drivers.push('Concentrated Industrial Flue Gas Dispersion & Thermal Load');
    }
    return drivers;
  };

  // Population density calculation
  const populationDensity = selectedRegion
    ? Math.round(
        ((selectedRegion.populationMillion || 2.5) * 1000000) / (selectedRegion.areaSqKm || 5000)
      )
    : 450;

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="REGIONAL GIS & ECOSYSTEM VULNERABILITY"
        badge="SPATIAL ANALYTICS"
        title="Spatial Environmental Risk & Cluster Analysis"
        subtitle="Geographic vulnerability scoring integrating ambient air basins, river watershed stress, demographic exposure, and sensitive ecological receptors."
        icon={MapPin}
        actions={
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Risk Filter:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories ({safeRegions.length})</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate Risk</option>
            </select>
          </div>
        }
      />

      {/* Main Split Layout: Interactive GIS Map (67%) + Regional Vulnerability Inspector (33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Large Interactive GIS Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <RegionalMap
            facilities={filteredFacilities}
            regions={filteredRegions}
            selectedFacility={selectedFacility}
            selectedRegion={selectedRegion}
            onSelectFacility={(fac) => {
              setSelectedFacilityId(fac.id);
              onSelectFacility(fac);
              const parentReg = safeRegions.find((r) => r.id === fac.regionId);
              if (parentReg) {
                setSelectedRegionId(parentReg.id);
              }
            }}
            onSelectRegion={(reg) => {
              setSelectedRegionId(reg.id);
              const firstFac = safeFacilities.find((f) => f.regionId === reg.id);
              if (firstFac) {
                setSelectedFacilityId(firstFac.id);
                onSelectFacility(firstFac);
              }
            }}
            onViewFacilityDetail={(fac) => {
              onNavigateToDetail(fac);
            }}
          />

          {/* Regional Corridor Quick Selector Pills */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Industrial Corridor / Basin:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {safeRegions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegionId(reg.id);
                    const fac = safeFacilities.find((f) => f.regionId === reg.id);
                    if (fac) {
                      setSelectedFacilityId(fac.id);
                      onSelectFacility(fac);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRegion?.id === reg.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {reg.name} ({reg.state})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Regional Vulnerability & Cluster Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedRegion ? (
            /* Selected Region Detailed Card */
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Regional Basin Dossier
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{selectedRegion.name}</h3>
                  <span className="text-xs text-slate-500">
                    {selectedRegion.state} • {selectedRegion.areaSqKm?.toLocaleString() || 5000} km²
                  </span>
                </div>
                <RiskBadge level={selectedRegion.riskLevel} size="sm" />
              </div>

              {/* Regional Vulnerability Score */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Ecosystem Vulnerability Index
                  </span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                    {selectedRegion.avgImpactScore}{' '}
                    <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </span>
                </div>
                <ShieldAlert className="w-6 h-6 text-amber-700" />
              </div>

              {/* Receptors & Environmental Pressure Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">Density</span>
                  </div>
                  <span className="font-bold font-mono text-slate-800">
                    {populationDensity} / km²
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Pop: {selectedRegion.populationMillion || 2.1}M
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Trees className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">Canopy</span>
                  </div>
                  <span className="font-bold font-mono text-slate-800">
                    {selectedRegion.forestCoverPct}%
                  </span>
                  <span className="block text-[10px] text-slate-500">Forest Buffer</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Wind className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">AQI</span>
                  </div>
                  <span className="font-bold font-mono text-rose-800">
                    {selectedRegion.airQualityIndex}
                  </span>
                  <span className="block text-[10px] text-slate-500 truncate">
                    {selectedRegion.airQualityIndex > 200
                      ? 'Very Poor'
                      : selectedRegion.airQualityIndex > 100
                      ? 'Moderate / Poor'
                      : 'Satisfactory'}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">Water</span>
                  </div>
                  <span className="font-bold text-sky-900 truncate block">
                    {selectedRegion.waterStressLevel}
                  </span>
                  <span className="block text-[10px] text-slate-500">Aquifer Stress</span>
                </div>
              </div>

              {/* Sensitive Natural Receptors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Sensitive Natural Receptors in Basin:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {getSensitiveReceptors(selectedRegion).map((rec) => (
                    <span
                      key={rec}
                      className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Risk Drivers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  Primary Regional Pressure Drivers:
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {getKeyDrivers(selectedRegion).map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-800 font-bold">•</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center py-8 text-slate-500 text-xs">
              Select a region on the map or corridor pills above to inspect vulnerability metrics.
            </div>
          )}

          {/* Facilities in Selected Region */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-900 text-xs pb-1.5 border-b border-slate-100">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                Facilities in Corridor ({regionFacilities.length})
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {regionFacilities.length > 0 ? (
                regionFacilities.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedFacilityId(f.id);
                      onSelectFacility(f);
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors text-xs flex items-center justify-between ${
                      selectedFacility?.id === f.id
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <span className="font-bold text-slate-900 block truncate">{f.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {f.sector} • {f.code}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-xs block">
                        {f.impactScore}/100
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToDetail(f);
                        }}
                        className="text-[10px] text-emerald-800 hover:underline font-semibold cursor-pointer"
                      >
                        Dossier →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">
                  No facilities in this corridor filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
