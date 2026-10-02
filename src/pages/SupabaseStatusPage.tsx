import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Lock,
  RefreshCw,
  Terminal,
  FileCode,
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, SUPABASE_TABLES_META } from '../utils/supabaseSchema';
import { PageHeader, Button } from '../components/common/DesignSystem';

export const SupabaseStatusPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState(SUPABASE_TABLES_META[0].name);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeTableMeta = SUPABASE_TABLES_META.find((t) => t.name === selectedTable) || SUPABASE_TABLES_META[0];

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="DATABASE & INFRASTRUCTURE INTEGRATION"
        badge="SUPABASE MCP HUB"
        title="Supabase Backend & PostgreSQL Schema Engine"
        subtitle="Normalized 20-table PostgreSQL relational schema, PostGIS geospatial support, and granular Row Level Security (RLS) for Admin, Government, Industry, and Analyst roles."
        icon={Database}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopySql}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Migration SQL Copied!' : 'Copy 20-Table SQL'}
          </Button>
        }
      />

      {/* Connection & Architecture Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Backend Runtime State
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <strong className="text-slate-900 text-sm">Local Mode (Active) / Supabase Ready</strong>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Current session serves high-fidelity verified dataset; seamlessly swaps to live Supabase pool when environment keys are mounted.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Schema Completeness
          </span>
          <div className="flex items-center gap-2">
            <strong className="text-slate-900 text-sm">20 Normalized Tables + PostGIS</strong>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            No giant unstructured JSON blobs. Clean foreign keys, time-series partitioning, and automated audit triggers.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Official Supabase MCP Endpoint
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-mono font-semibold truncate">
            <span>https://mcp.supabase.com/mcp</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Inspect schema, run migrations, and manage auth policies directly via MCP tooling.
          </p>
        </div>
      </div>

      {/* Table Browser & Schema Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Table List (4 cols) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900 text-xs">
            <span>PostgreSQL Relational Tables (20)</span>
            <span className="text-[10px] text-slate-500 font-mono">Select to inspect</span>
          </div>

          <div className="max-h-[500px] overflow-y-auto space-y-1 pr-1">
            {SUPABASE_TABLES_META.map((tbl) => (
              <div
                key={tbl.name}
                onClick={() => setSelectedTable(tbl.name)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-colors text-xs flex items-center justify-between ${
                  selectedTable === tbl.name
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-800 border-slate-100'
                }`}
              >
                <div>
                  <div className="font-mono font-bold">{tbl.name}</div>
                  <div className={`text-[10px] truncate max-w-xs ${selectedTable === tbl.name ? 'text-slate-400' : 'text-slate-500'}`}>
                    {tbl.description}
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 ${
                  selectedTable === tbl.name ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tbl.columnsCount} cols
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Table Inspector & RLS Policy Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                  Schema Definition
                </span>
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  public.{activeTableMeta.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono">
                RLS ENABLED
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{activeTableMeta.description}</p>

            {/* RLS Policy Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-emerald-800" />
                <span>Enforced Row Level Security (RLS) Policy:</span>
              </div>
              <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                {activeTableMeta.rlsSummary}
              </p>
            </div>
          </div>

          {/* SQL Snippet Preview */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Migration DDL Snippet</span>
              </span>
              <button
                onClick={handleCopySql}
                className="text-emerald-400 hover:text-emerald-300 font-sans text-xs font-semibold cursor-pointer"
              >
                Copy Complete Schema Script
              </button>
            </div>

            <pre className="max-h-64 overflow-y-auto text-emerald-300 text-[11px] leading-relaxed font-mono">
              {SUPABASE_SCHEMA_SQL.substring(0, 1800)}...
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
