import React, { useState, useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Droplets,
  Zap,
  Wind,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Facility, WhatIfInputs } from '../types';
import { calculateScenario } from '../utils/calculations';

interface WhatIfSimulatorProps {
  facility: Facility;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ facility }) => {
  const initialInputs: WhatIfInputs = {
    renewableEnergyPct: Math.min(100, facility.renewableSharePct + 25),
    fossilFuelReductionPct: 20,
    productionLevelPct: 100,
    waterReductionPct: 25,
    emissionReductionPct: 30,
    wasteRecyclingPct: 80,
    energyEfficiencyPct: 15,
  };

  const [inputs, setInputs] = useState<WhatIfInputs>(initialInputs);

  // Apply quick presets
  const applyPreset = (type: 'clean-energy' | 'zld' | 'aggressive-decarb' | 'conservative') => {
    switch (type) {
      case 'clean-energy':
        setInputs({
          renewableEnergyPct: 60,
          fossilFuelReductionPct: 35,
          productionLevelPct: 100,
          waterReductionPct: 10,
          emissionReductionPct: 20,
          wasteRecyclingPct: 70,
          energyEfficiencyPct: 20,
        });
        break;
      case 'zld':
        setInputs({
          renewableEnergyPct: facility.renewableSharePct,
          fossilFuelReductionPct: 5,
          productionLevelPct: 100,
          waterReductionPct: 55,
          emissionReductionPct: 10,
          wasteRecyclingPct: 92,
          energyEfficiencyPct: 10,
        });
        break;
      case 'aggressive-decarb':
        setInputs({
          renewableEnergyPct: 75,
          fossilFuelReductionPct: 50,
          productionLevelPct: 100,
          waterReductionPct: 40,
          emissionReductionPct: 50,
          wasteRecyclingPct: 85,
          energyEfficiencyPct: 30,
        });
        break;
      case 'conservative':
        setInputs({
          renewableEnergyPct: facility.renewableSharePct + 10,
          fossilFuelReductionPct: 10,
          productionLevelPct: 100,
          waterReductionPct: 15,
          emissionReductionPct: 15,
          wasteRecyclingPct: 65,
          energyEfficiencyPct: 10,
        });
        break;
    }
  };

  const simulation = useMemo(() => {
    return calculateScenario(facility, inputs);
  }, [facility, inputs]);

  const resetToDefaults = () => {
    setInputs(initialInputs);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              What-If Mitigation Scenario Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulating policy levers on <strong className="text-slate-800">{facility.name}</strong> ({facility.sector})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Strategy Buttons */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Mitigation Presets:
        </span>
        <button
          onClick={() => applyPreset('clean-energy')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          Captive RE Transition (60% RE)
        </button>
        <button
          onClick={() => applyPreset('zld')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors"
        >
          Zero Liquid Discharge (55% Water Cut)
        </button>
        <button
          onClick={() => applyPreset('aggressive-decarb')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors"
        >
          Deep Industrial Decarb (50% Flue cut, 75% RE)
        </button>
        <button
          onClick={() => applyPreset('conservative')}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Moderate Near-Term
        </button>
      </div>

      {/* Dual Column Layout: Sliders (Left) vs Recalculated Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        {/* Left: Interactive Input Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Operational & Policy Levers</span>
              <span className="text-[10px] text-slate-400 font-normal">Adjust to model outcomes</span>
            </h4>

            {/* Slider 1: Renewable Energy % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Renewable Energy Share
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {inputs.renewableEnergyPct}%{' '}
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Baseline: {facility.renewableSharePct}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={inputs.renewableEnergyPct}
                onChange={(e) =>
                  setInputs({ ...inputs, renewableEnergyPct: Number(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: Emission Reduction % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-rose-500" />
                  Flue Gas Emission Reduction (FGD / Bagfilters)
                </span>
                <span className="font-mono font-bold text-rose-700">
                  {inputs.emissionReductionPct}% cut
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={inputs.emissionReductionPct}
                onChange={(e) =>
                  setInputs({ ...inputs, emissionReductionPct: Number(e.target.value) })
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Slider 3: Water Reduction % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  Freshwater Withdrawal Reduction (Recycling / ZLD)
                </span>
                <span className="font-mono font-bold text-sky-700">
                  {inputs.waterReductionPct}% saved
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="5"
                value={inputs.waterReductionPct}
                onChange={(e) =>
                  setInputs({ ...inputs, waterReductionPct: Number(e.target.value) })
                }
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Slider 4: Fossil Fuel Reduction % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">
                  Direct Fossil Combustion Abatement
                </span>
                <span className="font-mono font-bold text-indigo-700">
                  {inputs.fossilFuelReductionPct}% reduction
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={inputs.fossilFuelReductionPct}
                onChange={(e) =>
                  setInputs({ ...inputs, fossilFuelReductionPct: Number(e.target.value) })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Slider 5: Energy Efficiency % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">
                  Energy Efficiency Improvements (VFDs, WHR)
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {inputs.energyEfficiencyPct}% reduction
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="2"
                value={inputs.energyEfficiencyPct}
                onChange={(e) =>
                  setInputs({ ...inputs, energyEfficiencyPct: Number(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 6: Production Level % */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">
                  Industrial Output Volume Scale
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {inputs.productionLevelPct}% of rated capacity
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="130"
                step="5"
                value={inputs.productionLevelPct}
                onChange={(e) =>
                  setInputs({ ...inputs, productionLevelPct: Number(e.target.value) })
                }
                className="w-full accent-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Recalculated Two-Column Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Modelled Comparison
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                RECALCULATED
              </span>
            </div>

            {/* Impact Score Transition Box */}
            <div className="grid grid-cols-2 gap-3 py-4 text-center border-b border-slate-800">
              <div className="p-3 bg-slate-800/60 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                  Current Baseline
                </span>
                <span className="text-3xl font-extrabold text-slate-200 block mt-1">
                  {simulation.baseline.impactScore}
                </span>
                <span className="text-[10px] font-bold text-rose-400 uppercase">
                  {simulation.baseline.riskLevel}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 rounded-lg">
                <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                  Simulated Scenario
                </span>
                <span className="text-3xl font-extrabold text-emerald-400 block mt-1">
                  {simulation.scenario.impactScore}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase">
                  {simulation.scenario.riskLevel}
                </span>
              </div>
            </div>

            {/* Delta Percentage Highlight */}
            <div className="flex items-center justify-between py-3 border-b border-slate-800 text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Overall Impact Score Improvement:
              </span>
              <span className="text-lg font-extrabold text-emerald-400">
                ↓ {simulation.improvementPct}%
              </span>
            </div>

            {/* Component Comparison Table */}
            <div className="space-y-2 py-3 text-xs border-b border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 pb-1">
                <span>Indicator</span>
                <span>Baseline → Scenario</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Emission Score</span>
                <span className="font-mono">
                  {simulation.baseline.emissionScore} → <strong className="text-emerald-400">{simulation.scenario.emissionScore}</strong>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Energy Score</span>
                <span className="font-mono">
                  {simulation.baseline.energyScore} → <strong className="text-emerald-400">{simulation.scenario.energyScore}</strong>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Resource / Water</span>
                <span className="font-mono">
                  {simulation.baseline.resourceScore} → <strong className="text-emerald-400">{simulation.scenario.resourceScore}</strong>
                </span>
              </div>
            </div>

            {/* Real Environmental Savings Estimate */}
            <div className="grid grid-cols-2 gap-2 pt-3 text-[11px]">
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Avoided Carbon</span>
                <strong className="text-emerald-300 text-sm">
                  {simulation.co2AvoidedKiloTonnes.toLocaleString()} kt CO₂
                </strong>
              </div>
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Freshwater Saved</span>
                <strong className="text-sky-300 text-sm">
                  {simulation.waterSavedMillionLitres.toLocaleString()} ML
                </strong>
              </div>
            </div>

            {/* Highest-Impact Intervention Callout */}
            <div className="mt-3 p-2.5 bg-emerald-900/40 border border-emerald-700/60 rounded-lg text-[11px] text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Dominant Intervention:</strong>
                {simulation.highestImpactIntervention}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
