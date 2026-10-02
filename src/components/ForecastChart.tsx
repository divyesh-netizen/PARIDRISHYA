import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { YearlyTrend } from '../types';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';

interface ForecastChartProps {
  trends: YearlyTrend[];
  facilityName: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  trends,
  facilityName,
}) => {
  const [metricKey, setMetricKey] = useState<
    'impactScore' | 'emissionsCO2' | 'pm25' | 'waterUse' | 'energyGWh'
  >('impactScore');

  const metricsConfig = {
    impactScore: {
      label: 'Environmental Impact Score',
      unit: 'Score (0-100)',
      color: '#e11d48', // rose-600
      stroke: '#e11d48',
      highThreshold: 60,
    },
    emissionsCO2: {
      label: 'Direct CO₂ Emissions',
      unit: 'Kilo-Tonnes',
      color: '#ea580c', // orange-600
      stroke: '#ea580c',
    },
    pm25: {
      label: 'Fine Particulate (PM2.5) Load',
      unit: 'Tonnes / Year',
      color: '#d97706', // amber-600
      stroke: '#d97706',
    },
    waterUse: {
      label: 'Freshwater Withdrawal',
      unit: 'Million Litres',
      color: '#0284c7', // sky-600
      stroke: '#0284c7',
    },
    energyGWh: {
      label: 'Total Energy Consumption',
      unit: 'GWh',
      color: '#4f46e5', // indigo-600
      stroke: '#4f46e5',
    },
  };

  const activeConfig = metricsConfig[metricKey];

  // Prepare chart dataset
  const chartData = trends.map((t) => ({
    year: `${t.year}`,
    isForecast: t.isForecast,
    value: t[metricKey],
    confidenceLow: t.confidenceInterval?.low ?? t[metricKey] * 0.95,
    confidenceHigh: t.confidenceInterval?.high ?? t[metricKey] * 1.05,
    risk: t.riskLevel,
  }));

  const baseline2026 = trends.find((t) => t.year === 2026)?.[metricKey] || 0;
  const projected2030 = trends.find((t) => t.year === 2030)?.[metricKey] || 0;
  const deltaPct =
    baseline2026 > 0
      ? Math.round(((projected2030 - baseline2026) / baseline2026) * 1000) / 10
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Temporal Trajectory: Past (2021–2026) → Forecast (2027–2030)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Modelled analytical projection for <strong className="text-slate-800">{facilityName}</strong>
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setMetricKey('impactScore')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              metricKey === 'impactScore'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Impact Score
          </button>
          <button
            onClick={() => setMetricKey('emissionsCO2')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              metricKey === 'emissionsCO2'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CO₂ Emissions
          </button>
          <button
            onClick={() => setMetricKey('pm25')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              metricKey === 'pm25'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PM2.5 Load
          </button>
          <button
            onClick={() => setMetricKey('waterUse')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              metricKey === 'waterUse'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Water Intake
          </button>
          <button
            onClick={() => setMetricKey('energyGWh')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              metricKey === 'energyGWh'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Energy
          </button>
        </div>
      </div>

      {/* Trajectory KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            2026 Observed Baseline
          </span>
          <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
            {baseline2026} <span className="text-[10px] font-normal text-slate-500">{activeConfig.unit}</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            2030 Modelled Projection
          </span>
          <span className="text-base font-extrabold text-rose-600 mt-0.5 block">
            {projected2030} <span className="text-[10px] font-normal text-slate-500">{activeConfig.unit}</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Expected Trajectory
          </span>
          <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
            {deltaPct > 0 ? `+${deltaPct}%` : `${deltaPct}%`}
            <span className="text-[10px] font-normal text-slate-500 ml-1">over 4 years</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Algorithm
          </span>
          <span className="text-xs font-semibold text-slate-700 mt-0.5 block truncate">
            Damped Polynomial + Covariance
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: unknown) => {
                if (typeof val === 'number') {
                  return [`${val} ${activeConfig.unit}`, activeConfig.label];
                }
                return [String(val), activeConfig.label];
              }}
              labelFormatter={(label) => `Year: ${String(label)} ${Number(label) > 2026 ? '(FORECAST)' : '(HISTORICAL)'}`}
            />
            {/* Division between historical & forecast */}
            <ReferenceLine
              x="2026"
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: 'Present Day (2026)',
                position: 'top',
                fill: '#64748b',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={activeConfig.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#forecastFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Values for 2021–2026 are baseline records; 2027–2030 are calculated under business-as-usual assumption.
          </span>
        </div>
        <span className="font-semibold text-slate-600">Model Confidence: Moderate (±8%)</span>
      </div>
    </div>
  );
};
