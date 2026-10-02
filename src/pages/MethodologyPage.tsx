import React from 'react';
import {
  Scale,
  BookOpen,
  Info,
  ShieldAlert,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              PEER-AUDITABLE METHODOLOGY
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Methodological Framework & Analytical Principles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent documentation of mathematical formulations, normalization protocols, and scientific limitations.
          </p>
        </div>
      </div>

      {/* Methodology Chapters */}
      <div className="space-y-4">
        {/* Chapter 1: Data Ingestion & Quality Control */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Data Ingestion, Cleansing & Robust Normalization</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Raw observational streams from CPCB CEMS, satellite observations (Sentinel-5P, MODIS), and enterprise annual filings undergo automated outlier removal (winsorization at the 1st and 99th percentiles) and spatial interpolation. Values are normalized to a standard scale (0 to 100) using min-max scaling bounded by statutory NAAQS and CPCB industry-specific effluent standards.
          </p>
        </div>

        {/* Chapter 2: Impact Score Weight Derivation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Composite Environmental Impact Score Formulation</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The composite Environmental Impact Score applies an Analytic Hierarchy Process (AHP) weighted linear combination across six core dimensions:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
            Impact Score = (0.25 × Emission) + (0.20 × Pollution) + (0.15 × Resource) + (0.15 × Energy) + (0.15 × Stress) + (0.10 × Climate)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Weights were determined via expert environmental consensus to balance direct point-source discharge responsibility (45% emissions + pollution) with broader systemic resource depletion and regional ecological resilience (55%).
          </p>
        </div>

        {/* Chapter 3: Spatial Risk & Receptors */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Spatial Buffer Modeling & Vulnerability Decay</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Geographic vulnerability utilizes an exponential distance-decay model. Facilities within a 5 km radius of protected wildlife sanctuaries, major rivers (Ganga, Mahanadi, Damodar), or densely populated urban clusters receive an escalated vulnerability multiplier (up to 1.35x), reflecting diminished natural carrying capacity and elevated public health sensitivity.
          </p>
        </div>

        {/* Chapter 4: Multi-Year Predictive Modeling */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">4</span>
            <span>Temporal Projections & Confidence Interval Estimation</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Future trajectories (2027–2030) are simulated using damped autoregressive time-series models conditioned on historical 2021–2026 enterprise records and planned sector expansion targets. Confidence intervals (±8.4% mean margin) account for inter-annual meteorological variation and macroeconomic throughput shifts.
          </p>
        </div>
      </div>

      {/* Statutory Disclaimer Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Statutory Disclaimer & Scientific Scope</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          PARIDRISHYA is an analytical and decision-support platform engineered to synthesize, interpret, and model environmental and industrial telemetry. The Environmental Impact Score, predictive trajectories, and What-If scenario simulations are algorithmic models. They do not constitute statutory compliance certifications, legal liability determinations, or replacements for official on-ground Environmental Impact Assessments (EIA) conducted by accredited statutory bodies under the Environment (Protection) Act, 1986.
        </p>
      </div>
    </div>
  );
};
