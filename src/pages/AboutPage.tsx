import React from 'react';
import {
  Shield,
  Factory,
  Globe,
  TrendingUp,
  Sliders,
  Coins,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            About the Platform
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PARIDRISHYA — Platform for Regional Assessment, Data, Industrial & Environmental Risk, Impact, and Sustainability Analysis
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          An integrated, explainable decision-support grid uniting industrial activity, multi-media pollution surveillance, regional ecological vulnerability, and forward-looking mitigation scenarios.
        </p>
      </div>

      {/* The Core Problem */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs leading-relaxed text-slate-700">
        <h2 className="text-base font-bold text-slate-900">
          The Problem: Fragmented Data and Retrospective Environmental Governance
        </h2>
        <p>
          Environmental governance and industrial compliance traditionally operate in fragmented silos. Stack emission monitors (CEMS), ambient air networks (CAAQMS), groundwater reports, and satellite observations exist in disparate portals with differing data standards, formats, and latencies.
        </p>
        <p>
          Consequently, regulators and industrial operators are forced into purely retrospective enforcement—detecting breaches weeks after hazardous discharges have degraded surrounding river basins and residential perimeters.
        </p>
      </div>

      {/* 5 Architectural Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Factory className="w-4 h-4 text-emerald-700" />
            <span>1. Physical Industrial Linkage</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Rather than treating ambient pollution in isolation, PARIDRISHYA explicitly tracks industrial production throughput, captive energy combustion, and raw material inputs as upstream causal drivers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>2. Explainable 0–100 Impact Score</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Eliminates black-box scoring with a transparent mathematical formulation: 0.25 Emission + 0.20 Pollution + 0.15 Resource + 0.15 Energy + 0.15 Stress + 0.10 Climate.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>3. Multi-Year Predictive Trajectories</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Continuous temporal tracking connects observed 2021–2026 baselines to 2027–2030 projections with confidence intervals and threshold-crossing alerts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>4. What-If Mitigation Simulation</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Enables plant managers and policymakers to simulate the exact environmental return on investment of clean energy, flue scrubbing, and zero liquid discharge before committing capital.
          </p>
        </div>
      </div>

      {/* Ecosystem Stakeholders */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <h3 className="font-bold text-sm text-emerald-400">
          Four Purpose-Built Stakeholder Perspectives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <strong className="text-white block mb-1">Government & Regulators</strong>
            <span className="text-slate-400 text-[11px]">Ranked inspection queues, show-cause directive support, and regional enforcement priorities.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <strong className="text-white block mb-1">Industrial Operators</strong>
            <span className="text-slate-400 text-[11px]">Peer benchmarking, decarbonization checklists, and water circularity ROI calculators.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <strong className="text-white block mb-1">Environmental Analysts</strong>
            <span className="text-slate-400 text-[11px]">Raw telemetry exports, spatial GIS layer exploration, and algorithm validation.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <strong className="text-white block mb-1">Public Transparency</strong>
            <span className="text-slate-400 text-[11px]">Open provenance registries, scientific limitations disclosure, and democratic audit access.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
