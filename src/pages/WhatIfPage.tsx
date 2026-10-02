import React, { useState } from 'react';
import { Sliders, Sparkles, Building, Info, FileSpreadsheet } from 'lucide-react';
import { Facility } from '../types';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { PageHeader, Card } from '../components/common/DesignSystem';

interface WhatIfPageProps {
  facilities: Facility[];
}

export const WhatIfPage: React.FC<WhatIfPageProps> = ({ facilities = [] }) => {
  const safeFacilities = facilities || [];
  const [selectedFacId, setSelectedFacId] = useState(safeFacilities[0]?.id || '');
  const facility = safeFacilities.find((f) => f.id === selectedFacId) || safeFacilities[0] || ({} as Facility);

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="POLICY & INTERVENTION SIMULATOR"
        badge="DYNAMIC DECARBONIZATION"
        title="What-If Environmental Scenario Studio"
        subtitle="Model the systemic environmental benefits of clean energy substitution, flue scrubbing, and water circularity prior to capital expenditure."
        icon={Sliders}
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Target Facility:</span>
            <select
              value={selectedFacId}
              onChange={(e) => setSelectedFacId(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {safeFacilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.sector} • Score: {f.impactScore})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Simulator Component */}
      <WhatIfSimulator facility={facility} />

      {/* Methodology Guide */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-emerald-800" />
          <span>Intervention Modeling Methodology</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          The simulator dynamically scales operational throughput, energy mix, and mass flow balances through PARIDRISHYA’s deterministic formula. Avoided carbon is calculated using the baseline grid emission factor (0.82 kg CO₂/kWh for fossil combustion displacement). Water conservation calculations account for internal cycle recycling and zero liquid discharge recovery rates.
        </p>
      </div>
    </div>
  );
};
