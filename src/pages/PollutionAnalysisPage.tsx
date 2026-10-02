import React, { useState } from 'react';
import {
  Wind,
  Droplets,
  Trees,
  CloudSun,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Info,
  Sliders,
  Filter,
} from 'lucide-react';
import { Facility, Region } from '../types';
import { PageHeader, RiskBadge } from '../components/common/DesignSystem';

interface PollutionAnalysisPageProps {
  facilities: Facility[];
  regions: Region[];
}

export const PollutionAnalysisPage: React.FC<PollutionAnalysisPageProps> = ({
  facilities = [],
  regions = [],
}) => {
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];
  const [activeTab, setActiveTab] = useState<'AIR' | 'WATER' | 'SOIL' | 'CLIMATE'>('AIR');
  const [selectedFacilityId, setSelectedFacilityId] = useState(safeFacilities[0]?.id || '');

  const facility = safeFacilities.find((f) => f.id === selectedFacilityId) || safeFacilities[0] || ({} as Facility);

  const airParameters = [
    {
      name: 'Fine Particulate (PM2.5)',
      value: `${Math.round(facility.emissionsPM25Tonnes / 12)} µg/m³`,
      threshold: '60 µg/m³ (NAAQS 24h)',
      severity: 'CRITICAL',
      trend: 'RISING',
      source: 'Boiler combustion & sintering flue discharge',
      sensorTag: 'CPCB-CEMS-STACK-01',
    },
    {
      name: 'Coarse Particulate (PM10)',
      value: `${Math.round(facility.emissionsPM10Tonnes / 8)} µg/m³`,
      threshold: '100 µg/m³ (NAAQS 24h)',
      severity: 'HIGH',
      trend: 'STABLE',
      source: 'Fugitive raw material handling & dust transfer',
      sensorTag: 'CPCB-AAQMS-FENCE-02',
    },
    {
      name: 'Sulfur Dioxide (SO₂)',
      value: `${Math.round(facility.emissionsSO2Tonnes / 25)} µg/m³`,
      threshold: '80 µg/m³ (NAAQS 24h)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'High-sulfur fuel combustion in captive power unit',
      sensorTag: 'CPCB-CEMS-SO2-03',
    },
    {
      name: 'Nitrogen Dioxide (NO₂)',
      value: `${Math.round(facility.emissionsNO2Tonnes / 30)} µg/m³`,
      threshold: '80 µg/m³ (NAAQS 24h)',
      severity: 'MODERATE',
      trend: 'FALLING',
      source: 'Thermal NOx from high-temperature blast furnaces',
      sensorTag: 'CPCB-CEMS-NOX-04',
    },
    {
      name: 'Carbon Monoxide (CO)',
      value: '2.4 mg/m³',
      threshold: '4.0 mg/m³ (NAAQS 8h)',
      severity: 'SAFE',
      trend: 'STABLE',
      source: 'Incomplete hydrocarbon oxidation in kilns',
      sensorTag: 'CPCB-AAQMS-CO-01',
    },
    {
      name: 'Tropospheric Ozone (O₃)',
      value: '118 µg/m³',
      threshold: '100 µg/m³ (NAAQS 8h)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Photochemical secondary reaction of NOx & VOCs',
      sensorTag: 'SATELLITE-TROPOMI-O3',
    },
  ];

  const waterParameters = [
    {
      name: 'Effluent pH Balance',
      value: '7.8 pH',
      threshold: '6.5 – 8.5 pH',
      severity: 'SAFE',
      trend: 'STABLE',
      source: 'Neutralized process wastewater treatment plant',
      sensorTag: 'ETP-OUTLET-PH-01',
    },
    {
      name: 'Biological Oxygen Demand (BOD)',
      value: '38 mg/L',
      threshold: '30 mg/L (Max discharge)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Organic discharge from scrubber blowdown',
      sensorTag: 'ETP-LAB-BOD-SAMPLE',
    },
    {
      name: 'Chemical Oxygen Demand (COD)',
      value: '280 mg/L',
      threshold: '250 mg/L (Max discharge)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Industrial chemical washing and solvent effluent',
      sensorTag: 'ETP-ONLINE-COD-02',
    },
    {
      name: 'Total Dissolved Solids (TDS)',
      value: '2,450 mg/L',
      threshold: '2,100 mg/L (Standard)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Cooling tower blowdown & RO reject stream',
      sensorTag: 'ETP-ONLINE-TDS-03',
    },
    {
      name: 'Heavy Metals (Chromium / Lead)',
      value: '0.12 mg/L',
      threshold: '0.10 mg/L',
      severity: 'CRITICAL',
      trend: 'STABLE',
      source: 'Electroplating & slag runoff leaching',
      sensorTag: 'ICP-MS-LAB-METALS',
    },
  ];

  const soilParameters = [
    {
      name: 'Heavy Metal Deposition (Lead/Cadmium)',
      value: '18.4 mg/kg',
      threshold: '15.0 mg/kg (Permissible background)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Airborne fly ash and particulate fallout within 5km',
      sensorTag: 'ISRO-SOIL-GEOCHEM-1',
    },
    {
      name: 'Soil Quality Index (SQI)',
      value: '52 / 100',
      threshold: '> 70 (Healthy agricultural baseline)',
      severity: 'HIGH',
      trend: 'FALLING',
      source: 'Continuous industrial corridor acid gas deposition',
      sensorTag: 'NBSS-LUP-SAMPLE-08',
    },
    {
      name: 'Industrial Buffer Runoff Index',
      value: '74 / 100',
      threshold: '< 50 (Low hazard runoff)',
      severity: 'CRITICAL',
      trend: 'RISING',
      source: 'Unpaved coal and ore storage yard stormwater wash',
      sensorTag: 'SURFACE-RUNOFF-STATION-01',
    },
  ];

  const climateParameters = [
    {
      name: 'Local Surface Temperature Anomaly',
      value: '+1.8 °C',
      threshold: '+1.5 °C (Paris climate reference)',
      severity: 'HIGH',
      trend: 'RISING',
      source: 'Urban/industrial heat island and flare thermal radiance',
      sensorTag: 'ERA5-LAND-THERMAL-GRID',
    },
    {
      name: 'Annual Monsoon Rainfall Deviation',
      value: '-18%',
      threshold: '±10% (Normal monsoon variability)',
      severity: 'HIGH',
      trend: 'FALLING',
      source: 'Regional hydroclimatic variability in river basin',
      sensorTag: 'IMD-DISTRICT-PRECIP',
    },
    {
      name: 'Heatwave Exposure Index',
      value: '42 Days/yr > 42°C',
      threshold: '20 Days/yr historical baseline',
      severity: 'CRITICAL',
      trend: 'RISING',
      source: 'Subcontinental summer thermal depression',
      sensorTag: 'NASA-MODIS-LST-GRID',
    },
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'AIR':
        return airParameters;
      case 'WATER':
        return waterParameters;
      case 'SOIL':
        return soilParameters;
      case 'CLIMATE':
        return climateParameters;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'MODERATE':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'SAFE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'RISING':
        return <TrendingUp className="w-3.5 h-3.5 text-rose-600" />;
      case 'FALLING':
        return <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="ENVIRONMENTAL RECEPTOR SURVEILLANCE"
        badge="NAAQS & CPCB NORMS"
        title="Multi-Media Pollution & Atmospheric Stress Analysis"
        subtitle="Continuous telemetry surveillance across Atmospheric Air, Effluent & Watershed Stress, Soil Chemistry, and Hydro-Climate stressors."
        icon={Wind}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Facility Perimeter:</span>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.sector})</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('AIR')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'AIR'
              ? 'bg-slate-900 text-white border-slate-950 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-emerald-400" />
          <span>Atmospheric & Stack Air ({airParameters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('WATER')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'WATER'
              ? 'bg-slate-900 text-white border-slate-950 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>Effluent & Watershed Stress ({waterParameters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SOIL')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'SOIL'
              ? 'bg-slate-900 text-white border-slate-950 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Trees className="w-3.5 h-3.5 text-amber-400" />
          <span>Soil & Deposition ({soilParameters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CLIMATE')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeTab === 'CLIMATE'
              ? 'bg-slate-900 text-white border-slate-950 shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <CloudSun className="w-3.5 h-3.5 text-purple-400" />
          <span>Hydro-Climate Anomaly ({climateParameters.length})</span>
        </button>
      </div>

      {/* Parameters Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs">
            Observed & Telemetric Receptors around <strong className="text-emerald-900">{facility.name}</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-400">NAAQS & CPCB Gazette Norms Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3.5">Parameter Name</th>
                <th className="py-2.5 px-3.5 font-mono">Observed Value</th>
                <th className="py-2.5 px-3.5">Safe / Regulatory Benchmark</th>
                <th className="py-2.5 px-3.5">Severity Status</th>
                <th className="py-2.5 px-3.5">Trend Direction</th>
                <th className="py-2.5 px-3.5">Primary Physical Cause</th>
                <th className="py-2.5 px-3.5 font-mono">Telemetry Stream Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {getActiveList().map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">{p.name}</td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{p.value}</td>
                  <td className="py-2.5 px-3.5 text-slate-600 font-mono text-[11px]">{p.threshold}</td>
                  <td className="py-2.5 px-3.5">
                    <RiskBadge level={p.severity === 'SAFE' ? 'LOW' : p.severity} size="sm" />
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      {getTrendIcon(p.trend)}
                      <span className="text-[11px]">{p.trend}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 max-w-xs">{p.source}</td>
                  <td className="py-2.5 px-3.5 font-mono text-[10px] text-slate-400">{p.sensorTag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
