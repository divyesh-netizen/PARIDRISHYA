import React from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Building,
  Info,
} from 'lucide-react';
import { Facility, Region } from '../types';
import {
  calculateContributingFactors,
  generateExplainabilitySummary,
  generateRecommendations,
  generateFacilityTrends,
} from '../utils/calculations';

interface ReportModalProps {
  facility: Facility;
  region: Region | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  facility,
  region,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const factors = calculateContributingFactors(facility);
  const recommendations = generateRecommendations(facility);
  const explainability = generateExplainabilitySummary(facility);
  const trends = generateFacilityTrends(facility);

  const reportId = `PAR-REP-${facility.code}-${new Date().getFullYear()}-09`;
  const generationTime = '12 September 2026, 07:20:00 IST';
  const verificationHash = 'sha256:7b9e8412c934a100fb23d489ae94082cb129ef99320e8b15a67c488319e0fa91';

  // Handler for direct browser print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Handler for CSV Export
  const handleExportCsv = () => {
    const csvRows = [
      ['PARIDRISHYA Environmental Assessment Export'],
      ['Report ID', reportId],
      ['Facility Name', facility.name],
      ['Facility Code', facility.code],
      ['Sector', facility.sector],
      ['Region', facility.regionName],
      ['State', facility.state],
      ['Generated Date', generationTime],
      ['Impact Score (0-100)', facility.impactScore],
      ['Risk Level', facility.riskLevel],
      [''],
      ['Indicator', 'Score (0-100)', 'Weighted Contribution'],
      ['Emission Score', facility.emissionScore, '25%'],
      ['Pollution Score', facility.pollutionScore, '20%'],
      ['Resource Score', facility.resourceScore, '15%'],
      ['Energy Score', facility.energyScore, '15%'],
      ['Regional Stress', facility.environmentalStressScore, '15%'],
      ['Climate Risk', facility.climateRiskScore, '10%'],
      [''],
      ['Physical Metric', 'Value', 'Unit'],
      ['Annual Output', facility.productionAnnual, facility.productionUnit],
      ['Capacity Utilization', facility.capacityUtilization, '%'],
      ['Total Energy', facility.energyTotalGWh, 'GWh'],
      ['Renewable Share', facility.renewableSharePct, '%'],
      ['Water Withdrawal', facility.waterAnnualMillionLitres, 'Million Litres'],
      ['Water Recycled', facility.waterRecycledPct, '%'],
      ['CO2 Emissions', facility.emissionsCO2kTonnes, 'Kilo-Tonnes'],
      ['SO2 Emissions', facility.emissionsSO2Tonnes, 'Tonnes'],
      ['PM2.5 Emissions', facility.emissionsPM25Tonnes, 'Tonnes'],
      [''],
      ['Yearly Trend & Forecast (2021-2030)'],
      ['Year', 'Type', 'Impact Score', 'CO2 (kt)', 'PM2.5 (t)', 'Water (ML)', 'Risk'],
      ...trends.map((t) => [
        t.year,
        t.isForecast ? 'FORECAST' : 'HISTORICAL',
        t.impactScore,
        t.emissionsCO2,
        t.pm25,
        t.waterUse,
        t.riskLevel,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${facility.code}_Environmental_Audit_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Assessment Report Viewer</span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">[{reportId}]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-800 text-xs leading-relaxed print:p-0 print:space-y-4">
          {/* Formal Report Header */}
          <div className="border-b-2 border-emerald-800 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  PARIDRISHYA
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  DECISION AUDIT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Platform for Regional Assessment, Data, Industrial & Environmental Risk, Impact, and Sustainability Analysis
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Document Ref: {reportId} • Verification: {verificationHash.substring(0, 24)}...
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <div><strong>Assessment Date:</strong> {generationTime}</div>
              <div><strong>Regulatory Cycle:</strong> FY 2026-27</div>
              <div><strong>Authority:</strong> Regional Environmental Decision Support Grid</div>
            </div>
          </div>

          {/* Section 1: Facility Target Identity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Facility Name</span>
              <span className="font-bold text-slate-900 text-sm">{facility.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Industrial Sector</span>
              <span className="font-semibold text-slate-800">{facility.sector} ({facility.code})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Region & Jurisdiction</span>
              <span className="font-semibold text-slate-800">{facility.regionName}, {facility.state}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Risk Status</span>
              <span className="font-extrabold text-rose-700">{facility.riskLevel} ({facility.impactScore}/100)</span>
            </div>
          </div>

          {/* Section 2: Executive Summary */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">
              1. Executive Summary & Analytical Synthesis
            </h4>
            <p className="text-slate-700 leading-normal">
              {explainability}
            </p>
          </div>

          {/* Section 3: Component Scoring Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">
              2. Environmental Impact Indicator Decomposition
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center my-3">
              <div className="p-2 rounded bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-slate-500 font-bold block">Emission (25%)</span>
                <span className="text-base font-extrabold text-rose-700">{facility.emissionScore}</span>
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-slate-500 font-bold block">Pollution (20%)</span>
                <span className="text-base font-extrabold text-amber-700">{facility.pollutionScore}</span>
              </div>
              <div className="p-2 rounded bg-sky-50 border border-sky-200">
                <span className="text-[10px] text-slate-500 font-bold block">Resource (15%)</span>
                <span className="text-base font-extrabold text-sky-700">{facility.resourceScore}</span>
              </div>
              <div className="p-2 rounded bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] text-slate-500 font-bold block">Energy (15%)</span>
                <span className="text-base font-extrabold text-indigo-700">{facility.energyScore}</span>
              </div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold block">Env Stress (15%)</span>
                <span className="text-base font-extrabold text-emerald-700">{facility.environmentalStressScore}</span>
              </div>
              <div className="p-2 rounded bg-purple-50 border border-purple-200">
                <span className="text-[10px] text-slate-500 font-bold block">Climate (10%)</span>
                <span className="text-base font-extrabold text-purple-700">{facility.climateRiskScore}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Metrics Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">
              3. Operational & Discharge Inventory
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Annual Output</span>
                <span className="font-bold text-slate-900">{facility.productionAnnual.toLocaleString()} {facility.productionUnit}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Total Energy & RE Mix</span>
                <span className="font-bold text-slate-900">{facility.energyTotalGWh} GWh ({facility.renewableSharePct}% RE)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Annual Freshwater Intake</span>
                <span className="font-bold text-slate-900">{facility.waterAnnualMillionLitres} ML ({facility.waterRecycledPct}% recycled)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Air Mass Loading</span>
                <span className="font-bold text-slate-900">{facility.emissionsSO2Tonnes} t SO₂, {facility.emissionsPM25Tonnes} t PM2.5</span>
              </div>
            </div>
          </div>

          {/* Section 5: Prioritized Actionable Recommendations */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1 mb-2 uppercase tracking-wide">
              4. Prioritized Mitigation Interventions
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{rec.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {rec.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-slate-600 mb-1">{rec.reason}</p>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    Target: {rec.relevantMetric} • Expected Outcome: {rec.expectedBenefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Limitations & Scientific Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <span>Scientific Limitations & Disclaimer</span>
            </div>
            <p>
              PARIDRISHYA generates analytical insights from available observational and reported datasets under standard computational assumptions. Modelled impact indicators must not be interpreted as statutory certification, regulatory proof of direct causation, or formal punitive liability without independent in-situ physical validation by accredited environmental authorities.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Generated by PARIDRISHYA Environmental Intelligence Engine</span>
              <span>Document Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
