import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Shield,
  Layers,
  Search,
} from 'lucide-react';
import { Facility, Region } from '../types';
import { ReportModal } from '../components/ReportModal';
import { PageHeader, RiskBadge, Button, Card } from '../components/common/DesignSystem';

interface ReportsPageProps {
  facilities: Facility[];
  regions: Region[];
  onOpenReportModal: (facility: Facility) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  facilities = [],
  regions = [],
  onOpenReportModal,
}) => {
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];
  const [selectedFacility, setSelectedFacility] = useState<Facility>(safeFacilities[0] || ({} as Facility));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState('FACILITY_ASSESSMENT');

  const reportTemplates = [
    {
      id: 'FACILITY_ASSESSMENT',
      title: 'Facility Environmental Impact Assessment',
      subtitle: 'Complete 6-factor score, operational mass balance, and prioritized recommendations',
      targetType: 'Per-Facility',
      badge: 'OFFICIAL AUDIT',
    },
    {
      id: 'REGIONAL_RISK_SUMMARY',
      title: 'Regional Ecosystem Risk & Cluster Summary',
      subtitle: 'Corridor ambient air quality, watershed vulnerability, and sensitive natural receptors',
      targetType: 'Per-Region',
      badge: 'GOVERNMENT BRIEF',
    },
    {
      id: 'INDUSTRIAL_CLUSTER_BENCHMARK',
      title: 'Industrial Sector Benchmark & Decarbonization Audit',
      subtitle: 'Cross-facility energy intensity, renewable share, and compliance gap analysis',
      targetType: 'Multi-Facility',
      badge: 'INDUSTRY BENCHMARK',
    },
    {
      id: 'MITIGATION_DOSSIER',
      title: 'What-If Mitigation Scenario Dossier',
      subtitle: 'Projected environmental capital expenditure return on investment and avoided carbon',
      targetType: 'Scenario Model',
      badge: 'POLICY DOSSIER',
    },
  ];

  const handleOpenReport = (fac: Facility) => {
    setSelectedFacility(fac);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="OFFICIAL DECISION AUDIT ARCHIVE"
        badge="STATUTORY REPORTS"
        title="Environmental Impact Reports & Regulatory Dossiers"
        subtitle="Generate verifiable, publication-ready environmental audits with deterministic cryptographic hashes and statutory formats."
        icon={FileText}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenReport(selectedFacility)}
            icon={Printer}
          >
            Generate Active Dossier
          </Button>
        }
      />

      {/* Report Template Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {reportTemplates.map((t) => (
          <div
            key={t.id}
            onClick={() => setReportType(t.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              reportType === t.id
                ? 'bg-slate-900 text-white border-slate-950 shadow-sm ring-1 ring-slate-900'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  reportType === t.id ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.badge}
                </span>
                <span className={`text-[10px] font-mono ${reportType === t.id ? 'text-slate-400' : 'text-slate-500'}`}>{t.targetType}</span>
              </div>
              <h4 className="font-bold text-xs leading-snug mb-1">{t.title}</h4>
              <p className={`text-[11px] leading-relaxed ${reportType === t.id ? 'text-slate-300' : 'text-slate-500'}`}>
                {t.subtitle}
              </p>
            </div>

            <div className={`mt-3.5 pt-2 border-t text-[10px] font-semibold ${
              reportType === t.id ? 'border-slate-800 text-emerald-400' : 'border-slate-100 text-emerald-800'
            }`}>
              {reportType === t.id ? '● Active Selection' : 'Select Template →'}
            </div>
          </div>
        ))}
      </div>

      {/* Available Facility Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="font-bold text-slate-900">
            Available Facility Audit Reports ({safeFacilities.length})
          </div>
          <span className="text-[11px] font-mono text-slate-500">Printable A4 / PDF layout supported</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3.5">Facility & Report ID</th>
                <th className="py-2.5 px-3.5">Sector & State</th>
                <th className="py-2.5 px-3.5 font-mono">Impact Score</th>
                <th className="py-2.5 px-3.5">Risk Category</th>
                <th className="py-2.5 px-3.5 font-mono">Last Verified</th>
                <th className="py-2.5 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeFacilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-slate-900">{fac.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">PAR-REP-{fac.code}-2026</div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600">
                    <div className="font-medium text-slate-800">{fac.sector}</div>
                    <div className="text-[10px] text-slate-500">{fac.state}</div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900 tabular-nums">
                    {fac.impactScore} / 100
                  </td>
                  <td className="py-2.5 px-3.5">
                    <RiskBadge level={fac.riskLevel} size="sm" />
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                    {fac.lastUpdated}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReport(fac)}
                        icon={Printer}
                      >
                        View Dossier
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Active Modal */}
      {isModalOpen && (
        <ReportModal
          facility={selectedFacility}
          region={safeRegions.find((r) => r.id === selectedFacility.regionId) || null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
