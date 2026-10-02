import React from 'react';
import {
  Database,
  ShieldCheck,
  Radio,
  Clock,
  MapPin,
  FileText,
  Activity,
} from 'lucide-react';
import { DataSourceMetadata } from '../types';
import { PageHeader, DataStatusBadge } from '../components/common/DesignSystem';

interface DataSourcesPageProps {
  sources: DataSourceMetadata[];
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({ sources = [] }) => {
  const safeSources = sources || [];

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="DATA TRANSPARENCY & PROVENANCE REGISTRY"
        badge="STATUTORY AUDIT"
        title="Integrated Data Sources & Provenance Metadata"
        subtitle="Full statutory disclosure of continuous emissions telemetry, ambient monitoring networks, satellite observation grids, and computational models."
        icon={Database}
        actions={
          <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Registries:</span>
            <strong className="text-slate-900 font-mono">{safeSources.length} Verified Channels</strong>
          </div>
        }
      />

      {/* Data Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeSources.map((src) => {
          const paramList = typeof src.parameter === 'string'
            ? src.parameter.split(',').map((p) => p.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={src.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">
                      {src.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {src.dataset}
                    </h3>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {src.source}
                    </span>
                  </div>
                  <DataStatusBadge status={src.dataStatus} />
                </div>

                <div className="space-y-2.5 py-2.5 text-xs">
                  {/* Parameter Tags */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Parameters Ingested:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {paramList.map((param) => (
                        <span
                          key={param}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage in Model */}
                  {src.usage && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                      <strong className="text-slate-700 block text-[10px] uppercase font-semibold mb-0.5">
                        Computational Use:
                      </strong>
                      {src.usage}
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Update Frequency:</span>
                      <strong className="text-slate-800 font-mono text-xs">{src.updateFrequency}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Temporal Depth:</span>
                      <strong className="text-slate-800 font-mono text-xs">{src.temporalResolution}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Spatial Resolution:</span>
                      <strong className="text-slate-800 text-xs">{src.spatialResolution}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Measurement Unit:</span>
                      <strong className="text-slate-800 font-mono text-xs">{src.unit}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="font-medium">Data Pipeline Active & Verified</span>
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
